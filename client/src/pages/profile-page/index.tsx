import { useQuery } from '@apollo/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Icon, Loader, Table } from 'components-library';
import { ConnectWalletBtn } from 'components/connect-wallet-btn';
import { format } from 'date-fns';
import { SolScanLink } from 'pages/admin-pages/token-gating-nft/token-gating.nft.styles';
import { InventoryLayout } from 'pages/pos-app/inventory-layout';
import { GET_INVOICES_BY_WALLET_ADDRESS } from 'queries';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CLUSTER_ENV, formatShortAddress, routes } from 'utils';

const COLUMNS = ['Date', 'Order ID', 'Total', 'Items'];

const formatTableData = (tableData: any) =>
  tableData?.map((invoice: any) => ({
    'Order ID': invoice?._id,
    Date: format(new Date(Number(invoice?.createdAt)), 'MMMM dd yyyy, h:mm'),
    Total: `${invoice?.totalWithSaleTax} ${invoice?.currency}`,
    Items: invoice?.cartItems.reduce(
      (acc: number, curr: any) => acc + curr.qty,
      0
    ),
  }));

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

  const { data: invoices, loading: invoicesIsLoading } = useQuery(
    GET_INVOICES_BY_WALLET_ADDRESS,
    { variables: { walletAddress }, skip: !walletAddress }
  );

  const handleRowClick = useCallback(
    (row: any) => {
      navigate(`${routes.store.confirmation}/${row['Order ID']}`);
    },
    [navigate]
  );

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const SHOW_USER_NFTS = false;

  const formattedData = formatTableData(invoices?.getInvoicesByWalletAddress);

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

              <p>Connected with: {wallet?.adapter.name}</p>
            </div>
          </ProfileInfoWrapper>

          {SHOW_USER_NFTS && (
            <>
              <h3>My NFTs</h3>
              <p>TODO</p>
            </>
          )}

          <h3>
            My orders {!!formattedData?.length && `(${formattedData?.length})`}
          </h3>

          {invoicesIsLoading ? (
            <Loader />
          ) : formattedData?.length ? (
            <Table
              columns={COLUMNS}
              rows={formattedData}
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
