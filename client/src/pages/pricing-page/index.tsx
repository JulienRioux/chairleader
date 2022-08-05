import { HomepageTopNav } from 'pages/homepage';
import styled from 'styled-components';

const PricingPageWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
`;

export const PricingPage = () => {
  return (
    <>
      <HomepageTopNav />
      <PricingPageWrapper>
        <h1>We're in public beta and free to use.</h1>

        <p>
          A complete payments platform engineered for growth. A pre-built,
          hosted payments page optimized for conversion.
        </p>
      </PricingPageWrapper>
    </>
  );
};
