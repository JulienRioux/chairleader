import styled from 'styled-components';
import { StoreInfoWrapper, StoreName } from '..';

const BannerWrapper = styled.div`
  position: relative;
`;

const ImgWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
`;

const BannerImg = styled.div`
  width: 100%;
  aspect-ratio: 3 / 1;
  border-radius: ${(p) => p.theme.borderRadius.default};
  background: ${(p) => p.theme.color.lightGrey};
  object-position: center;
  object-fit: cover;
  image-rendering: pixelated;
  border: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const StoreImg = styled.div`
  width: 128px;
  height: 128px;
  aspect-ratio: 3 / 1;
  border-radius: ${(p) => p.theme.borderRadius.default};
  background: ${(p) => p.theme.color.background}88;
  object-position: center;
  object-fit: cover;
  image-rendering: pixelated;
  border: 1px solid ${(p) => p.theme.color.white}00;

  @media (max-width: 800px) {
    width: 80px;
    height: 80px;
  }
`;

const StoreNameSkeleton = styled.div`
  background: ${(p) => p.theme.color.lightGrey};
  border-radius: ${(p) => p.theme.borderRadius.default};
  width: 220px;
  max-width: 40%;
  height: 28px;
  margin: 14px 0 4px;
`;

const StoreDescriptionSkeleton = styled.div`
  background: ${(p) => p.theme.color.lightGrey};
  border-radius: ${(p) => p.theme.borderRadius.default};
  width: 400px;
  max-width: 90%;
  height: 22px;
  margin: 16px 0;
`;

export const StoreBannerSkeleton = () => (
  <BannerWrapper>
    <BannerImg />

    <ImgWrapper>
      <StoreImg />
    </ImgWrapper>
  </BannerWrapper>
);

export const StoreInfoSkeleton = () => {
  return (
    <>
      <StoreInfoWrapper>
        <StoreNameSkeleton />
      </StoreInfoWrapper>
      <StoreDescriptionSkeleton />
    </>
  );
};
