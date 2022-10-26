import {
  Button,
  Icon,
  UnstyledExternalLink,
  UnstyledLink,
  Video,
} from 'components-library';
import styled, { keyframes } from 'styled-components';
import { routes } from 'utils';
import { Footer } from 'components';
import { APP_NAME, HIDE_APP } from 'configs';
import { useTheme } from 'hooks/theme';
import { useAuth } from 'hooks/auth';
import { useMediaQuery } from 'hooks/media-query';
import { ReactNode, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

import GranyFilter from './granny-filter.svg';
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

const HeroWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0px auto 0;
  min-height: calc(100vh - 61px);
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
  background-image: url(${GranyFilter});
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

const Logo = styled(UnstyledLink)`
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
  width: 50%;

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
  padding-left: 10%;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const BannerHeader = styled.h3`
  font-size: 60px;
  margin: 0 0 60px;

  @media (max-width: 800px) {
    font-size: 48px;
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
    // viewport={{ once: true }}
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

export const HomepageTopNav = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const SHOW_AUTH_BTN = !HIDE_APP && !isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, transform: 'translateY(-61px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      // viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <TopNavWrapper>
        <TopNav>
          <Logo to={routes.base}>
            <AppIconImgWrapper>
              <AppIconImg src={appLogoSrcQuickGif} />

              <AppIconImg src={appLogoSrc} />
            </AppIconImgWrapper>
            {APP_NAME}
          </Logo>

          <BtnWrapper>
            <ToggleTheme style={{ marginRight: '8px' }} />

            {SHOW_AUTH_BTN && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
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

  const SHOW_BANNER = false;
  const SHOW_MERCHANTS = false;

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
            style={{ width: isMobileView ? '70%' : '50%' }}
            delay={0.6}
          >
            <HeroImg src={isMobileView ? appLogoSrcGif : appLogoSrc} />
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

          <PresentationItem
            title="Improve customers engagement with web3"
            content={
              <>
                Use token gating, loyalties programs, and NFTs membership to
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
                Chairleader is really easy to use! Create NFTs without coding
                knowledge and without leaving the app.
              </>
            }
            btnText={<StartNowBtnText />}
            img={robotSrc}
          />

          <PresentationItem
            title="Add your products, manage your inventory, track your orders"
            content={
              <>
                Inventory tracking can help you avoid selling products that have
                run out of stock, or let you know when you need to order or make
                more of your product.
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
                Create a store you and your customers will love with our live
                update theme customization.
              </>
            }
            btnText={<StartNowBtnText />}
            img={rainbowSrc}
          />

          <PresentationItem
            title="Pay only when you're selling"
            content={
              <>
                Access a complete ecommerce platform with simple, pay-as-you-go
                pricing. 1% fee per transaction.
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
                {`${APP_NAME}’s unique data ecosystem reveals opportunities where your business can grow with the `}
                <a href="https://solana.com/" target="_blank" rel="noreferrer">
                  Solana network
                </a>
                . From accept cryptocurrency payments, NFTs token gating, and
                many more!
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
                that will allow all the NFT token collection holders to get 50%
                of all the revenue generated by our platform for a period of 3
                months and will give early access to our next NFT collection.
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

          {SHOW_MERCHANTS && <FeaturedStores />}
        </>

        <Footer />
      </HomepageWrapper>
    </div>
  );
};
