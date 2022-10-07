import { PaymentStatus, usePayment } from 'hooks/payment';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { routes } from 'utils';
import styled from 'styled-components';
import { CartItems } from 'components/cart';
import { CartSummary } from 'components';
import { useCart } from 'hooks/cart';
import { useNavigate } from 'react-router-dom';
import { CURRENCY, useCurrency } from 'hooks/currency';
import { useScrollTop } from 'hooks/scroll-top';
import { ShippingForm } from 'components/shipping-form';
import { StoreLogo } from 'pages/pos-app/inventory-layout';

export const getTxExplorerUrl = ({ signature = '', isDev = false }) =>
  `https://explorer.solana.com/tx/${signature}${isDev && '?cluster=devnet'}`;

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
  children,
}: {
  title: ReactNode;
  children: ReactNode;
  link?: string;
}) => (
  <div>
    <TopNavWrapper>
      <TopNav>
        <PageTitle>{title}</PageTitle>
      </TopNav>
    </TopNavWrapper>

    {children}
  </div>
);

const TopNavWrapper = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  height: 44px;
`;

const TopNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  height: 100%;
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
    position: static;
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
  const { totalWithSaleTax, cartItems, totalPrice, totalSaleTax, shippingFee } =
    useCart();
  const { status } = usePayment();
  const navigate = useNavigate();

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
    <CartPageLayout title={<StoreLogo />}>
      <CartPaymentLayout>
        <div>
          {/* <DevnetMsg /> */}

          <CartItemsTitle>Cart summary</CartItemsTitle>

          <CartItemsWrapper style={{ marginBottom: `${height}px` }}>
            <CartItems showMoreButton />

            <DesktopSummaryWrapper>
              <CartSummaryWrapper>
                <CartSummary
                  totalPrice={totalPrice}
                  totalSaleTax={totalSaleTax}
                  totalWithSaleTax={totalWithSaleTax}
                  currency={currency}
                  shippingFee={shippingFee}
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
