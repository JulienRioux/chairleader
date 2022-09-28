import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectWalletBtn } from 'components/connect-wallet-btn';
import { NftsList } from 'components/nfts-list';

export const NftsPage = () => {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <div>
        <p>Connect your wallet in order to see this page.</p>
        <ConnectWalletBtn />
      </div>
    );
  }

  return (
    <div>
      <NftsList isStoreApp />
    </div>
  );
};
