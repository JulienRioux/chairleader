import { Footer } from 'components';
import { Button, UnstyledExternalLink } from 'components-library';
import { HomepageTopNav } from 'pages/homepage';
import styled, { css } from 'styled-components';
import appLogoSrcGif from 'assets/app-logo.gif';
import backgroundGlassSrc from 'assets/background-glass.png';
import { useScrollTop } from 'hooks/scroll-top';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'hooks/media-query';
import background1 from 'pages/features-page/background/background-1.png';

const MintNftPageWrapper = styled(motion.div)`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 8px;
`;

const HeroWrapper = styled.div`
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

const HeroTitle = styled.h1`
  font-size: 60px;
  margin: 0;

  @media (max-width: 800px) {
    font-size: 40px;
  }
`;

const HeroPar = styled.p`
  font-size: 22px;
  color: ${(p) => p.theme.color.lightText};
`;

const HeroImgsWrapper = styled(motion.div)`
  width: 50%;
  position: relative;
  aspect-ratio: 1;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const HeroImg = styled.img`
  position: absolute;
  width: 80%;
  padding: 0 10%;
  object-position: center;
  object-fit: cover;
  image-rendering: pixelated;
  border-radius: ${(p) => p.theme.borderRadius.default};

  @media (max-width: 800px) {
    width: 70%;
    left: 15%;
    padding: 0;
  }
`;

const BackgroundGlass = styled.img`
  position: absolute;
  width: 80%;
  margin: 10%;
  height: 80%;

  @media (max-width: 800px) {
    width: 80%;
    left: 10%;
    margin: 0;
  }
`;

const HeroTextWrapper = styled(motion.div)`
  width: 50%;

  @media (max-width: 800px) {
    width: calc(100% - 16px);
  }
`;

const Par = styled.p`
  line-height: 1.8;
  font-size: 18px;
  color: ${(p) => p.theme.color.lightText};
`;

const BannerWrapper = styled(motion.div)`
  padding: 20px 8px;
  background-image: url(${background1});
  background-size: cover;
  background-position: 50% 50%;

  color: ${(p) => p.theme.color.black};
`;

const DataBanner = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto 0;
  padding: 20px 0;
  min-height: 200px;
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  text-align: center;

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
    padding: 0 8px;
  }
`;

const JoinOurCommunityWrapper = styled(motion.div)`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 140px auto;
  padding: 0 8px;
`;

const JoinOurCommunityTitle = styled.h3`
  font-size: 40px;
`;

const HowToMintTitle = styled.h3`
  font-size: 40px;
  margin-bottom: 0;
`;

const HowItWorksTitle = styled.h3`
  font-size: 40px;
`;

const HowItWorksWrapper = styled.div`
  margin: 80px 0 40px;
`;

const BannerTopText = styled.div`
  font-weight: bold;
  font-size: 36px;
`;

const BannerBottomText = styled.div`
  font-size: 20px;
  margin-top: 8px;
  line-height: 1.4;

  @media (max-width: 800px) {
    font-size: 16px;
  }
`;

const BannerContentWrapper = styled(motion.div)<{ $hasBackground?: boolean }>`
  display: flex;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${(p) => p.theme.borderRadius.default};
  ${(p) =>
    !p.$hasBackground &&
    css`
      background: ${p.theme.color.primary}11;
      color: ${p.theme.color.primary};
      border: 1px solid ${p.theme.color.primary};
    `}
`;

const FollowOnTwitterLink = styled(UnstyledExternalLink)`
  margin-left: 8px;

  @media (max-width: 800px) {
    margin-left: 0;

    button {
      margin-top: 8px;
    }
  }
`;

const BannerContent = ({
  topText,
  bottomText,
  hasBackground,
  delay = 0,
}: {
  topText: string;
  bottomText: string;
  hasBackground?: boolean;
  delay?: number;
}) => (
  <BannerContentWrapper
    $hasBackground={hasBackground}
    initial={{ opacity: 0, transform: 'translateY(40px)' }}
    whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
    transition={{ type: 'spring', stiffness: 100, delay: delay }}
  >
    <BannerTopText>{topText}</BannerTopText>
    <BannerBottomText>{bottomText}</BannerBottomText>
  </BannerContentWrapper>
);

export const MintNftPage = () => {
  useScrollTop();

  const isMobileView = useMediaQuery('(max-width: 800px)');

  return (
    <div>
      <HomepageTopNav />

      <MintNftPageWrapper>
        <HeroWrapper>
          <HeroTextWrapper
            initial={{ opacity: 0, transform: 'translateY(40px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
          >
            <HeroTitle>
              Chairleader V1
              <br /> NFT collection
            </HeroTitle>
            <HeroPar>Join our community to get early access 🚀</HeroPar>
            <UnstyledExternalLink href="https://discord.gg/sbTcWHkKBN">
              <Button icon="launch" fullWidth={isMobileView}>
                Join on Discord
              </Button>
            </UnstyledExternalLink>

            <FollowOnTwitterLink href="https://twitter.com/chairleader_app">
              <Button secondary icon="launch" fullWidth={isMobileView}>
                Follow on Twitter
              </Button>
            </FollowOnTwitterLink>
          </HeroTextWrapper>

          <HeroImgsWrapper
            initial={{ opacity: 0, transform: 'translateY(40px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
          >
            <BackgroundGlass src={backgroundGlassSrc} />
            <HeroImg src={appLogoSrcGif} />
          </HeroImgsWrapper>
        </HeroWrapper>
      </MintNftPageWrapper>

      <BannerWrapper
        initial={{ opacity: 0, transform: 'translateY(40px)' }}
        whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <DataBanner>
          <BannerContent
            hasBackground
            topText="1000"
            bottomText="Total NFTs available"
          />
          <BannerContent
            hasBackground
            topText="50%"
            bottomText="Platform revenue redistribution"
            delay={0.1}
          />
          <BannerContent
            hasBackground
            topText="3 months"
            bottomText="Revenue redistribution period"
            delay={0.2}
          />
          <BannerContent
            hasBackground
            topText="1.5 SOL"
            bottomText="Price per NFT"
            delay={0.3}
          />
        </DataBanner>
      </BannerWrapper>

      <MintNftPageWrapper
        initial={{ opacity: 0, transform: 'translateY(40px)' }}
        whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <HowItWorksWrapper>
          <HowItWorksTitle>How it works?</HowItWorksTitle>
          <Par>
            Chairleader is the next-generation no-code web3 e-commerce platform.
            We allow our merchants to sell products and NFTs without any coding
            skills. We offer web3 payments and in-app NFT creation, NFT selling,
            and NFT token-gating services.
          </Par>
          <Par>
            Our V1 NFT collection will allow all the NFT token collection
            holders to get 50% of all the revenue generated by our platform for
            a period of 3 months and will give early access to our next NFT
            collection. At the end of the 3 months period, we will take 50% off
            our revenue and share it equally with every NFT V1 collection
            holder.
          </Par>
          <Par>
            We're excited to create a new utility that has never been used in
            the NFT space and we hope you're as excited as we are! 🎉
          </Par>
        </HowItWorksWrapper>
      </MintNftPageWrapper>

      {/* <HowToMintTitle>How to mint?</HowToMintTitle> */}
      {/* <DataBanner>
        <BannerContent topText="1" bottomText="Connect Your Wallet" />
        <BannerContent topText="2" bottomText="Select Your Quantity" />
        <BannerContent topText="3" bottomText="Confirm the Transaction" />
        <BannerContent topText="4" bottomText="Receive Your NFTs" />
      </DataBanner> */}

      <DataBanner>
        <BannerContent
          topText="1"
          bottomText="Join our community to get early access"
        />

        <BannerContent
          topText="2"
          bottomText="Token minting period"
          delay={0.1}
        />
        <BannerContent
          topText="3"
          bottomText="Chairleader generating revenue for 3 months"
          delay={0.2}
        />
        <BannerContent
          topText="4"
          bottomText="Equal revenue distribution to NFTs holders"
          delay={0.3}
        />
      </DataBanner>

      <MintNftPageWrapper
        initial={{ opacity: 0, transform: 'translateY(40px)' }}
        whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <HowItWorksWrapper>
          <HowItWorksTitle>
            What about the revenue generated by the mint?
          </HowItWorksTitle>
          <Par>
            The revenue generated by the mint will be used to promote our
            community and to promote the use of the Chairleader eCommerce
            platform. Furthermore, we will continue to add features that will
            bring more stores to our platform; increasing at the same way the
            revenue generated by Chairleader and the revenue earned by the NFTs
            holders.
          </Par>
        </HowItWorksWrapper>
      </MintNftPageWrapper>

      <JoinOurCommunityWrapper
        initial={{ opacity: 0, transform: 'translateY(40px)' }}
        whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <JoinOurCommunityTitle>
          Join our community and get early access
        </JoinOurCommunityTitle>

        <div>
          <UnstyledExternalLink href="https://discord.gg/sbTcWHkKBN">
            <Button icon="launch" fullWidth={isMobileView}>
              Join on Discord
            </Button>
          </UnstyledExternalLink>
          <FollowOnTwitterLink href="https://twitter.com/chairleader_app">
            <Button icon="launch" secondary fullWidth={isMobileView}>
              Follow on Twitter
            </Button>
          </FollowOnTwitterLink>
        </div>
      </JoinOurCommunityWrapper>

      <Footer />
    </div>
  );
};
