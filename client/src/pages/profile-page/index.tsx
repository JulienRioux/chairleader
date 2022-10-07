import { useWallet } from '@solana/wallet-adapter-react';
import { Icon, Table } from 'components-library';
import { SolScanLink } from 'pages/admin-pages/token-gating-nft/token-gating.nft.styles';
import { InventoryLayout } from 'pages/pos-app/inventory-layout';
import { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CLUSTER_ENV, formatShortAddress, routes } from 'utils';

const COLUMNS = ['Date', 'Order ID', 'Total', 'Items'];

export const ProfilePage = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();

  const walletAddress = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const tableData: any[] = [
    {
      'Order ID': '634080146173ad661c84a35c',
      Date: 'October 07 2022, 15:10',
      Total: '123.6 USDC',
      Items: '2 items',
    },
  ];

  const handleRowClick = useCallback(
    (row: any) => {
      navigate(`${routes.store.confirmation}/${row['Order ID']}`);
    },
    [navigate]
  );

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

      {tableData.length ? (
        <Table
          columns={COLUMNS}
          rows={tableData}
          handleRowClick={handleRowClick}
        />
      ) : (
        <p>No orders yet.</p>
      )}

      {/* <Link to={`${routes.store.confirmation}/634080146173ad661c84a35c`}>
        Order ID: 634080146173ad661c84a35c
      </Link> */}
    </InventoryLayout>
  );
};
