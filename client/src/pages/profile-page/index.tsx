import { useQuery } from '@apollo/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Icon, Loader, Table } from 'components-library';
import { ConnectWalletBtn } from 'components/connect-wallet-btn';
import { format } from 'date-fns';
import { useBalance } from 'hooks/balance';
import { SolScanLink } from 'pages/admin-pages/token-gating-nft/token-gating.nft.styles';
import { ToggleTheme } from 'pages/homepage';
import { InventoryLayout } from 'pages/pos-app/inventory-layout';
import { GET_INVOICES_BY_WALLET_ADDRESS } from 'queries';
import { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CLUSTER_ENV, formatShortAddress, routes } from 'utils';
import { slideInBottom } from 'utils/keyframes';

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

const ProfilePageWrapper = styled.div`
  opacity: 0;
  animation: 0.4s ${slideInBottom} forwards;
`;

const BtnsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProfilePage = () => {
  const { publicKey, wallet, disconnect } = useWallet();
  const navigate = useNavigate();
  const { userBalance } = useBalance();

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
        <ProfilePageWrapper>
          <ProfileInfoWrapper>
            <h3>Wallet info</h3>
            <div>
              <p>
                Wallet address:{' '}
                <a
                  href={`https://solscan.io/token/${walletAddress}?cluster=${CLUSTER_ENV}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {formatShortAddress(walletAddress)}
                  <Icon name="launch" style={{ marginLeft: '8px' }} />
                </a>
              </p>

              <p>Connected with: {wallet?.adapter.name}</p>

              <p>Wallet balance: {userBalance} USDC</p>

              <BtnsWrapper>
                <ToggleTheme />

                <Button secondary onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </BtnsWrapper>
            </div>
          </ProfileInfoWrapper>

          {SHOW_USER_NFTS && (
            <>
              <h3>My NFTs</h3>
              <p>TODO</p>
            </>
          )}

          <h3>
            Past orders{' '}
            {!!formattedData?.length && `(${formattedData?.length})`}
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
        </ProfilePageWrapper>
      ) : (
        <div>
          <p>Connect your wallet in order to see this page.</p>
          <ConnectWalletBtn />
        </div>
      )}
    </InventoryLayout>
  );
};
