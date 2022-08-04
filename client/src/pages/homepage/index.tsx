import { Button, Icon, UnstyledLink } from 'components-library';
import styled from 'styled-components';
import { routes } from 'utils';
import { Footer } from 'components';
import { APP_NAME, APP_LOGO } from 'configs';
import homeVideo from 'assets/home-video-2.mp4';
import { useTheme } from 'hooks/theme';
import { useAuth } from 'hooks/auth';
import { useMediaQuery } from 'hooks/media-query';

const HeroWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0px auto 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Img = styled.img`
  width: 100%;
  border-radius: 32px;
  object-position: center;
  object-fit: cover;
  aspect-ratio: 3 / 4;

  @media (max-width: 800px) {
    max-height: 400px;
  }
`;

const Header = styled.h1`
  font-size: 60px;
  margin-bottom: 20px;

  @media (max-width: 800px) {
    font-size: 48px;
  }
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
  margin-bottom: 100px;

  @media (max-width: 800px) {
    margin-bottom: 100px;
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Video = styled.video`
  width: 100%;
  border-radius: 32px;
  object-fit: cover;
  aspect-ratio: 3 / 4;
  background: ${(p) => p.theme.color.text}11;

  @media (max-width: 800px) {
    aspect-ratio: 5 / 4;
  }
`;

const VideoWrapper = styled.div`
  height: calc(100vh - 61px);
  display: flex;
  align-items: center;

  @media (max-width: 800px) {
    height: auto;
  }
`;

const ModeBtn = styled(Button)`
  color: ${(p) => p.theme.color.text};
  border-radius: 2rem;
  padding: 0;
  min-width: auto;
  position: relative;
`;

const BannerWrapper = styled.div`
  background: ${(p) => p.theme.color.text}07;
`;

const Banner = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  padding: 140px 0;
  margin: 0 auto;
  text-align: center;
`;

const BannerHeader = styled.h3`
  font-size: 60px;
  margin-top: 0;

  @media (max-width: 800px) {
    font-size: 48px;
  }
`;

const ICON_SIZE = '32px';

const IconWrapper = styled.span<{ isActive: boolean }>`
  height: ${ICON_SIZE};
  min-height: ${ICON_SIZE};
  width: ${ICON_SIZE};
  min-width: ${ICON_SIZE};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) =>
    p.isActive ? (p) => p.theme.color.background : (p) => p.theme.color.text};
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
      <IconWrapper isActive={isDarkTheme}>
        <Icon name="dark_mode" />
      </IconWrapper>

      <IconWrapper isActive={!isDarkTheme}>
        <Icon name="light_mode" />
      </IconWrapper>

      <Puck isDarkTheme={isDarkTheme} />
    </ModeBtn>
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
          {!isLoading && (
            <>
              <ToggleTheme style={{ marginRight: '8px' }} />

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
            <Header>The future of payments is now.</Header>
            <Par>
              Unlock your potential with {APP_NAME}. Accept crypto with any
              device, any browser, on the go.
            </Par>

            <div>
              {!isLoading &&
                (isAuthenticated() ? (
                  <Button to={routes.admin.inventory} fullWidth={isMobileView}>
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
          </LeftHero>

          <VideoWrapper>
            <Video autoPlay muted loop>
              <source src={homeVideo} type="video/mp4"></source>
            </Video>
          </VideoWrapper>
        </HeroWrapper>

        <BannerWrapper>
          <Banner>
            <BannerHeader>Make Solana payments easy</BannerHeader>
            <Par>
              {`Optimize conversion by offering seamless crypto payments. Learn
            where and how to expand your business next, supported by insights. ${APP_NAME}’s unique data ecosystem reveals opportunities where your business can grow with the `}
              <a href="https://solana.com/" target="_blank" rel="noreferrer">
                Solana network
              </a>
              .
            </Par>
          </Banner>
        </BannerWrapper>

        <HeroWrapper style={{ margin: '120px auto 60px' }}>
          <Img
            src={
              'https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80'
            }
          />

          <LeftHero>
            <Header>Solutions built for your business model</Header>
            <Par>
              Unlock superior financial experiences through our single platform.
              Simplify cash management, receive payments faster, and gain full
              visibility of your funds leveraged by{' '}
              <a href="https://solanapay.com/" target="_blank" rel="noreferrer">
                Solana Pay
              </a>
              .
            </Par>

            <div>
              <Button to={routes.auth} fullWidth={isMobileView}>
                Start now
              </Button>
            </div>
          </LeftHero>
        </HeroWrapper>

        {/* <FullWidthImg src={homepageImgSrc} /> */}

        <Footer />
      </HomepageWrapper>
    </div>
  );
};
