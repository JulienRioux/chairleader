import { SAVE_TRANSACTION_INVOICE } from 'queries';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Logger,
  routes,
  DEVNET_DUMMY_MINT,
  createSPLTokenInstruction,
} from 'utils';
import { useMutation } from '@apollo/client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { getMint } from '@solana/spl-token';
import { PAYMENT_SERVICE_FEE, SELLING_NFT_SERVICE_FEE } from 'configs';
import { message } from 'components-library';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useStore } from 'hooks/store';
import { useNft } from 'hooks/nft';

export interface IShippingInfo {
  email: string;
  name: string;
  country: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
}

export const useSplTokenPayent = () => {
  const { sendTransaction, publicKey } = useWallet();
  const { connection } = useConnection();
  const navigate = useNavigate();
  const { storeNfts } = useNft();

  const { getCartSummaryForInvoice, resetCart } = useCart();

  const [saveTransactionInvoice] = useMutation(SAVE_TRANSACTION_INVOICE);

  const { currency, network } = useCurrency();

  const { store, refetchInventory } = useStore();

  const makePayment = useCallback(
    async ({
      amount,
      isNft,
      shippingInfo,
    }: {
      amount: number;
      isNft?: boolean;
      shippingInfo?: IShippingInfo;
    }) => {
      try {
        // Creating a new transaction
        const transaction = new Transaction();

        // Setting up the differents recipient amount
        const totalAmount = Number(amount);

        const payeePublicKey =
          process.env.REACT_APP_TRANSACTION_PAYEE_PUBLIC_KEY;

        if (!payeePublicKey || !publicKey) {
          return;
        }

        const mint = await getMint(connection, DEVNET_DUMMY_MINT);

        const SERVICE_FEE = isNft
          ? SELLING_NFT_SERVICE_FEE * 100
          : PAYMENT_SERVICE_FEE;

        const servicePayout = Number(
          (totalAmount * (SERVICE_FEE / 100))?.toFixed(mint.decimals)
        );

        const recipientPayout = totalAmount - servicePayout;

        const paymentInstructions = await createSPLTokenInstruction({
          recipient: new PublicKey(payeePublicKey),
          amount: new BigNumber(recipientPayout),
          splToken: DEVNET_DUMMY_MINT,
          sender: publicKey,
          connection,
        });

        // Adding the payment instruction to the current transaction
        transaction.add(paymentInstructions);

        const intermediaryAccount =
          process.env.REACT_APP_TRANSACTION_PAYEE_PUBLIC_KEY ?? '';

        // Fees instructions
        const feesInstructions = await createSPLTokenInstruction({
          recipient: new PublicKey(intermediaryAccount),
          amount: new BigNumber(servicePayout),
          splToken: DEVNET_DUMMY_MINT,
          sender: publicKey,
          connection,
        });

        // Adding the instruction to the current transaction
        transaction.add(feesInstructions);

        // Getting the latest block hash
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();

        transaction.recentBlockhash = blockhash;

        // Setting up the feePayer
        transaction.feePayer = publicKey;

        const signature = await sendTransaction(transaction, connection, {
          minContextSlot,
        });

        await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature,
        });

        if (isNft) {
          // Do something here to save the Invoice
          return;
        }

        // Saving the invoice in out DB
        const cartSummary = getCartSummaryForInvoice(
          storeNfts?.findNftsByStoreId ?? []
        );

        const newInvoice = await saveTransactionInvoice({
          variables: {
            ...cartSummary,
            signature,
            customerWalletAddress: publicKey.toString(),
            storeId: store?._id,
            currency,
            network,
            serviceFees: servicePayout,
            ...shippingInfo,
          },
        });

        // Resetting the cart items and redirect to the confirmation page
        resetCart();
        // Make sure we're updating the qty after the purchase
        refetchInventory();

        navigate(
          `${routes.store.confirmation}/${newInvoice?.data?.saveTransactionInvoice?._id}/tx/${newInvoice?.data?.saveTransactionInvoice?.signature}`
        );
      } catch (err) {
        // err handle
        Logger.error(err);
        message.error();
        throw err;
      }
    },
    [
      connection,
      currency,
      getCartSummaryForInvoice,
      navigate,
      network,
      publicKey,
      refetchInventory,
      resetCart,
      saveTransactionInvoice,
      sendTransaction,
      store?._id,
      storeNfts?.findNftsByStoreId,
    ]
  );

  return { makePayment };
};
