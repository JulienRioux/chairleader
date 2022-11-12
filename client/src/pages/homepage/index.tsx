import {
  Button,
  Icon,
  UnstyledButton,
  UnstyledExternalLink,
  UnstyledLink,
  Video,
} from 'components-library';
import styled, { css, keyframes } from 'styled-components';
import { routes } from 'utils';
import { Footer } from 'components';
import { APP_NAME, HIDE_APP } from 'configs';
import { useTheme } from 'hooks/theme';
import { useAuth } from 'hooks/auth';
import { useMediaQuery } from 'hooks/media-query';
import { ReactNode, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

import videoSrc from 'assets/homepage/homepage-video.mp4';
import appLogoSrc from 'assets/app-logo.png';
import appLogoSrcGif from 'assets/app-logo.gif';
import appLogoSrcQuickGif from 'assets/app-logo-quick.gif';
import rainbowSrc from 'assets/homepage/rainbow.png';
import msgSrc from 'assets/homepage/msg.png';
import solanaSrc from 'assets/homepage/solana.png';
import shopSrc from 'assets/homepage/shop.png';
import robotSrc from 'assets/homepage/robot.png';
import graphSrc from 'assets/homepage/graph.png';
import cupSrc from 'assets/homepage/cup.png';
import videoPosterSrc from 'assets/homepage/video-poster.png';
import { useLocation } from 'react-router-dom';
import { FeatureGroup, OtpWidget } from 'pages/features-page';
import { featuresList } from 'pages/features-page/features';

const HeroWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0px auto 0;
  min-height: calc(100vh - 101px);
  gap: 20px;
  display: flex;
  align-items: center;

  @media (max-width: 800px) {
    width: 100%;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`;

export const backgroundTextAnim = keyframes`
  100% {
    background-position: 0 -50px;
  }  
`;

const Header = styled.h1`
  font-size: 70px;
  margin-bottom: 40px;
  margin-top: 0;
  /* background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  mix-blend-mode: exclusion;
  animation: 3s ${backgroundTextAnim} linear infinite; */

  @media (max-width: 800px) {
    font-size: 48px;
  }
`;

const HeroPar = styled.p`
  color: ${(p) => p.theme.color.lightText};
  font-size: 18px;
  margin: 0 0 24px;
  line-height: 1.6;
  margin: 0 auto 24px;
`;

const Par = styled.p`
  color: ${(p) => p.theme.color.lightText};
  font-size: 18px;
  margin: 0 0 24px;
  line-height: 1.6;
`;

const TopNavWrapper = styled.div`
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  padding: 8px;
`;

const TopNav = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  min-height: 44px;
`;

const AppIconImgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 34px;
  height: 34px;
`;

const AppIconImg = styled.img`
  height: 34px;
  width: 34px;
  margin-right: 8px;
  position: absolute;

  :nth-of-type(1) {
    opacity: 0;
  }
`;

const Logo = styled(UnstyledLink)``;

const AppLogoWrapper = styled.div`
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;

  :hover {
    ${AppIconImg} {
      :nth-of-type(2) {
        opacity: 0;
      }
      :nth-of-type(1) {
        opacity: 1;
      }
    }
  }
`;

const LeftHero = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 50%;
  height: 0;
  width: 100%;
  border-radius: ${(p) => p.theme.borderRadius.default};
  overflow: hidden;

  @media (max-width: 800px) {
    width: 100%;
    padding-bottom: 70%;
  }
`;

const BannerVideoWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroImg = styled.img`
  width: 90%;
  margin-left: 10%;
  object-position: center;
  object-fit: cover;
  image-rendering: pixelated;
  /* aspect-ratio: 1; */

  @media (max-width: 800px) {
    width: 70%;
    margin-bottom: 20px;
    padding: 0;
  }
`;

const HeroVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ModeBtn = styled(Button)`
  color: ${(p) => p.theme.color.text};
  border-radius: 2rem;
  padding: 0;
  min-width: auto;
  position: relative;
`;

const BannerWrapper = styled.div`
  background: ${(p) => p.theme.color.primary}0a;
`;

const Banner = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  padding: 80px 0;
  margin: 0 auto;
  min-height: 360px;
  justify-content: center;
  align-items: center;
  height: 100%;
  display: grid;
  grid-template-columns: 4fr 6fr;
  gap: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const BannerHeader = styled.h3`
  font-size: 36px;
  margin: 0 0 60px;

  @media (max-width: 800px) {
    margin: 0 0 20px;
  }
`;

const ICON_SIZE = '32px';

const IconWrapper = styled.span<{ $isActive: boolean }>`
  height: ${ICON_SIZE};
  min-height: ${ICON_SIZE};
  width: ${ICON_SIZE};
  min-width: ${ICON_SIZE};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) =>
    p.$isActive ? (p) => p.theme.color.background : (p) => p.theme.color.text};
  z-index: 1;
  transition: 0.2s;
`;

const Puck = styled.div<{ isDarkTheme: boolean }>`
  height: ${ICON_SIZE};
  width: ${ICON_SIZE};
  background: ${(p) => p.theme.color.text};
  position: absolute;
  transition: 0.2s;
  border-radius: 50%;
  /* z-index: -1; */

  ${(p) => (p.isDarkTheme ? 'left: 0;' : `left: ${ICON_SIZE};`)}
`;

const AppIcon = styled.span`
  font-size: 24px;
  margin-right: 4px;
`;

const HomepageWrapper = styled.div`
  margin: 0 8px;
`;

const SecondHeroBtn = styled(Button)`
  margin-left: 8px;

  @media (max-width: 800px) {
    margin-left: 0;
    margin-top: 8px;
  }
`;

const MotionDiv = ({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: any;
}) => (
  <motion.div
    initial={{ opacity: 0, transform: 'translateY(40px)' }}
    whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
    viewport={{ once: true }}
    transition={{ type: 'spring', stiffness: 100, delay }}
    {...(style && { style })}
  >
    {children}
  </motion.div>
);

export const ToggleTheme = (props: any) => {
  const { toggleTheme, isDarkTheme } = useTheme();
  return (
    <ModeBtn secondary onClick={toggleTheme} {...props}>
      <IconWrapper $isActive={isDarkTheme}>
        <Icon name="dark_mode" />
      </IconWrapper>

      <IconWrapper $isActive={!isDarkTheme}>
        <Icon name="light_mode" />
      </IconWrapper>

      <Puck isDarkTheme={isDarkTheme} />
    </ModeBtn>
  );
};

const StartNowBtnText = () => (
  <>
    Start now
    <Icon style={{ marginLeft: '12px' }} name="arrow_forward" />
  </>
);

const PresentationItemGrid = styled.div<{ isLeftImg?: boolean }>`
  display: grid;
  grid-template-columns: ${(p) => (p.isLeftImg ? '1fr 2fr' : '2fr 1fr')};
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 160px auto;
  gap: 100px;

  @media (max-width: 800px) {
    margin: 80px auto;
    gap: 20px;
    display: flex;
    flex-direction: ${(p) => (p.isLeftImg ? 'column' : 'column-reverse')};
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 100px;

  @media (max-width: 800px) {
    margin-bottom: 40px;
    text-align: center;
  }
`;

const PresentationTitle = styled.h3`
  font-size: 36px;
  margin-bottom: 16px;
`;

const PresentationItem = ({
  title,
  content,
  btnText,
  isLeftImg = false,
  img,
  showBtnText = false,
  link,
}: {
  title: ReactNode;
  content: ReactNode;
  btnText: ReactNode;
  isLeftImg?: boolean;
  img: string;
  showBtnText?: boolean;
  link?: string;
}) => {
  const isMobileView = useMediaQuery('(max-width: 800px)');

  return (
    <PresentationItemGrid isLeftImg={isLeftImg}>
      {isLeftImg && (
        <MotionDiv delay={0.2} style={{ textAlign: 'center' }}>
          <FeaturedStoreImg src={img} />
        </MotionDiv>
      )}

      <MotionDiv>
        <ItemWrapper>
          <PresentationTitle>{title}</PresentationTitle>
          <Par>{content}</Par>

          <div>
            {HIDE_APP && !showBtnText ? (
              <UnstyledExternalLink
                href="https://www.producthunt.com/upcoming/chairleader"
                target="_blank"
              >
                <Button icon="launch" fullWidth={isMobileView}>
                  Get early access
                </Button>
              </UnstyledExternalLink>
            ) : (
              <Button to={link ?? routes.auth} fullWidth={isMobileView}>
                {btnText}
              </Button>
            )}
          </div>
        </ItemWrapper>
      </MotionDiv>

      {!isLeftImg && (
        <MotionDiv delay={0.2} style={{ textAlign: 'center' }}>
          <FeaturedStoreImg src={img} />
        </MotionDiv>
      )}
    </PresentationItemGrid>
  );
};

const featuredStore = [
  {
    name: 'Official store',
    subdomain: 'store',
    subText:
      'Visit our official store to get some Chairleader swag and merch 🤙',
    img: 'https://dev-alt-gate-products.s3.amazonaws.com/products/63503ffd1dc49f88ee9b08f3-cc986c65-7004-444b-9812-81675ac912e9.png',
  },
  // {
  //   name: 'Cafe Calypso',
  //   subdomain: 'cafe-calypso',
  //   img: 'https://i.pinimg.com/originals/ee/f8/1e/eef81edc874708984b6420b8c06d2854.gif',
  // },
  // {
  //   name: 'Fast bike shop',
  //   subdomain: 'fast-bike-shop',
  //   img: 'https://media1.giphy.com/media/h4IKOfSsUyeVBepjbk/giphy.gif?cid=6c09b952yo5w4dg65pbdr0o33twzoogdla4edkcebcvewdv2&rid=giphy.gif&ct=s',
  // },
];

const FeaturedStoreImg = styled.img`
  width: 70%;
  aspect-ratio: 1;
  object-position: center;
  object-fit: cover;
  margin: 0 auto;
  border-radius: ${(p) => p.theme.borderRadius.default};
  image-rendering: pixelated;

  @media (max-width: 800px) {
    width: 40%;
  }
`;

const FeatureGroupWrapper = styled(motion.div)`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 8px;
`;

const FeaturedStoresWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 160px auto;
  gap: 20px;

  @media (max-width: 800px) {
    display: flex;
    flex-direction: column-reverse;
    margin: 80px auto;
    text-align: center;

    h4 {
      font-size: 16px;
      margin: 20px 0 8px;
    }

    h3 {
      font-size: 40px;
    }
  }
`;

const FeaturedStoreSubtitle = styled.h4`
  font-size: 20px;
  margin: 0 0 20px;
  font-weight: normal;
  color: ${(p) => p.theme.color.lightText};
`;

const FeaturedStoreTitle = styled.h3`
  font-size: 60px;
  margin: 0 0 8px;
`;

const ArrowBtnsWrapper = styled.div`
  margin-top: 20px;

  button {
    margin-right: 8px;
  }
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StepsExplainedWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 160px auto;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    border: none;
    margin: 120px auto 80px;
  }
`;

const SingleStep = styled.div`
  display: flex;
  /* align-items: center; */
  flex-direction: column;
  border-width: 0 0 0 1px;
  border-style: solid;
  border-color: ${(p) => p.theme.color.lightGrey};
  padding: 0 50px 80px;

  :first-of-type {
    border: none;
  }

  @media (max-width: 800px) {
    border: none;
  }
`;

const StepTitle = styled.div<{ $isDarkTheme: boolean }>`
  font-size: 24px;
  font-weight: bold;

  span {
    /* font-size: 40px; */
    border: 1px solid ${(p) => p.theme.color.lightGrey};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
    border-radius: 50%;

    ${(p) =>
      p.$isDarkTheme &&
      css`
        color: #ff0;
        background: #ff01;
        border-color: #ff0;
      `}
  }
`;

const StepText = styled.p`
  line-height: 1.6;
  /* text-align: center; */
  margin-bottom: 0;
`;

const StepsExplained = () => {
  const { isDarkTheme } = useTheme();

  return (
    <StepsExplainedWrapper>
      <SingleStep>
        <StepTitle $isDarkTheme={isDarkTheme}>
          <span>1</span> Customise a theme
        </StepTitle>
        <StepText>
          Customize your store. No design experience or programming skills
          required.
        </StepText>
      </SingleStep>

      <SingleStep>
        <StepTitle $isDarkTheme={isDarkTheme}>
          <span>2</span> Add products
        </StepTitle>
        <StepText>
          Add your products to the shop. List your eye-catching products with
          the best photos, price and descriptions.
        </StepText>
      </SingleStep>

      <SingleStep>
        <StepTitle $isDarkTheme={isDarkTheme}>
          <span>3</span> Start selling
        </StepTitle>
        <StepText>Set up payments and shipping, and start selling.</StepText>
      </SingleStep>
    </StepsExplainedWrapper>
  );
};

const FeaturedStores = () => {
  const [shopIndex, setShopIndex] = useState(0);

  const currentStore = featuredStore[shopIndex];

  const handleNext = useCallback(() => {
    setShopIndex((shopIndex + 1) % featuredStore.length);
  }, [shopIndex]);

  const storeLink = `${window.location.protocol}//${currentStore.subdomain}.${window.location.host}`;

  return (
    <MotionDiv>
      <FeaturedStoresWrapper>
        <LeftWrapper>
          <div>
            <FeaturedStoreSubtitle>
              Meet the merchants who chose Chairleader
            </FeaturedStoreSubtitle>
            <FeaturedStoreTitle>{currentStore.name}</FeaturedStoreTitle>

            <p>{currentStore.subText}</p>

            <UnstyledExternalLink href={storeLink} target="_blank">
              <Button>
                Visit store{' '}
                <Icon style={{ marginLeft: '4px' }} name="arrow_forward" />
              </Button>
            </UnstyledExternalLink>
          </div>

          {featuredStore.length > 1 && (
            <ArrowBtnsWrapper>
              <Button secondary icon="arrow_back" onClick={handleNext} />
              <Button secondary icon="arrow_forward" onClick={handleNext} />
            </ArrowBtnsWrapper>
          )}
        </LeftWrapper>

        <UnstyledExternalLink href={storeLink} target="_blank">
          <FeaturedStoreImg src={currentStore.img} />
        </UnstyledExternalLink>
      </FeaturedStoresWrapper>
    </MotionDiv>
  );
};

const TopBannerWrapper = styled.div<{
  $color: string;
  $backgroundColor: string;
}>`
  background: #ff0;
  color: ${(p) => p.$color};
  padding: 0 8px;

  button {
    color: ${(p) => p.$color};
    padding: 4px;
    font-size: 16px;
    transition: 0.2s;
    border-radius: ${(p) => p.theme.borderRadius.input};

    :hover {
      background-color: ${(p) => p.$color}22;
    }
  }
`;

const InnerTopBanner = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0px auto 0;
  padding: 4px 0;
  min-height: 32px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TopBanner = ({
  text,
  color,
  backgroundColor,
}: {
  text: ReactNode;
  color: string;
  backgroundColor: string;
}) => {
  const [showBanner, setShowBanner] = useState(true);
  const { pathname } = useLocation();

  if (!showBanner || pathname !== routes.base) {
    return null;
  }
  return (
    <TopBannerWrapper $color={color} $backgroundColor={backgroundColor}>
      <InnerTopBanner>
        <span>{text}</span>
        <UnstyledButton onClick={() => setShowBanner(false)}>
          <Icon name="close" />
        </UnstyledButton>
      </InnerTopBanner>
    </TopBannerWrapper>
  );
};

const BannerBtnText = styled.span``;

const BannerContent = styled.div`
  ${BannerBtnText} {
    margin-right: 4px;
  }

  a {
    color: #000000;
    text-decoration: none;
    background: #00000022;
    padding: 4px 8px;
    transition: 0.2s;
    border-radius: ${(p) => p.theme.borderRadius.input};
    display: inline-flex;
    align-items: center;
    justify-content: center;

    :hover {
      background: #00000033;
    }
  }
`;

const LeftNav = styled.div`
  display: flex;
`;

const NavLink = styled(UnstyledLink)`
  margin-left: 24px;
  display: flex;
  align-items: center;
  border-radius: ${(p) => p.theme.borderRadius.input};
  transition: 0.2s;
  padding: 8px 12px;

  @media (max-width: 800px) {
    display: none;
  }

  :hover {
    background: ${(p) => p.theme.color.text}11;
  }
`;

export const AppLogo = () => (
  <AppLogoWrapper>
    <AppIconImgWrapper>
      <AppIconImg src={appLogoSrcQuickGif} />

      <AppIconImg src={appLogoSrc} />
    </AppIconImgWrapper>
    <span>{APP_NAME}</span>
  </AppLogoWrapper>
);

export const AppLogoLink = () => (
  <Logo to={routes.base}>
    <AppLogo />
  </Logo>
);

export const HomepageTopNav = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const SHOW_AUTH_BTN = !HIDE_APP && !isLoading;

  const SHOW_BANNER = true;

  return (
    <motion.div
      initial={{ opacity: 0, transform: 'translateY(-61px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      {/* Product hunt banner */}
      {/* {SHOW_BANNER && (
        <TopBanner
          text={
            <BannerContent>
              <span>We're live on Product Hunt! 🚀</span>
              <a
                href="https://www.producthunt.com"
                target="_blank"
                rel="noreferrer"
              >
                Check it out
                <Icon style={{ marginLeft: '8px' }} name="arrow_forward" />
              </a>
            </BannerContent>
          }
          color="#000000"
          backgroundColor="#FFFF00"
        />
      )} */}

      {SHOW_BANNER && (
        <TopBanner
          text={
            <BannerContent>
              <span style={{ marginRight: '16px' }}>
                NFT OG giveaway is live! 📢 🚀
              </span>
              <UnstyledLink to={routes.mintNft}>
                <BannerBtnText>Check it out</BannerBtnText>

                <Icon name="arrow_forward" />
              </UnstyledLink>
            </BannerContent>
          }
          color="#000000"
          backgroundColor="#FFFF00"
        />
      )}

      <TopNavWrapper>
        <TopNav>
          <LeftNav>
            <AppLogoLink />
            <NavLink to={routes.pricing}>Pricing</NavLink>
          </LeftNav>

          <BtnWrapper>
            <ToggleTheme style={{ marginRight: '8px' }} />

            {SHOW_AUTH_BTN && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {isAuthenticated() ? (
                  <Button to={routes.admin.inventory} secondary icon="home" />
                ) : (
                  <Button to={routes.auth} secondary>
                    Authenticate
                  </Button>
                )}
              </motion.div>
            )}
          </BtnWrapper>
        </TopNav>
      </TopNavWrapper>
    </motion.div>
  );
};

export const Homepage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobileView = useMediaQuery('(max-width: 800px)');

  const SHOW_BANNER = true;
  const SHOW_MERCHANTS = false;
  const OLD_UI = false;

  return (
    <div>
      <HomepageTopNav />
      <HomepageWrapper>
        <HeroWrapper>
          <LeftHero>
            <MotionDiv delay={0.3}>
              <Header>No-code web3 ecommerce platform</Header>
            </MotionDiv>

            <MotionDiv delay={0.4}>
              <HeroPar>
                We're building the next-generation eCommerce platform that
                offers a variety of web3 services including crypto payments, NFT
                gating, loyalty programs, and much more.
              </HeroPar>
            </MotionDiv>

            <MotionDiv delay={0.5}>
              {HIDE_APP && (
                <div>
                  <UnstyledExternalLink
                    href="https://www.producthunt.com/upcoming/chairleader"
                    target="_blank"
                  >
                    <Button icon="launch" fullWidth={isMobileView}>
                      Get early access
                    </Button>
                  </UnstyledExternalLink>
                </div>
              )}

              {!HIDE_APP && (
                <div>
                  {!isLoading &&
                    (isAuthenticated() ? (
                      <Button
                        to={routes.admin.inventory}
                        fullWidth={isMobileView}
                      >
                        Go to my store
                      </Button>
                    ) : (
                      <>
                        <Button to={routes.auth} fullWidth={isMobileView}>
                          Register now
                        </Button>

                        <SecondHeroBtn
                          to={routes.auth}
                          secondary
                          fullWidth={isMobileView}
                        >
                          Log in
                        </SecondHeroBtn>
                      </>
                    ))}

                  {isLoading && (
                    <div>
                      <Button fullWidth={isMobileView} isLoading={isLoading}>
                        Go to my store
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </MotionDiv>
          </LeftHero>

          <MotionDiv
            style={{ width: isMobileView ? '70%' : '40%' }}
            delay={0.6}
          >
            <HeroImg src={isMobileView ? appLogoSrcGif : appLogoSrcGif} />
          </MotionDiv>
        </HeroWrapper>

        <>
          {SHOW_BANNER && (
            <BannerWrapper>
              <Banner>
                <MotionDiv>
                  <BannerHeader>
                    The most advanced no-code web3 ecommerce platform ever built
                  </BannerHeader>
                </MotionDiv>

                <BannerVideoWrapper>
                  <MotionDiv delay={0.2}>
                    <Video src={videoSrc} poster={videoPosterSrc} />
                  </MotionDiv>
                </BannerVideoWrapper>
              </Banner>
            </BannerWrapper>
          )}

          {OLD_UI && (
            <>
              <PresentationItem
                title="Improve customers engagement with web3"
                content={
                  <>
                    Use token gating, loyalties programs, and NFT memberships to
                    grow your business and brand by unlocking superior customer
                    experience.
                  </>
                }
                btnText={<StartNowBtnText />}
                img={msgSrc}
                isLeftImg
              />

              <PresentationItem
                title="In-app NFTs creation"
                content={
                  <>
                    Chairleader is really easy to use! Create NFTs without
                    coding knowledge and without leaving the app.
                  </>
                }
                btnText={<StartNowBtnText />}
                img={robotSrc}
              />

              <PresentationItem
                title="Add your products, manage your inventory, track your orders"
                content={
                  <>
                    Inventory tracking can help you avoid selling products that
                    have run out of stock, or let you know when you need to
                    order or make more of your product.
                  </>
                }
                btnText={<StartNowBtnText />}
                img={shopSrc}
                isLeftImg
              />

              <PresentationItem
                title="World leader no-code theme customization"
                content={
                  <>
                    Create a store you and your customers will love with our
                    live update theme customization.
                  </>
                }
                btnText={<StartNowBtnText />}
                img={rainbowSrc}
              />

              <PresentationItem
                title="Pay only when you're selling"
                content={
                  <>
                    Access a complete ecommerce platform with simple,
                    pay-as-you-go pricing. 1% fee per transaction.
                  </>
                }
                btnText={<StartNowBtnText />}
                img={graphSrc}
                isLeftImg
              />

              <PresentationItem
                title="Powered by the Solana Network"
                content={
                  <>
                    {`Chairleader's unique data ecosystem reveals opportunities where your business can grow with the `}
                    <a
                      href="https://solana.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Solana network
                    </a>
                    . From accept cryptocurrency payments, NFTs token gating,
                    and many more!
                  </>
                }
                btnText={<StartNowBtnText />}
                img={solanaSrc}
              />

              <PresentationItem
                title="NFT collection giveaway"
                content={
                  <>
                    Join our community to get early access to our NFT collection
                    that will allow all the NFT token collection holders to get
                    50% of all the revenue generated by our platform for a
                    period of 3 months and will give early access to our next
                    NFT collection.
                  </>
                }
                btnText={
                  <>
                    Learn more
                    <Icon style={{ marginLeft: '12px' }} name="arrow_forward" />
                  </>
                }
                img={cupSrc}
                isLeftImg
                showBtnText
                link={routes.mintNft}
              />
            </>
          )}

          {SHOW_MERCHANTS && <FeaturedStores />}
        </>

        <FeatureGroupWrapper>
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
        </FeatureGroupWrapper>

        <StepsExplained />

        <OtpWidget />

        <Footer />
      </HomepageWrapper>
    </div>
  );
};
