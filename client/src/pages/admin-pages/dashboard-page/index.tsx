import { useQuery } from '@apollo/client';
import { Button, Loader } from 'components-library';
import { useAuth } from 'hooks/auth';
import {
  CURRENCY,
  currencyMap,
  CURRENCY_AND_NETWORK,
  NETWORK,
} from 'hooks/currency';
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
  min-width: 80px;
`;

const CurrencyWrapper = styled.span`
  color: ${(p) => p.theme.color.text}aa;
`;

// TODO: Move this into the BE
export const DashboardPage = () => {
  const { data, loading } = useQuery(GET_INVOICES_BY_STORE_ID, {
    notifyOnNetworkStatusChange: true,
  });

  const { user } = useAuth();
  const currentCurrency = user?.currency;

  const [network, setNetwork] = useState(NETWORK.DEVNET);
  const [currency, setCurrency] = useState(currentCurrency ?? CURRENCY.USDC);

  let totalWithSaleTax = 0;
  let totalTransactions = 0;
  let totalSaleTax = 0;
  let totalPrice = 0;
  let totalServiceFees = 0;

  const { decimals } =
    currencyMap[CURRENCY_AND_NETWORK[`${currency as CURRENCY}_${network}`]];

  const fixDecimal = (amount: any) =>
    typeof amount === 'number' ? Number(amount?.toFixed(decimals)) : 0;

  data?.getInvoicesByStoreId?.forEach((invoice: any) => {
    if (invoice.network === network && invoice.currency === currency) {
      totalWithSaleTax += invoice.totalWithSaleTax;
      totalTransactions++;
      totalSaleTax += invoice.totalSaleTax;
      totalPrice += invoice.totalPrice;
      totalServiceFees += invoice.serviceFees ?? 0;
    }
  });

  if (loading) return <Loader />;

  return (
    <DashboardPageWrapper>
      <DetailItem label="Currency:">
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

      <DetailItem label="Network:">
        {
          <>
            <NetworkTab
              secondary={currency !== CURRENCY.USDC}
              onClick={() => setCurrency(CURRENCY.USDC)}
            >
              {CURRENCY.USDC}
            </NetworkTab>
            <NetworkTab
              secondary={currency !== CURRENCY.SOL}
              onClick={() => setCurrency(CURRENCY.SOL)}
            >
              {CURRENCY.SOL}
            </NetworkTab>
          </>
        }
      </DetailItem>

      <DetailItem label="Total sale before tax:">
        {fixDecimal(totalPrice)} <CurrencyWrapper>{currency}</CurrencyWrapper>
      </DetailItem>

      <DetailItem label="Total sale tax:">
        {fixDecimal(totalSaleTax)} <CurrencyWrapper>{currency}</CurrencyWrapper>
      </DetailItem>

      <DetailItem label="Total sale with tax:">
        {fixDecimal(totalWithSaleTax)}{' '}
        <CurrencyWrapper>{currency}</CurrencyWrapper>
      </DetailItem>

      <DetailItem label="Total service fees:">
        {fixDecimal(totalServiceFees)}{' '}
        <CurrencyWrapper>{currency}</CurrencyWrapper>
      </DetailItem>

      <DetailItem label="Number of transactions:">
        {totalTransactions}
      </DetailItem>
    </DashboardPageWrapper>
  );
};
