import { useMutation } from '@apollo/client';
import {
  createTransfer,
  encodeURL,
  fetchTransaction,
  findReference,
  FindReferenceError,
  parseURL,
  validateTransfer,
  ValidateTransferError,
} from '@solana/pay';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  ConfirmedSignatureInfo,
  Keypair,
  PublicKey,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { SAVE_TRANSACTION_INVOICE } from 'queries';
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Logger, routes } from 'utils';
import { useConfig } from '../hooks/useConfig';
import { PaymentContext, PaymentStatus } from '../hooks/usePayment';
import { Confirmations } from '../types';
import { message as messageComponent } from 'components-library';
import { useCart } from 'hooks/cart';
import { useStore } from 'hooks/store';
import { useCurrency } from 'hooks/currency';

export interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: FC<PaymentProviderProps> = ({ children }) => {
  const { connection } = useConnection();
  const {
    link,
    recipient,
    splToken,
    label,
    message,
    requiredConfirmations,
    connectWallet,
  } = useConfig();
  const { publicKey, sendTransaction } = useWallet();

  const { currency, network } = useCurrency();

  const [amount, setAmount] = useState<BigNumber>();
  const [memo, setMemo] = useState<string>();
  const [reference, setReference] = useState<PublicKey>();
  const [signature, setSignature] = useState<TransactionSignature>();
  const [status, setStatus] = useState(PaymentStatus.New);
  const [confirmations, setConfirmations] = useState<Confirmations>(0);
  const [customerWalletAddress, setCustomerWalletAddress] = useState('');
  const navigate = useNavigate();
  const progress = useMemo(
    () => confirmations / requiredConfirmations,
    [confirmations, requiredConfirmations]
  );

  const [saveTransactionInvoice, { loading: saveTransactionInvoiceIsLoading }] =
    useMutation(SAVE_TRANSACTION_INVOICE);

  const { getCartSummaryForInvoice, resetCart } = useCart();

  const { store, refetchInventory } = useStore();

  const url = useMemo(() => {
    if (link) {
      const url = new URL(String(link));

      url.searchParams.append('recipient', recipient.toBase58());

      if (amount) {
        url.searchParams.append(
          'amount',
          amount.toFixed(amount.decimalPlaces())
        );
      }

      if (splToken) {
        url.searchParams.append('spl-token', splToken.toBase58());
      }

      if (reference) {
        url.searchParams.append('reference', reference.toBase58());
      }

      if (memo) {
        url.searchParams.append('memo', memo);
      }

      if (label) {
        url.searchParams.append('label', label);
      }

      const icon =
        'https://dev-alt-gate-products.s3.amazonaws.com/products/62d6eac56b495730c25ce3ac-67716cb3-80a3-4a37-9347-d7a2833563a2.shoes.webp';

      if (icon) {
        url.searchParams.append('icon', icon);
      }

      if (message) {
        url.searchParams.append('message', message);
      }

      return encodeURL({ link: url });
    } else {
      return encodeURL({
        recipient,
        amount,
        splToken,
        reference,
        label,
        message,
        memo,
      });
    }
  }, [link, recipient, amount, splToken, reference, label, message, memo]);

  const reset = useCallback(() => {
    setAmount(undefined);
    setMemo(undefined);
    setReference(undefined);
    setSignature(undefined);
    setStatus(PaymentStatus.New);
    setConfirmations(0);
  }, []);

  const generate = useCallback(() => {
    if (status === PaymentStatus.New && !reference) {
      setReference(Keypair.generate().publicKey);
      setStatus(PaymentStatus.Pending);
    }
  }, [status, reference]);

  // If there's a connected wallet, use it to sign and send the transaction
  useEffect(() => {
    if (status === PaymentStatus.Pending && connectWallet && publicKey) {
      let changed = false;

      const run = async () => {
        try {
          const request = parseURL(url);
          let transaction: Transaction;

          if ('link' in request) {
            const { link } = request;
            transaction = await fetchTransaction(connection, publicKey, link);
          } else {
            const { recipient, amount, splToken, reference, memo } = request;
            if (!amount) return;

            transaction = await createTransfer(connection, publicKey, {
              recipient,
              amount,
              splToken,
              reference,
              memo,
            });
          }

          if (!changed) {
            await sendTransaction(transaction, connection);
          }
        } catch (error) {
          // If the transaction is declined or fails, try again
          Logger.error(error);
          timeout = setTimeout(run, 5000);
        }
      };
      let timeout = setTimeout(run, 0);

      return () => {
        changed = true;
        clearTimeout(timeout);
      };
    }
  }, [status, connectWallet, publicKey, url, connection, sendTransaction]);

  // When the status is pending, poll for the transaction using the reference key
  useEffect(() => {
    if (!(status === PaymentStatus.Pending && reference && !signature)) return;
    let changed = false;

    const interval = setInterval(async () => {
      let signature: ConfirmedSignatureInfo;
      try {
        signature = await findReference(connection, reference);

        if (!changed) {
          clearInterval(interval);
          setSignature(signature.signature);
          setStatus(PaymentStatus.Confirmed);
        }
      } catch (error: any) {
        // If the RPC node doesn't have the transaction signature yet, try again
        if (!(error instanceof FindReferenceError)) {
          Logger.error(error);
        }
      }
    }, 250);

    return () => {
      changed = true;
      clearInterval(interval);
    };
  }, [status, reference, signature, connection]);

  // When the status is confirmed, validate the transaction against the provided params
  useEffect(() => {
    if (!(status === PaymentStatus.Confirmed && signature && amount)) return;
    let changed = false;

    const run = async () => {
      try {
        const transfertData = await validateTransfer(connection, signature, {
          recipient,
          amount,
          splToken,
          reference,
        });
        // Get the customer address
        setCustomerWalletAddress(
          transfertData.transaction.message.accountKeys[0].toString()
        );

        if (!changed) {
          setStatus(PaymentStatus.Valid);
        }
      } catch (error: any) {
        // If the RPC node doesn't have the transaction yet, try again
        if (
          error instanceof ValidateTransferError &&
          (error.message === 'not found' || error.message === 'missing meta')
        ) {
          Logger.info(error);
          timeout = setTimeout(run, 250);
          return;
        }

        Logger.error(error);
        setStatus(PaymentStatus.Invalid);
      }
    };
    let timeout = setTimeout(run, 0);

    return () => {
      changed = true;
      clearTimeout(timeout);
    };
  }, [status, signature, amount, connection, recipient, splToken, reference]);

  // When the status is valid, poll for confirmations until the transaction is finalized
  useEffect(() => {
    if (!(status === PaymentStatus.Valid && signature)) return;
    let changed = false;

    const interval = setInterval(async () => {
      try {
        const response = await connection.getSignatureStatus(signature);
        const status = response.value;
        if (!status) return;
        if (status.err) throw status.err;

        if (!changed) {
          const confirmations = (status.confirmations || 0) as Confirmations;
          setConfirmations(confirmations);

          if (
            confirmations >= requiredConfirmations ||
            status.confirmationStatus === 'finalized'
          ) {
            clearInterval(interval);
            setStatus(PaymentStatus.Finalized);
            // Saving the invoice in out DB
            const cartSummary = getCartSummaryForInvoice();

            const newInvoice = await saveTransactionInvoice({
              variables: {
                ...cartSummary,
                signature,
                customerWalletAddress,
                storeId: store?._id,
                currency,
                network,
              },
            });

            // Resetting the cart items and redirect to the confirmation page
            reset();
            resetCart();
            // Make sure we're updating the qty after the purchase
            refetchInventory();

            navigate(
              `${routes.store.confirmation}/${newInvoice?.data?.saveTransactionInvoice?._id}/tx/${newInvoice?.data?.saveTransactionInvoice?.signature}`
            );
          }
        }
      } catch (error: any) {
        messageComponent.error('Somehting went wrong...');
        Logger.error(error);
      }
    }, 250);

    return () => {
      changed = true;
      clearInterval(interval);
    };
  }, [
    status,
    signature,
    connection,
    requiredConfirmations,
    getCartSummaryForInvoice,
    saveTransactionInvoice,
    reset,
    resetCart,
    navigate,
    customerWalletAddress,
    store?._id,
    currency,
    network,
    refetchInventory,
  ]);

  return (
    <PaymentContext.Provider
      value={{
        amount,
        setAmount,
        memo,
        setMemo,
        reference,
        signature,
        status,
        confirmations,
        progress,
        url,
        reset,
        generate,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
