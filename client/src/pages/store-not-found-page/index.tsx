import { Button } from 'components-library';
import { HomepageTopNav } from 'pages/homepage';
import styled from 'styled-components';
import { routes } from 'utils';

export const StoreNotFoundPageWrapper = styled.div``;

export const InnerWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.smallWidth};
  margin: 80px auto;
  text-align: center;
`;

export const Title = styled.h1``;

const Par = styled.p`
  color: ${(p) => p.theme.color.lightText};
  margin-bottom: 20px;
`;

const Img = styled.img`
  width: 100%;
`;

export const StoreNotFoundPage = () => {
  return (
    <StoreNotFoundPageWrapper>
      <HomepageTopNav />
      <InnerWrapper>
        <Img src="https://craftwork-images.b-cdn.net/wp-content/uploads/flow-lava-12-androgyne-and-bigfoot.png" />

        <Title>Store not found</Title>

        <Par>
          The store you're looking did not exists or has changed it's URL.
        </Par>

        <Button fullWidth secondary to={routes.base}>
          Go home
        </Button>
      </InnerWrapper>
    </StoreNotFoundPageWrapper>
  );
};
