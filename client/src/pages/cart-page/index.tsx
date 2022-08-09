import { PublicKey } from '@solana/web3.js';
import { Button, Icon } from 'components-library';
import { ConfigProvider } from 'contexts/ConfigProvider';
import { PaymentProvider } from 'contexts/PaymentProvider';
import { TransactionsProvider } from 'contexts/TransactionsProvider';
import { PaymentStatus, usePayment } from 'hooks/usePayment';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Logger, routes } from 'utils';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { Digits } from 'types';
import styled from 'styled-components';
import { CartItems } from 'components/cart';
import { CartSummary } from 'components';
import { useCart } from 'hooks/cart';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from 'hooks/store';
import { useCurrency } from 'hooks/currency';
import { useScrollTop } from 'hooks/scroll-top';
import { PaymentOptions } from 'pages/cart-payment-page';
import { useMediaQuery } from 'hooks/media-query';

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
    <TopNav>
      <PageTitle>{title}</PageTitle>

      <Button icon="arrow_back" secondary to={link} />
    </TopNav>

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

const TopNav = styled.div`
  padding: 8px 20px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CartPaymentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 80px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    margin: 0;
  }
`;

const CartSummaryWrapper = styled.div``;

const CartItemsWrapper = styled.div`
  max-width: calc(100vw / 2);
  width: 600px;
  margin: 0 auto;
  border: 1px solid ${(p) => p.theme.color.lightGrey};
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
  padding: 40px 20px 8px;
`;

export const CartPage = () => {
  useScrollTop();
  const { totalWithSaleTax, cartItems, totalPrice, totalSaleTax } = useCart();
  const { status } = usePayment();
  const navigate = useNavigate();
  const showPaymentOptions = useMediaQuery('(max-width: 1000px)');

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
        <CartItemsWrapper style={{ marginBottom: `${height}px` }}>
          <CartItems showHeaderText={false} />

          {!showPaymentOptions && (
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
          )}
        </CartItemsWrapper>

        {showPaymentOptions ? (
          <TotalAndContinue ref={ref}>
            <TotalAndContinueInner>
              <CartSummaryWrapper>
                <CartSummary
                  totalPrice={totalPrice}
                  totalSaleTax={totalSaleTax}
                  totalWithSaleTax={totalWithSaleTax}
                  currency={currency}
                />
              </CartSummaryWrapper>

              <Button
                style={{ marginTop: '8px' }}
                to={routes.store.payment}
                fullWidth
              >
                Continue to payment
              </Button>
            </TotalAndContinueInner>
          </TotalAndContinue>
        ) : (
          <PaymentOptions />
        )}
      </CartPaymentLayout>
    </CartPageLayout>
  );
};

// TODO: Move this in it's own file!!!
export const SolanaPayProviders = ({ children }: { children: ReactNode }) => {
  const {
    symbol,
    walletAdapterNetwork,
    icon,
    networkEndpoint,
    splToken,
    decimals,
    minDecimals,
  } = useCurrency();
  const { cartItemsNumber } = useCart();

  const baseURL = `https://${window.location.host}`;

  const { store } = useStore();

  // If you're testing without a mobile wallet, set this to true to allow a browser wallet to be used.
  const connectWallet = false;

  const link = new URL(
    'https://9w2ejfrzsb.execute-api.us-east-1.amazonaws.com'
  );

  let recipient: PublicKey | undefined = undefined;

  const recipientParam =
    store?.walletAddress ?? 'CaLiBb3CPagr4Vfaiyr6dsBZ5vxadjN33o6QgaMzj48m';
  const label = store?.storeName;

  const message = `${cartItemsNumber} items`;

  if (recipientParam && label) {
    try {
      recipient = new PublicKey(recipientParam);
    } catch (error) {
      Logger.error(error);
    }
  }

  const wallets = useMemo(
    () =>
      connectWallet
        ? [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network: walletAdapterNetwork }),
          ]
        : [],
    [connectWallet, walletAdapterNetwork]
  );

  return (
    <ConnectionProvider endpoint={networkEndpoint}>
      <WalletProvider wallets={wallets} autoConnect={connectWallet}>
        <ConfigProvider
          baseURL={baseURL}
          link={link}
          recipient={recipient as PublicKey}
          label={label}
          message={message}
          symbol={symbol}
          icon={icon}
          decimals={decimals as Digits}
          minDecimals={minDecimals as Digits}
          connectWallet={connectWallet}
          splToken={splToken}
        >
          <TransactionsProvider>
            <PaymentProvider>{children}</PaymentProvider>
          </TransactionsProvider>
        </ConfigProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
