import { Icon, Button, UnstyledButton, message } from 'components-library';
import styled from 'styled-components';
import { useAuth } from 'hooks/auth';
import { useCallback } from 'react';

const PointOfSalePageWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.mediumWidth};
  margin: 0 auto;
`;

const Par = styled.p`
  color: ${(p) => p.theme.color.lightText};
  text-align: center;
  margin-bottom: 40px;
`;

const Img = styled.img`
  width: 100%;
  border-radius: ${(p) => p.theme.borderRadius.default};
  aspect-ratio: 12 / 8;
  border: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const CopyLinkBtn = styled(UnstyledButton)`
  background: ${(p) => p.theme.color.primary}11;
  color: ${(p) => p.theme.color.primary};
  border: 1px solid ${(p) => p.theme.color.primary}22;
  border-radius: 2px;
  padding: 2px 8px;
`;

export const useStoreLink = () => {
  const { user } = useAuth();

  const { protocol, host } = window.location;

  return `${protocol}//${user?.subDomain}.${host}`;
};

export const PointOfSalePage = () => {
  const storeLink = useStoreLink();

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(storeLink);
    message.success(`${storeLink} has been copied to your clipboard.`);
  }, [storeLink]);

  return (
    <PointOfSalePageWrapper>
      <Img src="https://craftwork-images.b-cdn.net/wp-content/uploads/flow-lava-02-cyborg-and-woman.png" />

      <Par>
        Your point-of-sale is located at:{' '}
        <CopyLinkBtn onClick={handleCopyLink}>
          {storeLink} <Icon name="copy" />
        </CopyLinkBtn>
      </Par>

      <div style={{ margin: '20px 0' }}>
        <a href={storeLink} target="_blank" rel="noreferrer">
          <Button fullWidth>
            <span>Open point-of-sale</span>

            <span style={{ marginLeft: '8px' }}>
              <Icon name="launch" />
            </span>
          </Button>
        </a>
      </div>
    </PointOfSalePageWrapper>
  );
};
