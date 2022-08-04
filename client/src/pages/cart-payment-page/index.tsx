import { CartPageLayout } from 'pages/cart-page';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import {
  Button,
  Icon,
  UnstyledButton,
  UnstyledExternalLink,
  Loader,
} from 'components-library';
import { usePayment } from 'hooks/usePayment';
import { isMobileDevice, routes } from 'utils';
import { QRCode } from 'components/qr-code';
import { useCart } from 'hooks/cart';
import { PoweredBySolanaPay } from 'components/powered-by-solana-pay';
import { SolanaPayLogo } from 'components/powered-by-solana-pay/SolanaPayLogo';
import { useMediaQuery } from 'hooks/media-query';

const PayWithSolanaPay = styled(Button)`
  color: ${(p) => p.theme.color.background};
  background: ${(p) => p.theme.color.text};
  border-color: ${(p) => p.theme.color.text};
  display: flex;
  align-items: center;
  height: 44px;
`;

const PayWithSolanaPayLink = styled(UnstyledExternalLink)`
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const CartPaymentPageWrapper = styled.div`
  height: calc(100vh - 61px);
`;

const CollapsibleOption = styled.div`
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
  text-align: center;

  :first-of-type {
    border-top: none;
  }
`;

const CollapsibleButton = styled(UnstyledButton)<{ isExpanded: boolean }>`
  font-size: 16px;
  padding: 16px 8px;
  width: 100%;
  display: flex;
  align-items: center;

  ${(p) =>
    p.isExpanded && `border-bottom: 1px solid ${p.theme.color.lightGrey};`}
`;

const ContentWrapper = styled.div`
  padding: 32px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Circle = styled.div`
  border: 1px solid ${(p) => p.theme.color.lightGrey};
  border-radius: 50%;
  margin-right: 4px;
`;

const InnerCircle = styled.div<{ isExpanded: boolean }>`
  height: 13px;
  width: 13px;
  border-radius: 50%;
  margin: 3px;
  ${(p) => p.isExpanded && `background: ${p.theme.color.primary}`}
`;

const PaymentOptionsMainWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
  width: 600px;
  border: 1px solid ${(p) => p.theme.color.lightGrey};
  height: fit-content;
  border-radius: ${(p) => p.theme.borderRadius.default};

  @media (max-width: 1248px) {
    width: 480px;
  }

  @media (max-width: 1000px) {
    border: none;
  }
`;

enum TABS {
  QR_CODE = 'QR_CODE',
  SOLANA_PAY = 'SOLANA_PAY',
  PAYMENT_LINK = 'PAYMENT_LINK',
}

const Option = ({
  title,
  children,
  isExpanded,
  onClick,
}: {
  title: string;
  children: ReactNode;
  isExpanded: boolean;
  onClick: () => void;
}) => {
  return (
    <CollapsibleOption>
      <CollapsibleButton onClick={onClick} isExpanded={isExpanded}>
        <Circle>
          <InnerCircle isExpanded={isExpanded} />
        </Circle>
        <span style={{ marginLeft: '8px' }}>{title}</span>
      </CollapsibleButton>
      {isExpanded && <ContentWrapper>{children}</ContentWrapper>}
    </CollapsibleOption>
  );
};

export const PaymentOptions = () => {
  const isMobile = isMobileDevice();
  const [currentTab, setCurrentTab] = useState(
    isMobile ? TABS.SOLANA_PAY : TABS.QR_CODE
  );

  const isMobileView = useMediaQuery('(max-width: 800px)');

  const { getPaymentLink } = useCart();
  const { url, amount } = usePayment();
  const { generate, setAmount, progress } = usePayment();

  const { totalWithSaleTax } = useCart();

  useEffect(() => {
    setAmount(totalWithSaleTax ? new BigNumber(totalWithSaleTax) : undefined);
    generate();
  }, [generate, setAmount, totalWithSaleTax]);

  if (progress > 0) return <Loader />;

  return (
    <PaymentOptionsMainWrapper>
      <Option
        title="Qr code"
        isExpanded={currentTab === TABS.QR_CODE}
        onClick={() => setCurrentTab(TABS.QR_CODE)}
      >
        {amount ? (
          <>
            <PoweredBySolanaPay />

            <p style={{ fontWeight: 'bold' }}>
              Scan this code with your Solana Pay wallet
            </p>

            <QRCode />

            <p style={{ marginBottom: '0' }}>
              You'll be asked to approve the transaction
            </p>
          </>
        ) : (
          <Loader />
        )}
      </Option>

      {isMobile && (
        <Option
          title="Solana Pay"
          isExpanded={currentTab === TABS.SOLANA_PAY}
          onClick={() => setCurrentTab(TABS.SOLANA_PAY)}
        >
          <PayWithSolanaPayLink href={url?.href} target="_blank">
            <PayWithSolanaPay fullWidth>
              <span style={{ marginRight: '12px' }}>Pay with</span>
              <SolanaPayLogo />
            </PayWithSolanaPay>
          </PayWithSolanaPayLink>
        </Option>
      )}

      <Option
        title="Payment link"
        isExpanded={currentTab === TABS.PAYMENT_LINK}
        onClick={() => setCurrentTab(TABS.PAYMENT_LINK)}
      >
        <Button secondary onClick={getPaymentLink} fullWidth>
          Copy payment link
          <Icon name="insert_link" style={{ marginLeft: '8px' }} />
        </Button>
      </Option>
    </PaymentOptionsMainWrapper>
  );
};

const PaymentOptionsWrapper = styled.div`
  background: ${(p) => p.theme.color.white};
`;

export const CartPaymentPage = () => {
  const { progress } = usePayment();

  return (
    <CartPageLayout title="Payment" link={routes.store.cart}>
      <CartPaymentPageWrapper>
        <div>
          {progress === 0 && (
            <PaymentOptionsWrapper>
              <PaymentOptions />
            </PaymentOptionsWrapper>
          )}

          {progress > 0 && <Loader />}
        </div>
      </CartPaymentPageWrapper>
    </CartPageLayout>
  );
};
