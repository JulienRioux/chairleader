import {
  NFT_ROYALTY,
  PAYMENT_SERVICE_FEE,
  SELLING_NFT_SERVICE_FEE,
} from 'configs';
import { HalfImagePageLayout, OtpForm } from 'pages/auth-page';
import styled from 'styled-components';

const PricingPageWrapper = styled.div`
  margin: 48px auto;
`;

const Par = styled.p`
  line-height: 1.6;
  font-size: 18px;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 120px auto 80px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
    margin: 80px auto;
    border: 1px solid ${(p) => p.theme.color.lightGrey};
    border-radius: 12px;
  }
`;

const PricingGridItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  border-width: 0 0 0 1px;
  border-style: solid;
  border-color: ${(p) => p.theme.color.lightGrey};
  padding: 0 50px 80px;

  @media (min-width: 799px) {
    :first-of-type {
      border: none;
    }
  }

  @media (max-width: 800px) {
    padding: 20px;

    :nth-of-type(1) {
      border-width: 0 1px 1px 0 !important;
      border-color: ${(p) => p.theme.color.lightGrey};
    }
    :nth-of-type(2) {
      border-width: 0 0 1px 0;
      border-color: ${(p) => p.theme.color.lightGrey};
    }
    :nth-of-type(3) {
      border-width: 0 1px 0 0;
      border-color: ${(p) => p.theme.color.lightGrey};
    }
    :nth-of-type(4) {
      border: none;
    }
  }
`;

const PricingGridTitle = styled.div`
  font-size: 48px;
  font-weight: bold;
`;

const PricingGridText = styled.p`
  line-height: 1.6;
  margin-bottom: 0;
  text-align: center;
`;

const TextWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

export const PricingPage = () => {
  return (
    <HalfImagePageLayout>
      <PricingPageWrapper>
        <div style={{ textAlign: 'center' }}>
          <h1>Pricing</h1>

          <Par>
            Access a complete e-commerce platform with simple, pay-as-you-go
            pricing.
          </Par>
        </div>

        <PricingGrid>
          <PricingGridItem>
            <PricingGridTitle>{PAYMENT_SERVICE_FEE}%</PricingGridTitle>
            <PricingGridText>Per transaction</PricingGridText>
          </PricingGridItem>

          <PricingGridItem>
            <PricingGridTitle>0%</PricingGridTitle>
            <PricingGridText>On NFT creation</PricingGridText>
          </PricingGridItem>

          <PricingGridItem>
            <PricingGridTitle>
              {SELLING_NFT_SERVICE_FEE * 100}%
            </PricingGridTitle>
            <PricingGridText>On NFT membership sales</PricingGridText>
          </PricingGridItem>

          <PricingGridItem>
            <PricingGridTitle>{NFT_ROYALTY * 100}%</PricingGridTitle>
            <PricingGridText>Royalty on NFT created</PricingGridText>
          </PricingGridItem>
        </PricingGrid>

        <TextWrapper>
          <h2>Set up your store and start selling today!</h2>
          <OtpForm buttonText="Start now" />
        </TextWrapper>
      </PricingPageWrapper>
    </HalfImagePageLayout>
  );
};
