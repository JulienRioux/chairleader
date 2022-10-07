import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Icon, Table } from 'components-library';
import { ConnectWalletBtn } from 'components/connect-wallet-btn';
import { SolScanLink } from 'pages/admin-pages/token-gating-nft/token-gating.nft.styles';
import { InventoryLayout } from 'pages/pos-app/inventory-layout';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CLUSTER_ENV, formatShortAddress, routes } from 'utils';

const COLUMNS = ['Date', 'Order ID', 'Total', 'Items'];

const ProfileInfoWrapper = styled.div`
  margin: 40px 0;
`;

const TitleAndDisconnectBtn = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ProfilePage = () => {
  const { publicKey, wallet, disconnect } = useWallet();
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

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return (
    <InventoryLayout>
      {publicKey ? (
        <>
          <ProfileInfoWrapper>
            <div>
              <TitleAndDisconnectBtn>
                <h1 style={{ marginTop: 0 }}>My profile</h1>

                <div>
                  <Button secondary onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </div>
              </TitleAndDisconnectBtn>
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

              <p>Connected with {wallet?.adapter.name}.</p>
            </div>
          </ProfileInfoWrapper>

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
        </>
      ) : (
        <div>
          <p>Connect your wallet in order to see this page.</p>
          <ConnectWalletBtn />
        </div>
      )}
    </InventoryLayout>
  );
};
