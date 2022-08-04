import { useQuery } from '@apollo/client';
import { Button, Loader } from 'components-library';
import { CURRENCY, NETWORK } from 'hooks/currency';
import { GET_INVOICES_BY_STORE_ID } from 'queries';
import { useState } from 'react';
import styled from 'styled-components';
import { DetailItem } from '../invoice-page';

const DashboardPageWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.mediumWidth};
  margin: 0 auto;
`;

const NetworkTab = styled(Button)`
  margin-left: 8px;
  min-width: auto;
  padding: 4px 12px;
`;

// TODO: Move this into the BE
export const DashboardPage = () => {
  const { data, loading, refetch } = useQuery(GET_INVOICES_BY_STORE_ID, {
    notifyOnNetworkStatusChange: true,
  });

  const [network, setNetwork] = useState(NETWORK.DEVNET);

  let totalWithSaleTaxUSDC = 0;
  let totalTransactionsUSDC = 0;
  let totalSaleTaxUSDC = 0;
  let totalPriceUSDC = 0;

  let totalWithSaleTaxSOL = 0;
  let totalTransactionsSOL = 0;
  let totalSaleTaxSOL = 0;
  let totalPriceSOL = 0;

  data?.getInvoicesByStoreId?.forEach((invoice: any) => {
    if (invoice.network === network) {
      if (invoice?.currency === CURRENCY.USDC) {
        totalWithSaleTaxUSDC += invoice.totalWithSaleTax;
        totalTransactionsUSDC++;
        totalSaleTaxUSDC += invoice.totalSaleTax;
        totalPriceUSDC += invoice.totalPrice;
      }

      if (invoice?.currency === CURRENCY.SOL) {
        totalWithSaleTaxSOL += invoice.totalWithSaleTax;
        totalTransactionsSOL++;
        totalSaleTaxSOL += invoice.totalSaleTax;
        totalPriceSOL += invoice.totalPrice;
      }
    }
  });

  console.log(data?.getInvoicesByStoreId);

  if (loading) return <Loader />;

  return (
    <DashboardPageWrapper>
      <DetailItem label="Network:">
        {
          <>
            <NetworkTab
              secondary={network !== NETWORK.DEVNET}
              onClick={() => setNetwork(NETWORK.DEVNET)}
            >
              {NETWORK.DEVNET}
            </NetworkTab>
            <NetworkTab
              secondary={network !== NETWORK.MAINNET}
              onClick={() => setNetwork(NETWORK.MAINNET)}
            >
              {NETWORK.MAINNET}
            </NetworkTab>
          </>
        }
      </DetailItem>

      <h4 style={{ marginTop: '40px' }}>USDC sales:</h4>
      <DetailItem label="Total sale before tax:">{totalPriceUSDC}</DetailItem>
      <DetailItem label="Total sale tax:">{totalSaleTaxUSDC}</DetailItem>
      <DetailItem label="Total sale with tax:">
        {totalWithSaleTaxUSDC}
      </DetailItem>
      <DetailItem label="Number of transactions:">
        {totalTransactionsUSDC}
      </DetailItem>

      <h4 style={{ marginTop: '80px' }}>SOL sales:</h4>

      <DetailItem label="Total sale before tax:">{totalPriceSOL}</DetailItem>
      <DetailItem label="Total sale tax:">{totalSaleTaxSOL}</DetailItem>
      <DetailItem label="Total sale with tax:">
        {totalWithSaleTaxSOL}
      </DetailItem>
      <DetailItem label="Number of transactions:">
        {totalTransactionsSOL}
      </DetailItem>
    </DashboardPageWrapper>
  );
};
