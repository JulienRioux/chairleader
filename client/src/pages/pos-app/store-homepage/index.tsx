import {
  Button,
  InstagramIcon,
  TiktokIcon,
  UnstyledExternalLink,
  TwitterIcon,
  SpotifyIcon,
  FacebookIcon,
  DiscordIcon,
  YoutubeIcon,
  AppleMusicIcon,
  SnapchatIcon,
} from 'components-library';
import { useStore } from 'hooks/store';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from 'utils';
import { InventoryLayout } from '../inventory-layout';
import { slideInBottom } from 'utils/keyframes';

const HomepageWrapper = styled.div`
  margin: 0 0 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100vh - 260px);
`;

const Img = styled.img`
  object-position: center;
  object-fit: cover;
  width: 50%;
  aspect-ratio: 1;
  /* position: absolute; */
  border-radius: ${(p) => p.theme.borderRadius.default};
  background: ${(p) => p.theme.color.text}22;

  image-rendering: pixelated;

  opacity: 0;
  animation: 0.4s ${slideInBottom} 0.1s forwards;

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

  opacity: 0;
  animation: 0.4s ${slideInBottom} forwards;

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

const SocialMediaIconsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const SocialMediaLink = styled(UnstyledExternalLink)`
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px;
  transition: 0.2s;
  border-radius: ${(p) => p.theme.borderRadius.default};

  svg {
    width: 20px;
    fill: ${(p) => p.theme.color.text};
  }

  :hover {
    background: ${(p) => p.theme.color.text}11;
  }
  :active {
    transform: translateY(3px);
  }
`;

type SocialMediaNames =
  | 'instagram'
  | 'tiktok'
  | 'twitter'
  | 'facebook'
  | 'spotify'
  | 'discord'
  | 'youtube'
  | 'appleMusic'
  | 'snapchat';

const SocialIconsMap = {
  instagram: <InstagramIcon />,
  tiktok: <TiktokIcon />,
  twitter: <TwitterIcon />,
  facebook: <FacebookIcon />,
  spotify: <SpotifyIcon />,
  discord: <DiscordIcon />,
  youtube: <YoutubeIcon />,
  appleMusic: <AppleMusicIcon />,
  snapchat: <SnapchatIcon />,
};

interface ISocialMedia {
  name: SocialMediaNames;
  link: string;
}

const SocialMediaIcons = () => {
  const { store } = useStore();

  // Formatting data to display social media icons and links
  const socialMedia = Object.keys(store?.social)
    .map((socialMedia) => {
      const socialMediaLink = store?.social[socialMedia];
      if (!socialMediaLink) return;

      return {
        name: socialMedia.replace('Link', ''),
        link: store?.social[socialMedia],
      };
    })
    .filter((socialMedia) => !!socialMedia) as ISocialMedia[];

  return (
    <SocialMediaIconsWrapper>
      {socialMedia?.map(({ name, link }: { name: string; link: string }) => (
        <SocialMediaLink key={name} href={link} target="_blank">
          {SocialIconsMap[name as SocialMediaNames]}
        </SocialMediaLink>
      ))}
    </SocialMediaIconsWrapper>
  );
};

export const StoreHomepage = () => {
  const { store } = useStore();

  const [title, setTitle] = useState(store?.homepage?.heroTitle);
  const [subTitle, setSubTitle] = useState(store?.homepage?.heroSubTitle);
  const [imgSrc, setImgSrc] = useState(store?.homepage?.heroImage);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const homepageTitle = searchParams.get('homepage_title');
    if (homepageTitle) {
      setTitle(decodeURIComponent(homepageTitle));
    }
    const homepageSubTitle = searchParams.get('homepage_sub_title');
    if (homepageSubTitle) {
      setSubTitle(decodeURIComponent(homepageSubTitle));
    }
    const homepageHeroImg = searchParams.get('homepage_hero_img');
    if (homepageHeroImg) {
      setImgSrc(decodeURIComponent(homepageHeroImg).replaceAll(' ', '+'));
    }
  }, [searchParams]);

  return (
    <InventoryLayout>
      <HomepageWrapper>
        <HeroWrapper>
          <HeroContentWrapper>
            <HeroTitle>{title}</HeroTitle>
            <HeroPar>{subTitle}</HeroPar>

            <BtnWrapper>
              <Button to={routes.store.inventory}>Shop products</Button>
              <Button
                style={{ marginLeft: '8px' }}
                secondary
                to={routes.store.nfts}
              >
                Shop NFTs
              </Button>
            </BtnWrapper>
          </HeroContentWrapper>

          <Img src={imgSrc} />
        </HeroWrapper>

        <SocialMediaIcons />
      </HomepageWrapper>
    </InventoryLayout>
  );
};
