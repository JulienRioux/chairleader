import { Footer } from 'components';
import { Icon, UnstyledButton } from 'components-library';
import { HomepageTopNav } from 'pages/homepage';
import styled, { css } from 'styled-components';
import { useScrollTop } from 'hooks/scroll-top';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'hooks/media-query';
import { ReactNode, useState } from 'react';
import { fadeIn } from 'utils/keyframes';
import { featuresList } from './features';
import { OtpForm } from 'pages/auth-page';

const FeaturePageTitle = styled.h1`
  font-size: 56px;
`;

const FeaturesPageWrapper = styled(motion.div)`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 8px;
`;

const FeatureGroupMainWrapper = styled.div`
  margin: 120px 0;

  @media (max-width: 800px) {
    margin: 80px 0;
  }
`;

const FeatureGroupWrapper = styled.div<{ $isRightImg: boolean }>`
  display: grid;
  grid-template-columns: ${(p) => (p.$isRightImg ? '4fr 6fr' : '6fr 4fr')};
  gap: 20px;
  position: relative;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureImg = styled.img<{ $isMobileImg?: boolean; $isActive?: boolean }>`
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: ${(p) => p.theme.borderRadius.default};
  background: ${(p) => p.theme.color.lightGrey};

  opacity: 0;
  animation: 0.4s ${fadeIn} forwards;

  ${(p) =>
    !p.$isMobileImg &&
    css`
      position: sticky;
      top: 20px;
    `}

  @media (max-width: 800px) {
    display: none;
  }

  ${(p) =>
    p.$isMobileImg &&
    p.$isActive &&
    css`
      display: none;

      @media (max-width: 800px) {
        display: block;
        margin: 0 20px 20px;
        width: calc(100% - 40px);
      }
    `}
`;

const FeatureButton = styled(UnstyledButton)<{ $isActive: boolean }>`
  border: 1px solid
    ${(p) => (p.$isActive ? p.theme.color.text : p.theme.color.lightGrey)};
  border-radius: ${(p) => p.theme.borderRadius.default};
  text-align: left;
  transition: 0.2s;
`;

const FeatureButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SingleFeatureTitle = styled.h5`
  font-size: 20px;
  margin: 0 12px 0 0;
  line-height: 1.4;
`;

const SingleFeatureDescription = styled.p`
  margin: 0;
  color: ${(p) => p.theme.color.lightText};
  margin: 0 20px 20px;
  line-height: 1.6;

  opacity: 0;
  animation: 0.4s ${fadeIn} forwards;
`;

const FeatureGroupTitle = styled.h3`
  font-size: 36px;

  @media (max-width: 800px) {
    margin-bottom: 0;
  }
`;

const FeatureGroupDescription = styled.p`
  color: ${(p) => p.theme.color.lightText};
  margin: 0 0 40px;
  line-height: 1.6;

  @media (max-width: 800px) {
    margin: 20px 0;
  }
`;

const SingleFeatureTitleWrapper = styled.div`
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OtpFormWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 80px 8px;
`;

const OtpTitle = styled.h3`
  font-size: 36px;
  margin: 0 0 12px;
  font-size: 36px;
`;

const OtpFormBakcground = styled.div`
  background: #ffff00;

  color: ${(p) => p.theme.color.black};

  label,
  p {
    color: ${(p) => p.theme.color.black};
  }

  input {
    background-color: ${(p) => p.theme.color.white};
    border-color: #767676;
  }
`;

export const OtpWidget = () => (
  <OtpFormBakcground>
    <OtpFormWrapper>
      <OtpTitle>Open your web3 store today!</OtpTitle>
      <OtpForm buttonText="Sign up now" />
    </OtpFormWrapper>
  </OtpFormBakcground>
);

export const FeatureGroup = ({
  title,
  description,
  features,
  isRightImg,
}: {
  title: string;
  description: ReactNode;
  features: any[];
  isRightImg: boolean;
}) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const isMobileView = useMediaQuery('(max-width: 800px)');

  return (
    <FeatureGroupMainWrapper>
      <FeatureGroupTitle>{title}</FeatureGroupTitle>

      <FeatureGroupDescription>{description}</FeatureGroupDescription>

      <FeatureGroupWrapper $isRightImg={isRightImg}>
        {!isRightImg && !isMobileView && (
          <div key={activeFeature}>
            <FeatureImg src={features[activeFeature].imgSrc} />
          </div>
        )}

        <FeatureButtonWrapper>
          {features.map(({ title, description }, index) => {
            const isActive = activeFeature === index;
            return (
              <FeatureButton
                key={title}
                onClick={() => setActiveFeature(index)}
                $isActive={isActive}
              >
                <SingleFeatureTitleWrapper>
                  <SingleFeatureTitle>{title}</SingleFeatureTitle>

                  <Icon name={isActive ? 'arrow_upward' : 'arrow_downward'} />
                </SingleFeatureTitleWrapper>
                {isActive && (
                  <SingleFeatureDescription>
                    {description}
                  </SingleFeatureDescription>
                )}

                {isMobileView && (
                  <FeatureImg
                    $isMobileImg
                    $isActive={isActive}
                    src={features[activeFeature].imgSrc}
                  />
                )}
              </FeatureButton>
            );
          })}
        </FeatureButtonWrapper>
        {isRightImg && !isMobileView && (
          <div>
            <FeatureImg src={features[activeFeature].imgSrc} />
          </div>
        )}
      </FeatureGroupWrapper>
    </FeatureGroupMainWrapper>
  );
};

export const FeaturesPage = () => {
  useScrollTop();

  return (
    <>
      <HomepageTopNav />
      <FeaturesPageWrapper>
        <FeaturePageTitle>Features</FeaturePageTitle>

        {featuresList.map(({ title, description, features }, index) => (
          <FeatureGroup
            key={title}
            title={title}
            description={description}
            features={features}
            isRightImg={!!(index % 2)}
          />
        ))}
      </FeaturesPageWrapper>

      <OtpWidget />

      <Footer />
    </>
  );
};
