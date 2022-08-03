import { PublicKey } from '@solana/web3.js';
import { Button, Icon, Loader, UnstyledExternalLink } from 'components-library';
import { ConfigProvider } from 'contexts/ConfigProvider';
import { PaymentProvider } from 'contexts/PaymentProvider';
import { TransactionsProvider } from 'contexts/TransactionsProvider';
import { PaymentStatus, usePayment } from 'hooks/usePayment';
import { ReactNode, useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Logger, routes } from 'utils';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { QRCode } from 'components/qr-code';
import { Digits } from 'types';
import styled from 'styled-components';
import { CartItems } from 'components/cart';
import { CartSummary } from 'components';
import { useCart } from 'hooks/cart';
import { useNavigate, useParams } from 'react-router-dom';
import { PoweredBySolanaPay } from 'components/powered-by-solana-pay';
import { APP_NAME, USE_TRANSACTION } from 'configs';
import { useStore } from 'hooks/store';
import { useCurrency } from 'hooks/currency';
import { useScrollTop } from 'hooks/scroll-top';
import { SolanaPayLogo } from 'components/powered-by-solana-pay/SolanaPayLogo';
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

const PayWithSolanaPay = styled(Button)`
  margin: 20px 0;
  color: ${(p) => p.theme.color.background};
  background: ${(p) => p.theme.color.text};
  border-color: ${(p) => p.theme.color.text};
  display: flex;
  align-items: center;
`;

const CartPaymentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;

  @media (max-width: 800px) {
    margin-top: 40px;
    border-top: 1px solid ${(p) => p.theme.color.lightGrey};
  }
`;

const PayWithSolanaPayLink = styled(UnstyledExternalLink)`
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const OrText = styled.div`
  padding: 20px 8px;
  text-align: center;
  opacity: 0.7;
`;

const Hr = styled.div`
  width: 100%;
  padding: 20px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const CartPageLayout = ({ children }: { children: ReactNode }) => (
  <div>
    <TopNav>
      <PageTitle>Current order</PageTitle>

      <Button icon="arrow_back" secondary to={routes.store.inventory} />
    </TopNav>

    {children}
  </div>
);

export const ConfirmationPage = () => {
  const { orderId, signatureId } = useParams();

  return (
    <CartPageLayout>
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

const QrCodeLink = () => {
  const { amount, url } = usePayment();
  const isMobileView = useMediaQuery('(max-width: 800px)');

  if (!amount) {
    return null;
  }

  return (
    <CartPaymentWrapper>
      <PoweredBySolanaPay />

      <p style={{ fontWeight: 'bold' }}>
        Scan this code with your Solana Pay wallet
      </p>

      <QRCode />

      <p>You'll be asked to approve the transaction</p>

      <Hr />

      <OrText>or pay with Phantom wallet on mobile.</OrText>

      <PayWithSolanaPayLink href={url?.href} target="_blank">
        <PayWithSolanaPay fullWidth={isMobileView}>
          <span style={{ marginRight: '12px' }}>Pay with</span>
          <SolanaPayLogo />
        </PayWithSolanaPay>
      </PayWithSolanaPayLink>
    </CartPaymentWrapper>
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

const CartSummaryWrapper = styled.div`
  padding: 40px 20px 8px;
`;

const CartItemsWrapper = styled.div`
  max-width: calc(100vw / 2);
  width: 600px;
  margin: 0 auto;

  @media (max-width: 1000px) {
    max-width: none;
    margin: 0;
    width: auto;
  }
`;

export const CartPage = () => {
  useScrollTop();
  const { generate, setAmount, progress } = usePayment();
  const { totalWithSaleTax, cartItems, totalPrice, totalSaleTax } = useCart();
  const { status } = usePayment();
  const navigate = useNavigate();

  const { currency } = useCurrency();

  const isFinalized = status === PaymentStatus.Finalized;

  useEffect(() => {
    setAmount(totalWithSaleTax ? new BigNumber(totalWithSaleTax) : undefined);
    generate();
  }, [generate, setAmount, totalWithSaleTax]);

  useEffect(() => {
    // Redirect the user if they dont have cart items or in the confirmation page
    if (cartItems.length === 0 && !isFinalized) {
      navigate(routes.store.inventory);
    }
  }, [cartItems.length, isFinalized, navigate]);

  return (
    <CartPageLayout>
      <CartPaymentLayout>
        <CartItemsWrapper>
          <CartItems showHeaderText={false} />

          <CartSummaryWrapper>
            <CartSummary
              totalPrice={totalPrice}
              totalSaleTax={totalSaleTax}
              totalWithSaleTax={totalWithSaleTax}
              currency={currency}
            />
          </CartSummaryWrapper>
        </CartItemsWrapper>

        <div>
          {progress === 0 && (
            <div>
              <QrCodeLink />
            </div>
          )}

          {progress > 0 && <Loader />}
        </div>
      </CartPaymentLayout>
    </CartPageLayout>
  );
};

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

  const link = USE_TRANSACTION
    ? new URL('https://9w2ejfrzsb.execute-api.us-east-1.amazonaws.com')
    : undefined;

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
