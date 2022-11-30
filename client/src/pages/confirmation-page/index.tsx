import { Button, Icon, Loader } from 'components-library';
import { formatShortAddress, routes } from 'utils';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { GET_INVOICE_BY_ID } from 'queries';
import { useQuery } from '@apollo/client';
import { CartItem, CartSummary } from 'components';
import { DetailItem, Card } from 'pages/admin-pages/invoice-page';
import { format } from 'date-fns';
import { NETWORK } from 'hooks/currency';
import { InventoryLayout } from 'pages/pos-app/inventory-layout';
import { slideInBottom } from 'utils/keyframes';

export const getTxExplorerUrl = ({ signature = '', isDev = false }) =>
  `https://explorer.solana.com/tx/${signature}${
    isDev ? '?cluster=devnet' : ''
  }`;

const ConfirmationPageWrapper = styled.div`
  margin: 40px auto 80px;
  opacity: 0;
  animation: 0.4s ${slideInBottom} forwards;
`;

const SummaryWrapper = styled.div`
  margin: 40px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const FinalizedTransactionWrapper = styled.div``;

const ContactText = styled.p`
  color: ${(p) => p.theme.color.lightText};
`;

const contactUsBody = (orderId = 'ORDER_ID') =>
  `Issue with order ID: ${orderId}. Please tell us what's the issue on your order.`;

export const ConfirmationPage = ({ isConfirmation = false }) => {
  const { orderId, signatureId } = useParams();

  const { data, loading } = useQuery(GET_INVOICE_BY_ID, {
    variables: { id: orderId },
    notifyOnNetworkStatusChange: true,
  });

  const cartItems = data?.getInvoiceById?.cartItems;

  const invoiceData = data?.getInvoiceById;

  const isDevNetwork = invoiceData?.network === NETWORK.DEVNET;

  return (
    <InventoryLayout>
      <ConfirmationPageWrapper>
        {isConfirmation && (
          <FinalizedTransactionWrapper>
            <h1 style={{ marginBottom: '20px' }}>
              Thank you for you purchase 🎉
            </h1>

            <div>
              <a
                href={getTxExplorerUrl({
                  signature: signatureId,
                  isDev: isDevNetwork,
                })}
                target="_blank"
                rel="noreferrer"
              >
                See transaction details on Explorer <Icon name="launch" />
              </a>
            </div>
          </FinalizedTransactionWrapper>
        )}

        {loading && (
          <div>
            <Loader />
            <p style={{ textAlign: 'center' }}>Loading order summary</p>
          </div>
        )}

        {!loading && (
          <div>
            <SummaryWrapper>
              <Card title="Summary">
                {cartItems?.map(
                  ({
                    _id,
                    qty,
                    image,
                    title,
                    price,
                    totalSupply,
                    productVariants,
                    variantNames,
                    nftPrintedEdition,
                  }: any) => (
                    <CartItem
                      key={`${_id}_${productVariants}`}
                      id={_id}
                      qty={qty}
                      image={image}
                      title={title}
                      price={price}
                      totalSupply={totalSupply}
                      enableUpdate={false}
                      currency={invoiceData?.currency}
                      productVariants={productVariants}
                      isAdmin
                      variantNames={variantNames}
                      nftAddress={nftPrintedEdition}
                    />
                  )
                )}
                <div style={{ margin: '40px 0' }}>
                  <CartSummary
                    totalPrice={invoiceData?.totalPrice}
                    totalSaleTax={invoiceData?.totalSaleTax}
                    totalWithSaleTax={invoiceData?.totalWithSaleTax}
                    currency={invoiceData?.currency}
                    shippingFee={invoiceData?.shippingFee}
                  />
                </div>
              </Card>

              <Card title="Shipping details">
                <DetailItem label="Order ID:">{orderId}</DetailItem>

                <DetailItem label="Order type:">
                  {invoiceData?.isNft ? 'NFT membership' : 'Products'}
                </DetailItem>

                <DetailItem label="Date:">
                  {format(
                    new Date(Number(invoiceData?.createdAt)),
                    'MMMM dd yyyy, HH:MM'
                  )}
                </DetailItem>

                <DetailItem label="Transaction:">
                  <a
                    href={getTxExplorerUrl({
                      signature: invoiceData?.signature,
                      isDev: isDevNetwork,
                    })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {formatShortAddress(invoiceData?.signature)}{' '}
                    <Icon name="launch" />
                  </a>
                </DetailItem>

                <DetailItem label="Wallet address:">
                  <a
                    href={`https://explorer.solana.com/address/${
                      invoiceData?.customerWalletAddress
                    }${isDevNetwork ? '?cluster=devnet' : ''}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {formatShortAddress(invoiceData?.customerWalletAddress)}{' '}
                    <Icon name="launch" />
                  </a>
                </DetailItem>

                {invoiceData?.email && (
                  <DetailItem label="Email:">{invoiceData?.email}</DetailItem>
                )}

                {invoiceData?.name && (
                  <DetailItem label="Name:">{invoiceData?.name}</DetailItem>
                )}

                {invoiceData?.country && (
                  <DetailItem label="Country:">
                    {invoiceData?.country}
                  </DetailItem>
                )}

                {invoiceData?.address && (
                  <DetailItem label="Address:">
                    {invoiceData?.address}
                  </DetailItem>
                )}

                {invoiceData?.city && (
                  <DetailItem label="City:">{invoiceData?.city}</DetailItem>
                )}

                {invoiceData?.state && (
                  <DetailItem label="State/Province:">
                    {invoiceData?.state}
                  </DetailItem>
                )}

                {invoiceData?.postalCode && (
                  <DetailItem label="Postal code/ZIP:">
                    {invoiceData?.postalCode}
                  </DetailItem>
                )}

                <DetailItem label="Fulfillment status:">
                  {invoiceData?.fulfillmentStatus}
                </DetailItem>
              </Card>
            </SummaryWrapper>

            <div style={{ marginTop: '40px' }}>
              <h3>Having issue with your order?</h3>

              <ContactText>
                Please let us know what's the issue and we'll make our possible
                to fix it!
              </ContactText>

              <Button secondary to={routes.store.contact}>
                Contact us
              </Button>
            </div>
          </div>
        )}
      </ConfirmationPageWrapper>
    </InventoryLayout>
  );
};
