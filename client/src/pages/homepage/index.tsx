import {
  Button,
  Icon,
  UnstyledExternalLink,
  UnstyledLink,
} from 'components-library';
import styled, { keyframes } from 'styled-components';
import { routes } from 'utils';
import { Footer } from 'components';
import { APP_NAME, APP_LOGO, HIDE_APP } from 'configs';
import { useTheme } from 'hooks/theme';
import { useAuth } from 'hooks/auth';
import { useMediaQuery } from 'hooks/media-query';
import { ReactNode, useCallback, useState } from 'react';
import GranyFilter from './granny-filter.svg';
import videoSrc from 'assets/homepage-video.mp4';

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

const Logo = styled(UnstyledLink)`
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
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
  width: 50%;
  border-radius: ${(p) => p.theme.borderRadius.default};
  overflow: hidden;

  @media (max-width: 800px) {
    width: 100%;
    padding-bottom: 70%;
  }
`;

const Video = styled.video`
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
  padding: 40px 0;
  margin: 0 auto;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* text-align: center; */
`;

const BannerHeader = styled.h3`
  font-size: 60px;
  margin: 0 0 20px;

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

const PresentationItemGrid = styled.div<{ isLeftImg?: boolean }>`
  display: grid;
  grid-template-columns: ${(p) => (p.isLeftImg ? '1fr 2fr' : '2fr 1fr')};
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 160px auto;
  gap: 100px;

  @media (max-width: 800px) {
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
    margin-bottom: 100px;
  }
`;

const PresentationItem = ({
  title,
  content,
  btnText,
  isLeftImg = false,
  img,
}: {
  title: ReactNode;
  content: ReactNode;
  btnText: ReactNode;
  isLeftImg?: boolean;
  img: string;
}) => {
  const isMobileView = useMediaQuery('(max-width: 800px)');

  return (
    <PresentationItemGrid isLeftImg={isLeftImg}>
      {isLeftImg && <FeaturedStoreImg src={img} />}

      <ItemWrapper>
        <h1>{title}</h1>
        <Par>{content}</Par>

        <div>
          <Button to={routes.auth} fullWidth={isMobileView}>
            {btnText}
          </Button>
        </div>
      </ItemWrapper>

      {!isLeftImg && <FeaturedStoreImg src={img} />}
    </PresentationItemGrid>
  );
};

const featuredStore = [
  {
    name: 'Cafe Calypso',
    subdomain: 'cafe-calypso',
    img: 'https://dev-alt-gate-products.s3.amazonaws.com/products/62f40aa40c9249b03d773ec0-5ab8bc6c-3e2b-457c-87ef-e59239fde25b.webp',
  },
  {
    name: 'Fast bike shop',
    subdomain: 'fast-bike-shop',
    img: 'https://bicyclespeedshop.co/wp-content/themes/bss/img/bike-rider.gif',
  },
];

const FeaturedStoreImg = styled.img`
  width: 100%;
  border-radius: 32px;
  aspect-ratio: 1;
  object-position: center;
  object-fit: cover;
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
`;

const FeaturedStoreTitle = styled.h3`
  font-size: 60px;
  margin: 0 0 32px;
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
    <FeaturedStoresWrapper>
      <LeftWrapper>
        <div>
          <FeaturedStoreSubtitle>
            Meet the merchants who chose Chairleader
          </FeaturedStoreSubtitle>
          <FeaturedStoreTitle>{currentStore.name}</FeaturedStoreTitle>
          <UnstyledExternalLink href={storeLink} target="_blank">
            <Button>
              Visit store{' '}
              <Icon style={{ marginLeft: '4px' }} name="arrow_forward" />
            </Button>
          </UnstyledExternalLink>
        </div>

        <ArrowBtnsWrapper>
          <Button secondary icon="arrow_back" onClick={handleNext} />
          <Button secondary icon="arrow_forward" onClick={handleNext} />
        </ArrowBtnsWrapper>
      </LeftWrapper>

      <UnstyledExternalLink href={storeLink} target="_blank">
        <FeaturedStoreImg src={currentStore.img} />
      </UnstyledExternalLink>
    </FeaturedStoresWrapper>
  );
};

export const HomepageTopNav = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <TopNavWrapper>
      <TopNav>
        <Logo to={routes.base}>
          <AppIcon>{APP_LOGO}</AppIcon>
          {APP_NAME}
        </Logo>

        <BtnWrapper>
          <ToggleTheme style={{ marginRight: '8px' }} />

          {!HIDE_APP && !isLoading && (
            <>
              {isAuthenticated() ? (
                <Button to={routes.admin.inventory} secondary icon="home" />
              ) : (
                <Button to={routes.auth} secondary>
                  Authenticate
                </Button>
              )}
            </>
          )}
        </BtnWrapper>
      </TopNav>
    </TopNavWrapper>
  );
};

export const Homepage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobileView = useMediaQuery('(max-width: 800px)');

  return (
    <div>
      <HomepageTopNav />
      <HomepageWrapper>
        <HeroWrapper>
          <LeftHero>
            <Header>
              No-code web3{' '}
              <span style={{ whiteSpace: 'nowrap' }}>e-commerce</span> platform
            </Header>
            <HeroPar>
              We are building the next-generation e-commerce platform offering
              online retailers a suite of web3 services including payments,
              marketing, and engagement tools built on top of Solana.
            </HeroPar>

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
          </LeftHero>

          <VideoWrapper>
            <Video autoPlay muted loop>
              <source src={videoSrc} type="video/mp4" />
            </Video>
          </VideoWrapper>
        </HeroWrapper>

        {!HIDE_APP && (
          <>
            <BannerWrapper>
              <Banner>
                <BannerHeader>Make Solana payments easy</BannerHeader>
                <Par>
                  {`Optimize conversion by offering seamless crypto payments. Learn
            where and how to expand your business next, supported by insights. ${APP_NAME}’s unique data ecosystem reveals opportunities where your business can grow with the `}
                  <a
                    href="https://solana.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Solana network
                  </a>
                  .
                </Par>
              </Banner>
            </BannerWrapper>

            <FeaturedStores />

            <PresentationItem
              title="Solutions built for your business model"
              content={
                <>
                  Unlock superior financial experiences through our single
                  platform. Simplify cash management, receive payments faster,
                  and gain full visibility of your funds leveraged by{' '}
                  <a
                    href="https://solanapay.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Solana Pay
                  </a>
                  .
                </>
              }
              btnText={
                <>
                  Start now{' '}
                  <Icon style={{ marginLeft: '4px' }} name="arrow_forward" />
                </>
              }
              img="https://images.unsplash.com/photo-1462392246754-28dfa2df8e6b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2400&q=80"
              isLeftImg
            />

            <PresentationItem
              title="Another title"
              content={
                <>
                  Unlock superior financial experiences through our single
                  platform. Simplify cash management, receive payments faster,
                  and gain full visibility of your funds leveraged by{' '}
                  <a
                    href="https://solanapay.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Solana Pay
                  </a>
                  .
                </>
              }
              btnText={
                <>
                  Start now{' '}
                  <Icon style={{ marginLeft: '4px' }} name="arrow_forward" />
                </>
              }
              img="https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80"
            />
          </>
        )}

        <Footer />
      </HomepageWrapper>
    </div>
  );
};
