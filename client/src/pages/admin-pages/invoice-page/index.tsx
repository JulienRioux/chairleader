import { useQuery } from '@apollo/client';
import { CartItem, CartSummary } from 'components';
import { Icon, Loader } from 'components-library';
import { CURRENCY, NETWORK } from 'hooks/currency';
import { getTxExplorerUrl } from 'pages/cart-page';
import { GET_INVOICE_BY_ID } from 'queries';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { formatShortAddress } from 'utils';
import { format } from 'date-fns';

const InvoicePageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 100px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const InvoiceDiv = styled.div``;

const Header = styled.h3`
  margin: 20px 0 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  font-size: 20px;
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

export const InvoicePage = () => {
  const { invoiceId } = useParams();
  const { data, loading } = useQuery(GET_INVOICE_BY_ID, {
    variables: {
      id: invoiceId,
    },
  });

  const cartItems = data?.getInvoiceById?.cartItems;

  const invoiceData = data?.getInvoiceById;

  if (loading) {
    return <Loader />;
  }

  const decimals = invoiceData?.currency === CURRENCY.SOL ? 9 : 6;

  const isDevNetwork = invoiceData?.network === NETWORK.DEVNET;

  return (
    <InvoicePageWrapper>
      <InvoiceDiv>
        <Header>Invoice details:</Header>

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
      </InvoiceDiv>

      <InvoiceDiv>
        <Header>Cart summary:</Header>

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
      </InvoiceDiv>
    </InvoicePageWrapper>
  );
};
