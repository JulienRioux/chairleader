import { Button } from 'components-library';
import styled from 'styled-components';
import { routes } from 'utils';
import { InventoryLayout } from '../inventory-layout';

const Img = styled.img`
  object-position: center;
  object-fit: cover;
  width: 50%;
  aspect-ratio: 1;
  /* position: absolute; */
  border-radius: ${(p) => p.theme.borderRadius.default};
  background: ${(p) => p.theme.color.text}22;

  @media (max-width: 800px) {
    width: 100%;
    aspect-ratio: 4 / 3;
  }
`;

const HeroWrapper = styled.div`
  display: flex;
  margin: 20px 0;
  border-radius: ${(p) => p.theme.borderRadius.default};
  align-items: center;
  gap: 20px;

  @media (max-width: 800px) {
    flex-direction: column-reverse;
    margin: 0 0 80px;
  }
`;

const HeroContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 8px;
  height: calc(100% - 16px);
  width: 50%;

  @media (max-width: 800px) {
    width: 100%;

    button {
      width: 100%;
      margin: 0 0 8px !important;
    }
  }
`;

const HeroTitle = styled.h1`
  font-size: 80px;
  margin: 0;

  @media (max-width: 800px) {
    font-size: 40px;
  }
`;

const HeroPar = styled.p`
  font-size: 18px;
  margin: 16px 0 20px;
  line-height: 1.6;
  color: ${(p) => p.theme.color.lightText};

  @media (max-width: 800px) {
    font-size: 16px;
  }
`;

const BtnWrapper = styled.div`
  width: 100%;
`;

export const StoreHomepage = () => {
  return (
    <InventoryLayout>
      <HeroWrapper>
        <HeroContentWrapper>
          <HeroTitle>100% organic coffee</HeroTitle>
          <HeroPar>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor.
          </HeroPar>

          <BtnWrapper>
            <Button to={routes.store.inventory}>Shop now</Button>
            <Button
              style={{ marginLeft: '8px' }}
              secondary
              to={routes.store.nfts}
            >
              Browse NFTs
            </Button>
          </BtnWrapper>
        </HeroContentWrapper>

        <Img src="https://images.squarespace-cdn.com/content/v1/54f775e2e4b07edc19ac338f/1585420060107-NSVI5AGYCZ27S1DG976T/image-asset.jpeg?format=1500w" />
      </HeroWrapper>
    </InventoryLayout>
  );
};
