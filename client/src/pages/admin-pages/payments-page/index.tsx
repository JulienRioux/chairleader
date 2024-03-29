import { useQuery } from '@apollo/client';
import {
  Button,
  Icon,
  Input,
  Loader,
  Table,
  UnstyledExternalLink,
} from 'components-library';
import { useAuth } from 'hooks/auth';
import { GET_INVOICES_BY_STORE_ID } from 'queries';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
import { formatShortAddress, routes } from 'utils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const RefetchBtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.form`
  display: flex;
  align-items: flex-start;
  width: 440px;

  button {
    margin-left: 8px;
  }
`;

const camel2title = (camelCase: string) =>
  camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();

const COLUMNS = [
  'Order ID',
  'Date',
  'Customer wallet ID',
  'Total',
  'Currency',
  'Items',
  'Status',
];

const formatTableData = (invoices: any) => {
  // Data manipulation to display clearly on the tables
  const tableData = invoices?.map(
    ({
      createdAt,
      totalWithSaleTax,
      cartItems,
      _id,
      customerWalletAddress,
      currency,
      fulfillmentStatus,
    }: any) => ({
      Status: camel2title(fulfillmentStatus),
      'Order ID': _id,
      Date: format(new Date(Number(createdAt)), 'MMMM dd yyyy, h:mm:ss'),
      'Customer wallet ID': formatShortAddress(customerWalletAddress),
      Currency: currency,
      Total: totalWithSaleTax,
      Items: `${cartItems.length} items`,
    })
  );
  return tableData;
};

export const PaymentsPage = () => {
  const [searchString, setSearchString] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, loading, refetch } = useQuery(GET_INVOICES_BY_STORE_ID, {
    notifyOnNetworkStatusChange: true,
  });

  const tableData = formatTableData(data?.getInvoicesByStoreId) ?? [];

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  }, []);

  const filterByOrderId = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setSearchFilter(searchString);
    },
    [searchString]
  );

  const handleRowClick = useCallback(
    (row: any) => {
      navigate(`${routes.admin.payments}/${row['Order ID']}`);
    },
    [navigate]
  );

  const filteredTableData = tableData.filter(
    (data: any) =>
      data['Order ID'].includes(searchFilter) ||
      data['Customer wallet ID'].includes(searchFilter)
  );

  const noSearchData =
    filteredTableData?.length === 0 && searchFilter.length > 0;

  return (
    <div>
      <RefetchBtnWrapper>
        <SearchWrapper onSubmit={filterByOrderId}>
          <Input
            value={searchString}
            onChange={handleSearchChange}
            placeholder="Search by order ID or customer wallet ID"
          />
          <Button icon="search" secondary />
        </SearchWrapper>
        <div style={{ display: 'flex' }}>
          <UnstyledExternalLink
            href={`https://explorer.solana.com/address/${user?.walletAddress}?cluster=devnet`}
            target="_blank"
            style={{ marginRight: '8px', display: 'inline-block' }}
          >
            <Button secondary>
              <span style={{ marginRight: '8px' }}>
                {formatShortAddress(user?.walletAddress)} history
              </span>
              <Icon name="launch" />
            </Button>
          </UnstyledExternalLink>
          <Button secondary icon="refresh" onClick={() => refetch()} />
        </div>
      </RefetchBtnWrapper>
      {loading ? (
        <Loader />
      ) : noSearchData ? (
        <p>No result for your search...</p>
      ) : (
        <Table
          columns={COLUMNS}
          rows={filteredTableData}
          handleRowClick={handleRowClick}
        />
      )}
    </div>
  );
};
