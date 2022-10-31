import { Footer } from 'components';
import {
  Button,
  Icon,
  UnstyledButton,
  UnstyledExternalLink,
} from 'components-library';
import { HomepageTopNav } from 'pages/homepage';
import styled, { css } from 'styled-components';
import { useScrollTop } from 'hooks/scroll-top';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'hooks/media-query';
import { ReactNode, useState } from 'react';
import { slideInBottom, fadeIn } from 'utils/keyframes';
import { featuresList } from './features';
import { OtpForm } from 'pages/auth-page';
import background1 from './background/background-1.svg';
import { HIDE_APP } from 'configs';

const FeaturePageTitle = styled.h1`
  font-size: 56px;
`;

const FeaturesPageWrapper = styled(motion.div)`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 8px;
`;

const FeatureGroupMainWrapper = styled(motion.div)`
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

const FeatureImgWrapper = styled.div<{
  $backgroundImage: string;
  $isMobileImg?: boolean;
  $isActive?: boolean;
}>`
  background-image: url(${(p) => p.$backgroundImage});
  background-size: cover;
  background-position: 50% 50%;
  border-radius: ${(p) => p.theme.borderRadius.default};
  aspect-ratio: 3 / 2;
  overflow: hidden;

  @media (max-width: 800px) {
    margin: 0 20px 20px;
  }

  ${(p) =>
    !p.$isMobileImg &&
    css`
      position: relative;
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
        position: relative;
      }
    `}
`;

const FeatureImg = styled.img`
  width: 100%;
  height: 100%;
  aspect-ratio: 3 / 2;

  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  /* background: ${(p) => p.theme.color.lightGrey}; */

  opacity: 0;
  animation: 0.6s ${slideInBottom} forwards;
`;

const FeatureButton = styled(UnstyledButton)<{ $isActive: boolean }>`
  border: 1px solid
    ${(p) => (p.$isActive ? p.theme.color.text : p.theme.color.lightGrey)};
  border-radius: ${(p) => p.theme.borderRadius.default};
  text-align: left;
  transition: 0.2s;
`;

const FeatureButtonWrapper = styled.div``;

const FeatureButtonInnerWrapper = styled.div`
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

const OtpFormBakcground = styled(motion.div)`
  max-width: ${(p) => p.theme.layout.maxWidth};
  border-radius: ${(p) => p.theme.borderRadius.default};
  margin: 80px auto;
  background: ${(p) => p.theme.color.primary}11;
  border: 1px solid ${(p) => p.theme.color.primary};

  /* color: ${(p) => p.theme.color.black}; */

  /* label,
  p {
    color: ${(p) => p.theme.color.black};
  }

  input {
    background-color: ${(p) => p.theme.color.white};
    border-color: #767676;
  } */
`;

export const OtpWidget = () => (
  <OtpFormBakcground
    initial={{ opacity: 0, transform: 'translateY(40px)' }}
    whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
    viewport={{ once: true }}
    transition={{ type: 'spring', stiffness: 100 }}
  >
    <OtpFormWrapper>
      <OtpTitle>Open your web3 store today!</OtpTitle>

      <p style={{ lineHeight: 1.6 }}>
        Try the platform before everyone else. Subscribe to get early access to
        Chairleader.
      </p>

      {HIDE_APP ? (
        <UnstyledExternalLink
          href="https://www.producthunt.com/upcoming/chairleader"
          target="_blank"
        >
          <Button icon="launch">Get early access</Button>
        </UnstyledExternalLink>
      ) : (
        <OtpForm buttonText="Sign up now" />
      )}
    </OtpFormWrapper>
  </OtpFormBakcground>
);

export const FeatureGroup = ({
  title,
  description,
  features,
  isRightImg,
  backgroundImage,
}: {
  title: string;
  description: ReactNode;
  features: any[];
  isRightImg: boolean;
  backgroundImage: string;
}) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const isMobileView = useMediaQuery('(max-width: 800px)');

  return (
    <FeatureGroupMainWrapper
      initial={{ opacity: 0, transform: 'translateY(40px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <FeatureGroupTitle>{title}</FeatureGroupTitle>

      <FeatureGroupDescription>{description}</FeatureGroupDescription>

      <FeatureGroupWrapper $isRightImg={isRightImg}>
        {!isRightImg && !isMobileView && (
          <FeatureImgWrapper $backgroundImage={backgroundImage}>
            <FeatureImg
              src={features[activeFeature].imgSrc}
              key={`${title}_${activeFeature}`}
            />
          </FeatureImgWrapper>
        )}

        <FeatureButtonWrapper>
          <FeatureButtonInnerWrapper>
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
                    <FeatureImgWrapper
                      $backgroundImage={backgroundImage}
                      $isMobileImg
                      $isActive={isActive}
                    >
                      <FeatureImg src={features[activeFeature].imgSrc} />
                    </FeatureImgWrapper>
                  )}
                </FeatureButton>
              );
            })}
          </FeatureButtonInnerWrapper>
        </FeatureButtonWrapper>
        {isRightImg && !isMobileView && (
          <FeatureImgWrapper $backgroundImage={backgroundImage}>
            <FeatureImg
              src={features[activeFeature].imgSrc}
              key={`${title}_${activeFeature}`}
            />
          </FeatureImgWrapper>
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

        {featuresList.map(
          ({ title, description, features, backgroundImage }, index) => (
            <FeatureGroup
              key={title}
              title={title}
              description={description}
              features={features}
              isRightImg={!!(index % 2)}
              backgroundImage={backgroundImage}
            />
          )
        )}
      </FeaturesPageWrapper>

      <OtpWidget />

      <Footer />
    </>
  );
};
