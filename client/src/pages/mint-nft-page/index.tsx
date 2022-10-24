import { Footer } from 'components';
import { Button, UnstyledExternalLink } from 'components-library';
import { HomepageTopNav } from 'pages/homepage';
import styled from 'styled-components';
// import appLogoSrcGif from 'assets/mint-nft.png';
import appLogoSrcGif from 'assets/background-test.png';
import { useScrollTop } from 'hooks/scroll-top';
import { motion } from 'framer-motion';

const MintNftPageWrapper = styled(motion.div)`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 8px;
`;

const HeroWrapper = styled(motion.div)`
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
  font-size: 20px;
  color: ${(p) => p.theme.color.lightText};
`;

const HeroImg = styled.img`
  width: 40%;
  padding: 0 5%;
  object-position: center;
  object-fit: cover;
  image-rendering: pixelated;
  border-radius: ${(p) => p.theme.borderRadius.default};

  @media (max-width: 800px) {
    width: 50%;
    margin-bottom: 20px;
  }
`;

const HeroTextWrapper = styled.div`
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
  background: ${(p) => p.theme.color.primary}11;
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
  text-align: center;
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

  color: ${(p) => p.theme.color.lightText};
`;

const BannerContentWrapper = styled.div<{ hasBackground?: boolean }>`
  display: flex;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${(p) => p.theme.borderRadius.default};
  ${(p) => !p.hasBackground && `background: ${p.theme.color.text}08;`}
`;

const BannerContent = ({
  topText,
  bottomText,
  hasBackground,
}: {
  topText: string;
  bottomText: string;
  hasBackground?: boolean;
}) => (
  <BannerContentWrapper hasBackground={hasBackground}>
    <BannerTopText>{topText}</BannerTopText>
    <BannerBottomText>{bottomText}</BannerBottomText>
  </BannerContentWrapper>
);

export const MintNftPage = () => {
  useScrollTop();

  return (
    <div>
      <HomepageTopNav />

      <MintNftPageWrapper>
        <HeroWrapper
          initial={{ opacity: 0, transform: 'translateY(40px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        >
          <HeroTextWrapper>
            <HeroTitle>
              Chairleader V1
              <br /> NFT collection
            </HeroTitle>
            <HeroPar>Join our community to get early access 🚀</HeroPar>
            <UnstyledExternalLink href="https://discord.gg/Men7Amz3vq">
              <Button icon="launch">Join Discord</Button>
            </UnstyledExternalLink>

            <UnstyledExternalLink
              href="https://twitter.com/chairleader_app"
              style={{ marginLeft: '8px' }}
            >
              <Button secondary icon="launch">
                Follow on Twitter
              </Button>
            </UnstyledExternalLink>
          </HeroTextWrapper>

          <HeroImg src={appLogoSrcGif} />
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
            bottomText="Total items available"
          />
          <BannerContent
            hasBackground
            topText="50%"
            bottomText="Platform revenue redistribution"
          />
          <BannerContent
            hasBackground
            topText="3 months"
            bottomText="Revenue redistribution period"
          />
          <BannerContent
            hasBackground
            topText="1 SOL"
            bottomText="Price per NFT"
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
            collection. At the end of the 3 months period, we will take 50% of
            our revenue and share it equally with every NFT V1 collection
            holder.
          </Par>
          <Par>
            We're excited to create a new utility that has never been used in
            the NFT space and we hope you're as excited as we are! 🎉
          </Par>
        </HowItWorksWrapper>

        {/* <HowToMintTitle>How to mint?</HowToMintTitle> */}
      </MintNftPageWrapper>

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

        <BannerContent topText="2" bottomText="Token minting period" />
        <BannerContent
          topText="3"
          bottomText="Chairleader generating revenue for 3 months"
        />
        <BannerContent
          topText="4"
          bottomText="Equal revenue distribution to NFTs holders"
        />
      </DataBanner>

      <JoinOurCommunityWrapper
        initial={{ opacity: 0, transform: 'translateY(40px)' }}
        whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <JoinOurCommunityTitle>
          Join our community and get early access
        </JoinOurCommunityTitle>

        <div>
          <UnstyledExternalLink href="https://discord.gg/Men7Amz3vq">
            <Button icon="launch">Join Discord</Button>
          </UnstyledExternalLink>
          <UnstyledExternalLink
            href="https://twitter.com/chairleader_app"
            style={{ marginLeft: '8px' }}
          >
            <Button icon="launch">Follow on Twitter</Button>
          </UnstyledExternalLink>
        </div>
      </JoinOurCommunityWrapper>

      <Footer />
    </div>
  );
};
