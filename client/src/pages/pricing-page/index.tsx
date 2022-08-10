import { Button } from 'components-library';
import { HalfImagePageLayout } from 'pages/auth-page';
import styled from 'styled-components';
import { routes } from 'utils';

const PricingPageWrapper = styled.div`
  margin: 100px auto;
  width: ${(p) => p.theme.layout.smallWidth};
  text-align: center;
`;

const PrecentPricing = styled.div`
  font-size: 100px;
  /* font-weight: bold; */
  /* color: ${(p) => p.theme.color.text}cc; */
`;

const Par = styled.p`
  line-height: 1.6;
  font-size: 18px;
`;

const PerTransaction = styled.span`
  font-size: 20px;
  margin-left: 20px;
  font-weight: normal;
`;

const TextWrapper = styled.div`
  margin: 0 0 40px;
`;

export const PricingPage = () => {
  return (
    <HalfImagePageLayout>
      <PricingPageWrapper>
        <h1>Pricing</h1>

        <TextWrapper>
          <Par>
            Access a complete payments platform with simple, pay-as-you-go
            pricing.
          </Par>

          <PrecentPricing>
            1%<PerTransaction>Per transaction</PerTransaction>
          </PrecentPricing>
        </TextWrapper>

        <Button fullWidth to={routes.auth}>
          Start now!
        </Button>
      </PricingPageWrapper>
    </HalfImagePageLayout>
  );
};
