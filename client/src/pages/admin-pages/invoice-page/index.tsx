import { useMutation, useQuery } from '@apollo/client';
import { CartItem, CartSummary } from 'components';
import { Icon, Loader, message, Select } from 'components-library';
import { CURRENCY, NETWORK } from 'hooks/currency';
import { getTxExplorerUrl } from 'pages/cart-page';
import { GET_INVOICE_BY_ID, UPDATE_INVOICE } from 'queries';
import { ReactNode, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { formatShortAddress, Logger } from 'utils';
import { format } from 'date-fns';

const InvoicePageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
  align-items: flex-start;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const InvoiceDiv = styled.div`
  border: 1px solid ${(p) => p.theme.color.lightGrey};
  border-radius: ${(p) => p.theme.borderRadius.default};
`;

const Header = styled.h3`
  margin: 0;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  font-size: 20px;
  padding: 12px;
`;

const Detail = styled.p`
  border-bottom: 1px dashed ${(p) => p.theme.color.lightGrey};
  padding: 12px 0;
  margin: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  word-break: break-all;
`;

const InvoiceCardContent = styled.div`
  padding: 12px;
`;

export const DetailItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <Detail>
    <span>{label}</span>
    <span>{children}</span>
  </Detail>
);

const FULFILLMENT_OPTIONS = [
  {
    value: 'unfulfilled',
    label: 'Unfulfilled',
  },
  {
    value: 'fulfilled',
    label: 'Fulfilled',
  },
  {
    value: 'partiallyFulfilled',
    label: 'Partially fulfilled',
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
  },
  {
    value: 'onHold',
    label: 'On hold',
  },
];

const InvoiceCard = ({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) => (
  <InvoiceDiv>
    <Header>{title}</Header>
    <InvoiceCardContent>{children}</InvoiceCardContent>
  </InvoiceDiv>
);

export const InvoicePage = () => {
  const { invoiceId } = useParams();
  const {
    data,
    loading,
    refetch: refetchGetInvoiceById,
  } = useQuery(GET_INVOICE_BY_ID, {
    variables: {
      id: invoiceId,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [updateInvoice, { loading: updateInvoiceIsLoading }] =
    useMutation(UPDATE_INVOICE);

  const cartItems = data?.getInvoiceById?.cartItems;

  const invoiceData = data?.getInvoiceById;

  const handleFulfillmentStatusChange = useCallback(
    async (e: any) => {
      try {
        await updateInvoice({
          variables: {
            invoiceId,
            fulfillmentStatus: e.target.value,
          },
        });
        await refetchGetInvoiceById();
        message.success(`Fulfillment status updated.`);
      } catch (err) {
        Logger.error(err);
        message.error();
      }
    },
    [updateInvoice, refetchGetInvoiceById, invoiceId]
  );

  if (loading) {
    return <Loader />;
  }

  const decimals = invoiceData?.currency === CURRENCY.SOL ? 9 : 6;

  const isDevNetwork = invoiceData?.network === NETWORK.DEVNET;

  return (
    <InvoicePageWrapper>
      <InvoiceCard title="Summary">
        {cartItems?.map(
          ({ _id, qty, image, title, price, totalSupply }: any) => (
            <CartItem
              key={_id}
              id={_id}
              qty={qty}
              image={image}
              title={title}
              price={price}
              totalSupply={totalSupply}
              enableUpdate={false}
              currency={invoiceData?.currency}
              isAdmin
            />
          )
        )}

        <div style={{ margin: '40px 0' }}>
          <CartSummary
            totalPrice={invoiceData?.totalPrice}
            totalSaleTax={invoiceData?.totalSaleTax}
            totalWithSaleTax={invoiceData?.totalWithSaleTax}
            currency={invoiceData?.currency}
            isAdminApp
          />
        </div>
      </InvoiceCard>

      <InvoiceCard title="Invoice details">
        <DetailItem label="Invoice ID:">{invoiceId}</DetailItem>

        <DetailItem label="Date:">
          {format(
            new Date(Number(invoiceData?.createdAt)),
            'MMMM dd yyyy, hh:mm:ss'
          )}
        </DetailItem>

        <DetailItem label="Currency:">{invoiceData?.currency}</DetailItem>

        <DetailItem label="Network:">{invoiceData?.network}</DetailItem>

        <DetailItem label="Service fees:">
          {invoiceData?.serviceFees?.toFixed(decimals)} {invoiceData?.currency}
        </DetailItem>

        <DetailItem label="Customer wallet address:">
          <a
            href={`https://explorer.solana.com/address/${
              invoiceData?.customerWalletAddress
            }${isDevNetwork && '?cluster=devnet'}`}
            target="_blank"
            rel="noreferrer"
          >
            {formatShortAddress(invoiceData?.customerWalletAddress)}{' '}
            <Icon name="launch" />
          </a>
        </DetailItem>

        <DetailItem label="Transaction:">
          <a
            href={getTxExplorerUrl({
              signature: invoiceData?.signature,
              isDev: isDevNetwork, // Needs to be changed to work with production
            })}
            target="_blank"
            rel="noreferrer"
          >
            {formatShortAddress(invoiceData?.signature)} <Icon name="launch" />
          </a>
        </DetailItem>
      </InvoiceCard>

      <InvoiceCard title="Shipping details">
        <DetailItem label="Email:">{invoiceData?.email}</DetailItem>
        <DetailItem label="Shipping fees:">
          {invoiceData?.shippingFees} USDC
        </DetailItem>

        <DetailItem label="Name:">{invoiceData?.name}</DetailItem>

        <DetailItem label="Country:">{invoiceData?.country}</DetailItem>

        <DetailItem label="Address:">{invoiceData?.address}</DetailItem>

        <DetailItem label="City:">{invoiceData?.city}</DetailItem>

        <DetailItem label="State/Province:">{invoiceData?.state}</DetailItem>

        <DetailItem label="Postal code/ZIP:">
          {invoiceData?.postalCode}
        </DetailItem>
      </InvoiceCard>

      <InvoiceCard title="Fulfillment">
        {updateInvoiceIsLoading ? (
          <Loader />
        ) : (
          <Select
            label="Update fulfillment status"
            value={invoiceData?.fulfillmentStatus}
            onChange={handleFulfillmentStatusChange}
            options={FULFILLMENT_OPTIONS}
            name="fulfillmentStatus"
            id="fulfillmentStatus"
            placeholder="Fulfillment status"
            required
          />
        )}
      </InvoiceCard>
    </InvoicePageWrapper>
  );
};
