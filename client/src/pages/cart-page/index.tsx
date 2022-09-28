import { Button, Icon } from 'components-library';
import { PaymentStatus, usePayment } from 'hooks/payment';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { routes } from 'utils';
import styled from 'styled-components';
import { CartItems } from 'components/cart';
import { CartSummary } from 'components';
import { useCart } from 'hooks/cart';
import { useNavigate, useParams } from 'react-router-dom';
import { CURRENCY, useCurrency } from 'hooks/currency';
import { useScrollTop } from 'hooks/scroll-top';
import { PaymentOptions } from 'pages/cart-payment-page';
import { useMediaQuery } from 'hooks/media-query';
import { ShippingForm } from 'components/shipping-form';

export const getTxExplorerUrl = ({ signature = '', isDev = false }) =>
  `https://explorer.solana.com/tx/${signature}${isDev && '?cluster=devnet'}`;

const FinalizedTransactionWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.smallWidth};
  margin: 80px auto;
  text-align: center;
  padding: 0 8px;
`;

export const CheckIconWrapper = styled.div`
  width: 100px;
  height: 100px;
  margin: 40px auto;
  font-size: 80px;
  color: ${(p) => p.theme.color.white};
  background-color: #00f090;
  box-shadow: 0 0 0 10px #00f09022;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const PageTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-transform: capitalize;
`;

const CartTitle = styled.h3`
  padding: 20px 0;
  margin: 0;
`;

export const CartPageLayout = ({
  title,
  link = routes.store.inventory,
  children,
}: {
  title: string;
  children: ReactNode;
  link?: string;
}) => (
  <div>
    <TopNavWrapper>
      <TopNav>
        <PageTitle>{title}</PageTitle>

        <Button icon="arrow_back" secondary to={link} />
      </TopNav>
    </TopNavWrapper>

    {children}
  </div>
);

export const ConfirmationPage = () => {
  const { orderId, signatureId } = useParams();

  return (
    <CartPageLayout title="Confirmation">
      <FinalizedTransactionWrapper>
        <CheckIconWrapper>
          <Icon name="check" />
        </CheckIconWrapper>

        <h3>Payment successfull 🎉</h3>
        <p>Order ID: {orderId}</p>
        <div style={{ margin: '20px 0 40px' }}>
          <a
            href={getTxExplorerUrl({
              signature: signatureId,
              isDev: true,
            })}
            target="_blank"
            rel="noreferrer"
          >
            See transaction details <Icon name="launch" />
          </a>
        </div>
        <Button secondary fullWidth to={routes.store.inventory}>
          Start new order
        </Button>
      </FinalizedTransactionWrapper>
    </CartPageLayout>
  );
};

const TopNavWrapper = styled.div`
  padding: 8px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  height: 44px;
`;

const TopNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
`;

const CartPaymentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px 80px;
  margin: 20px auto;
  max-width: ${(p) => p.theme.layout.maxWidth};
  padding: 0 12px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    margin: 0;
  }
`;

const CartSummaryWrapper = styled.div``;

const CartItemsWrapper = styled.div`
  margin: 0 auto 20px;
  border-radius: 8px;
  height: min-content;

  @media (max-width: 1000px) {
    max-width: none;
    margin: 0;
    width: auto;
    border: none;
  }
`;

const TotalAndContinue = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${(p) => p.theme.color.background};
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const TotalAndContinueInner = styled.div`
  margin: 20px 8px 8px;
`;

const DesktopSummaryWrapper = styled.div`
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
  margin-top: 20px;
  padding: 40px 0 8px;
`;

const AlertMsgWrapper = styled.div`
  max-width: calc(100vw / 2 - 16px);
  margin: 0 auto 20px;
  width: 600px;

  @media (max-width: 1000px) {
    width: auto;
    max-width: initial;
    margin: 20px 20px 0;
    font-size: 14px;
  }
`;

const AlertMsg = styled.div`
  padding: 20px;
  border: 1px solid ${(p) => p.theme.color.primary};
  border-radius: ${(p) => p.theme.borderRadius.default};
  color: ${(p) => p.theme.color.primary};
  background-color: ${(p) => p.theme.color.primary}09;
  line-height: 1.4;

  @media (max-width: 1000px) {
    padding: 8px;
  }
`;

const ShippingFormWrapper = styled.div`
  position: sticky;
  top: 0;
  @media (max-width: 1000px) {
    position: static;
  }
`;

const CartItemsTitle = styled(CartTitle)`
  position: sticky;
  top: 0;
  background: ${(p) => p.theme.color.background}88;
  backdrop-filter: blur(4px);
  z-index: 9;

  @media (max-width: 1000px) {
    display: none;
  }
`;

const DevnetMsg = () => {
  const { currency } = useCurrency();

  const faucetLink = `https://spl-token-faucet.com/${
    currency === CURRENCY.SOL ? '' : '?token-name=USDC'
  }`;

  return (
    <AlertMsgWrapper>
      <AlertMsg>
        To make a purchase, switch your wallet to the DEVNET, and you can
        airdrop some {currency} here{' '}
        <a href={faucetLink} target="_blank" rel="noreferrer">
          {faucetLink}
        </a>
        .
      </AlertMsg>
    </AlertMsgWrapper>
  );
};

export const CartPage = () => {
  useScrollTop();
  const { totalWithSaleTax, cartItems, totalPrice, totalSaleTax } = useCart();
  const { status } = usePayment();
  const navigate = useNavigate();
  const showShippingForm = useMediaQuery('(max-width: 1000px)');

  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const { currency } = useCurrency();

  const isFinalized = status === PaymentStatus.Finalized;

  useEffect(() => {
    // Redirect the user if they dont have cart items or in the confirmation page
    if (cartItems.length === 0 && !isFinalized) {
      navigate(routes.store.inventory);
    }
  }, [cartItems.length, isFinalized, navigate]);

  useEffect(() => {
    setHeight(ref?.current?.clientHeight ?? 0);
  }, []);

  return (
    <CartPageLayout title="Current order">
      <CartPaymentLayout>
        <div>
          {/* <DevnetMsg /> */}

          <CartItemsTitle>Cart items</CartItemsTitle>

          <CartItemsWrapper style={{ marginBottom: `${height}px` }}>
            <CartItems showMoreButton />

            <DesktopSummaryWrapper>
              <CartSummaryWrapper>
                <CartSummary
                  totalPrice={totalPrice}
                  totalSaleTax={totalSaleTax}
                  totalWithSaleTax={totalWithSaleTax}
                  currency={currency}
                />
              </CartSummaryWrapper>
            </DesktopSummaryWrapper>
          </CartItemsWrapper>
        </div>

        <div>
          <ShippingFormWrapper>
            <CartTitle>Shipping information</CartTitle>
            <ShippingForm />
          </ShippingFormWrapper>
        </div>
      </CartPaymentLayout>
    </CartPageLayout>
  );
};
