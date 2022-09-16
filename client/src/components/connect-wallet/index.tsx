// TODO: To be removed...

import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import { Button, UnstyledExternalLink } from 'components-library';
import { useCallback, useEffect, useState } from 'react';
import { formatShortAddress, transferCustomToken } from 'utils';
const NETWORK = clusterApiUrl('devnet');
const transactionPrice = 0.01;
const receiverWalletPublicKey = new PublicKey(
  'FL9Hyo9EgzUCgnvrNMHJEZGrVev5Z5HtAd6HnPGta6xv'
);

const useWallet = () => {
  const [provider, setProvider] = useState<any>();
  const [providerPubKey, setProviderPubKey] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (provider) {
      provider.on('connect', async () => {
        setProviderPubKey(provider.publicKey);
        setWalletAddress(getWalletAddressFromPubKey(provider.publicKey));
      });
      provider.on('disconnect', () => {
        setProviderPubKey(null);
      });
    }
  }, [provider]);

  const connectOnLoad = useCallback(async () => {
    // Automatically connection to the wallet
    if (provider && !provider?.isConnected) {
      setIsLoading(true);
      try {
        await provider?.connect({ onlyIfTrusted: true });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    if (window.solana && !provider) {
      setProvider(window.solana);
    }

    connectOnLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectOnLoad, provider, window.solana]);

  const connectWallet = useCallback(async () => {
    if (!provider && window.solana) {
      setProvider(window.solana);
    } else if (!provider) {
      console.log('No provider found');
      return;
    } else if (provider && !provider.isConnected) {
      await provider.connect();

      // Not sure how to deal with disclaimers here...
      // const message = `To avoid digital dognappers, sign below to authenticate with CryptoCorgis`;
      // const encodedMessage = new TextEncoder().encode(message);
      // const signedMessage = await provider.signMessage(encodedMessage, 'utf8');
      // console.log('signedMessage', signedMessage);
    }
  }, [provider]);

  return {
    provider,
    providerPubKey,
    walletAddress,
    isLoading,
    connectWallet,
    hasSolanaWallet: window.solana,
  };
};

const getWalletAddressFromPubKey = (pubKey: PublicKey) => pubKey.toBase58();

export const ConnectWallet = () => {
  const {
    provider,
    providerPubKey,
    walletAddress,
    isLoading: walletIsLoading,
    connectWallet,
    hasSolanaWallet,
  } = useWallet();

  const [paymentIsLoading, setPaymentIsLoading] = useState(false);

  const connection = new Connection(NETWORK);

  const makePayment = useCallback(async () => {
    setPaymentIsLoading(true);
    if (providerPubKey) {
      const accountBalance = await connection.getBalance(providerPubKey);
      const balanceInLamports = accountBalance
        ? parseInt(accountBalance.toString())
        : 0;

      if (balanceInLamports > transactionPrice * LAMPORTS_PER_SOL) {
        const result = await transferCustomToken(
          provider,
          connection,
          transactionPrice,
          providerPubKey,
          receiverWalletPublicKey
        );

        if (!result.status) {
          alert('Error in sending the tokens, Please try again!!!');
          setPaymentIsLoading(false);
          return;
        }
        console.log('payment successfull', result);
      } else {
        console.log('Balance insufficient...');
      }
    }

    setPaymentIsLoading(false);
  }, [connection, provider, providerPubKey]);

  return (
    <div>
      <h1>Connect wallet</h1>

      {walletAddress && (
        <p>Connected to: {formatShortAddress(walletAddress)}</p>
      )}

      {walletIsLoading && <p>Connecting your wallet...</p>}

      {hasSolanaWallet && !walletIsLoading && !provider?.isConnected && (
        <Button onClick={connectWallet}>Connect to Phantom wallet</Button>
      )}

      {!hasSolanaWallet && (
        <UnstyledExternalLink
          href="https://phantom.app/download"
          target="_blank"
        >
          <Button>Download Phantom wallet</Button>
        </UnstyledExternalLink>
      )}

      {provider?.isConnected && (
        <div style={{ margin: '12px 0' }}>
          <Button isLoading={paymentIsLoading} onClick={makePayment}>
            Pay {transactionPrice} SOL
          </Button>
        </div>
      )}
    </div>
  );
};
