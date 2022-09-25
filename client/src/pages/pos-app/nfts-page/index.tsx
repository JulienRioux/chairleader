import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectWalletBtn } from 'components/connect-wallet-btn';
import { NftsList } from 'components/nfts-list';
import { useStore } from 'hooks/store';

export const NftsPage = () => {
  const { publicKey } = useWallet();
  const { store } = useStore();

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
      <h2>{store?.storeName} NFTs</h2>
      <p>Collect them to earn exclusive products and rewards!</p>
      <NftsList isStoreApp />
    </div>
  );
};
