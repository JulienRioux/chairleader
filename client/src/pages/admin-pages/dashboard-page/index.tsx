import { useQuery } from '@apollo/client';
import { Button, Loader, Select } from 'components-library';
import {
  formatDataCountForXDays,
  ResponsiveChart,
} from 'components/responsive-chart';
import { IS_DEV, SHOW_MULTIPLE_CURRENCY } from 'configs';
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
import { Card, DetailItem } from '../invoice-page';

const DashboardPageWrapper = styled.div`
  /* max-width: ${(p) => p.theme.layout.mediumWidth}; */
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

const DetailsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 600px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 0;
    max-width: initial;
  }
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
    if (invoice.network === network && invoice?.currency === currency) {
      totalWithSaleTax += invoice.totalWithSaleTax;
      totalTransactions++;
      totalSaleTax += invoice.totalSaleTax;
      totalPrice += invoice.totalPrice;
      totalServiceFees += invoice.serviceFees ?? 0;
    }
  });

  const SHOW_OLD_DASHBOARD = false;

  if (loading) return <Loader />;

  if (!SHOW_OLD_DASHBOARD) {
    return (
      <DashboardPageWrapper>
        <Chart />
      </DashboardPageWrapper>
    );
  }

  return (
    <DashboardPageWrapper>
      <Chart />

      <Card title="Dashboard">
        {IS_DEV && (
          <>
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

            {SHOW_MULTIPLE_CURRENCY && (
              <DetailItem label="Currency:">
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
            )}
          </>
        )}

        <DetailItem label="Total sale before tax:">
          {fixDecimal(totalPrice)} <CurrencyWrapper>{currency}</CurrencyWrapper>
        </DetailItem>

        <DetailItem label="Total sale tax:">
          {fixDecimal(totalSaleTax)}{' '}
          <CurrencyWrapper>{currency}</CurrencyWrapper>
        </DetailItem>

        <DetailItem label="Total sale with tax:">
          {fixDecimal(totalWithSaleTax)}{' '}
          <CurrencyWrapper>{currency}</CurrencyWrapper>
        </DetailItem>

        <DetailItem label="Total service fees:">
          {fixDecimal(totalServiceFees)}{' '}
          <CurrencyWrapper>{currency}</CurrencyWrapper>
        </DetailItem>

        <DetailItem label="Number of orders:">{totalTransactions}</DetailItem>
      </Card>
    </DashboardPageWrapper>
  );
};

const fixUsdcDecimal = (amount: any) =>
  typeof amount === 'number' ? Number(amount?.toFixed(6)) : 0;

const DATE_RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
];

const DATASET_OPTIONS = [
  { value: 'totalWithSaleTax', label: 'Total sales with tax' },
  { value: 'totalTransactions', label: 'Number of orders' },
];

const SHOW_DOLLAR_SIGN_DATASET = ['totalWithSaleTax'];

const Chart = () => {
  const [numOfDays, setNumOfDays] = useState('7');
  const [dataset, setDataset] = useState('totalWithSaleTax');
  const { data, loading } = useQuery(GET_INVOICES_BY_STORE_ID, {
    notifyOnNetworkStatusChange: true,
  });

  const formattedData = formatDataCountForXDays({
    data: data?.getInvoicesByStoreId ?? [],
    numOfDays: Number(numOfDays),
  });

  const getDataSum = (key: string) => {
    return formattedData.reduce(
      (acc, newDate: any) => fixUsdcDecimal(acc + newDate?.sales[key]),
      0
    );
  };

  const totalPrice = getDataSum('totalPrice');
  const totalSaleTax = getDataSum('totalSaleTax');
  const totalServiceFees = getDataSum('serviceFees');
  const totalShippingFee = getDataSum('shippingFee');
  const totalWithSaleTax = getDataSum('totalWithSaleTax');
  const totalTransactions = getDataSum('totalTransactions');
  const numOfItemsSold = getDataSum('numOfItems');

  const dataToDisplay = formattedData.map(({ date, sales }: any) => ({
    date,
    sales: sales[dataset],
  }));

  return (
    <div style={{ marginBottom: '40px' }}>
      <Card title="Sales">
        <SelectWrapper>
          <Select
            label="Date range"
            value={numOfDays}
            onChange={(e: any) => setNumOfDays(e.target.value)}
            options={DATE_RANGE_OPTIONS}
            name="dateRange"
            id="dateRange"
            placeholder="Select the date range"
            required
          />

          <Select
            label="Dataset"
            value={dataset}
            onChange={(e: any) => setDataset(e.target.value)}
            options={DATASET_OPTIONS}
            name="dataset"
            id="dataset"
            placeholder="Select a dataset"
            required
          />
        </SelectWrapper>

        <ResponsiveChart
          yDataKey="sales"
          xDataKey="date"
          data={dataToDisplay}
          type="barChart"
          title={
            DATASET_OPTIONS.find((option) => option?.value === dataset)
              ?.label ?? ''
          }
          subTitle={`Last ${numOfDays} days`}
          showDollarSign={SHOW_DOLLAR_SIGN_DATASET.includes(dataset)}
        />

        <h3 style={{ fontSize: '24px', margin: '80px 0 20px' }}>
          Summary (Last {numOfDays} days)
        </h3>
        <DetailsWrapper>
          <div>
            <DetailItem label="Total sale before tax:">
              <CurrencyWrapper>$</CurrencyWrapper>
              {totalPrice}
            </DetailItem>

            <DetailItem label="Total sale tax:">
              <CurrencyWrapper>$</CurrencyWrapper>
              {totalSaleTax}
            </DetailItem>

            <DetailItem label="Total shipping fee:">
              <CurrencyWrapper>$</CurrencyWrapper>
              {totalShippingFee}
            </DetailItem>

            <DetailItem label="Total sale with tax:">
              <CurrencyWrapper>$</CurrencyWrapper>
              {totalWithSaleTax}
            </DetailItem>

            <DetailItem label="Total service fees:">
              <CurrencyWrapper>$</CurrencyWrapper>
              {totalServiceFees}
            </DetailItem>
          </div>

          <div>
            <DetailItem label="Number of orders:">
              {totalTransactions}
            </DetailItem>

            <DetailItem label="Number of items sold:">
              {numOfItemsSold}
            </DetailItem>

            <DetailItem label="Average total sale per order:">
              <CurrencyWrapper>$</CurrencyWrapper>
              {fixUsdcDecimal(totalWithSaleTax / totalTransactions)}
            </DetailItem>

            <DetailItem label="Average total sale per item:">
              <CurrencyWrapper>$</CurrencyWrapper>
              {fixUsdcDecimal(numOfItemsSold / totalTransactions)}
            </DetailItem>
          </div>
        </DetailsWrapper>
      </Card>
    </div>
  );
};
