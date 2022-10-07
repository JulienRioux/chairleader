import { useWallet } from '@solana/wallet-adapter-react';
import { Icon } from 'components-library';
import { SolScanLink } from 'pages/admin-pages/token-gating-nft/token-gating.nft.styles';
import { InventoryLayout } from 'pages/pos-app/inventory-layout';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CLUSTER_ENV, formatShortAddress, routes } from 'utils';

export const ProfilePage = () => {
  const { publicKey } = useWallet();

  const walletAddress = useMemo(() => publicKey?.toBase58(), [publicKey]);

  return (
    <InventoryLayout>
      <h1>My profile</h1>
      <p>
        Wallet address:{' '}
        <SolScanLink
          href={`https://solscan.io/token/${walletAddress}?cluster=${CLUSTER_ENV}`}
          target="_blank"
        >
          {formatShortAddress(walletAddress)}
          <Icon name="launch" style={{ marginLeft: '8px' }} />
        </SolScanLink>
      </p>

      <h3>My NFTs</h3>
      <p>TODO</p>

      <h3>My orders</h3>
      <Link to={`${routes.store.confirmation}/634080146173ad661c84a35c`}>
        Order ID: 634080146173ad661c84a35c
      </Link>
      <p>TODO</p>
    </InventoryLayout>
  );
};
