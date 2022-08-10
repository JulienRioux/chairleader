import { useMutation } from '@apollo/client';
import { encodeURL, findReference, FindReferenceError } from '@solana/pay';
import { useConnection } from '@solana/wallet-adapter-react';
import {
  ConfirmedSignatureInfo,
  Keypair,
  PublicKey,
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
import { useConfig } from '../../hooks/config';
import { PaymentContext, PaymentStatus } from '../../hooks/payment';
import { Confirmations } from '../../types';
import { message as messageComponent } from 'components-library';
import { useCart } from 'hooks/cart';
import { useStore } from 'hooks/store';
import { useCurrency } from 'hooks/currency';

export interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: FC<PaymentProviderProps> = ({ children }) => {
  const { connection } = useConnection();
  const { link, recipient, splToken, label, message, requiredConfirmations } =
    useConfig();

  const { currency, network } = useCurrency();

  const [amount, setAmount] = useState<BigNumber>();
  const [memo, setMemo] = useState<string>();
  const [reference, setReference] = useState<PublicKey>();
  const [signature, setSignature] = useState<TransactionSignature>();
  const [status, setStatus] = useState(PaymentStatus.New);
  const [confirmations, setConfirmations] = useState<Confirmations>(0);
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

      if (amount)
        url.searchParams.append(
          'amount',
          amount?.toFixed(amount?.decimalPlaces())
        );

      if (splToken) url.searchParams.append('spl-token', splToken.toBase58());

      if (reference) url.searchParams.append('reference', reference.toBase58());

      if (memo) url.searchParams.append('memo', memo);

      if (label) url.searchParams.append('label', label);

      const icon = store?.image;

      if (icon) url.searchParams.append('icon', icon);

      if (message) url.searchParams.append('message', message);

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
  }, [
    link,
    recipient,
    amount,
    splToken,
    reference,
    memo,
    label,
    store?.image,
    message,
  ]);

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
          setStatus(PaymentStatus.Valid);
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

            // Getting the customer wallet ID
            const response = await connection.getTransaction(signature);
            const customerWalletAddress =
              response?.transaction?.message?.accountKeys[0].toString() ?? '';

            // Retrieve the service fee data
            const serviceFeePreTokenBalances =
              response?.meta?.preTokenBalances?.at(0)?.uiTokenAmount?.uiAmount;
            const serviceFeePostTokenBalances =
              response?.meta?.postTokenBalances?.at(0)?.uiTokenAmount?.uiAmount;

            const serviceFees =
              Number(serviceFeePostTokenBalances) -
              Number(serviceFeePreTokenBalances);

            const newInvoice = await saveTransactionInvoice({
              variables: {
                ...cartSummary,
                signature,
                customerWalletAddress,
                storeId: store?._id,
                currency,
                network,
                serviceFees,
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
