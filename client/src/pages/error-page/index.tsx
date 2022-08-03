import { Button } from 'components-library';
import styled from 'styled-components';

export const ErrorPageWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.smallWidth};
  margin: 40px auto;
`;

export const ButtonsWrapper = styled.div``;

const Img = styled.img`
  width: 100%;
`;

export const ErrorPage = () => {
  return (
    <>
      <ErrorPageWrapper>
        <Img src="https://craftwork-images.b-cdn.net/wp-content/uploads/flow-lava-12-androgyne-and-bigfoot.png" />

        <h1 data-testid="error-page-title">Page Not Found</h1>

        <p>The page you were looking for was moved or doesn&apos;t exist.</p>

        <ButtonsWrapper>
          <Button to={-1} secondary fullWidth style={{ margin: '28px 0 8px' }}>
            Go back
          </Button>
        </ButtonsWrapper>
      </ErrorPageWrapper>
    </>
  );
};
