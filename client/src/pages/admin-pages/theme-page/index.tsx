import {
  Button,
  UnstyledButton,
  Input,
  VisuallyHiddenInput,
  Icon,
  message,
  Textarea,
} from 'components-library';
import { Label } from 'components-library/input/input.styles';
import { useAuth } from 'hooks/auth';
import {
  ChangeEvent,
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
  FormEvent,
} from 'react';
import styled, { css } from 'styled-components';
import { encodeImageFileAsURL, Logger, resizeFileImg } from 'utils';
import { Card } from '../invoice-page';
import { PreviewChange } from './preview-change';

const ThemePageWrapper = styled.div`
  /* width: ${(p) => p.theme.layout.mediumWidth}; */
  /* margin: 0 auto; */
  display: flex;
  gap: 20px;
`;

const Form = styled.form`
  width: ${(p) => p.theme.layout.mediumWidth};
  min-width: ${(p) => p.theme.layout.mediumWidth};
`;

const ColorBtns = styled.div`
  display: flex;
  gap: 8px;
`;

const ColorButton = styled(UnstyledButton)<{
  $color: string;
  $isSelected: boolean;
}>`
  height: 24px;
  width: 24px;
  margin: 12px 2px 20px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  transition: 0.2s;

  :hover {
    box-shadow: 0 0 0 2px ${(p) => p.theme.color.background},
      0 0 0 4px ${(p) => p.theme.color.text}44;
  }

  ${(p) =>
    p.$isSelected &&
    css`
      box-shadow: 0 0 0 2px ${p.theme.color.background},
        0 0 0 4px ${p.theme.color.primary} !important;
    `}
`;

const HeroImg = styled.div<{ src?: string }>`
  width: 100%;
  aspect-ratio: 3 / 1;
  margin: 12px 0 20px;
  border-radius: ${(p) => p.theme.borderRadius.default};
  background: ${(p) => p.theme.color.text}11;
  position: relative;

  background-image: url(${(p) => p.src});
  background-size: cover;
  background-position: 50% 50%;

  button {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }
`;

const CardsWrapper = styled.div`
  gap: 20px;
  display: grid;
`;

const ImageWrapper = styled.div`
  margin: 8px 0 24px;
  display: flex;
  align-items: flex-end;

  button {
    margin-left: 12px;
  }
`;

const ShareStyles = css`
  height: 120px;
  width: 120px;
  border: ${(p) => p.theme.borderWidth} solid ${(p) => p.theme.color.lightGrey};
  border-radius: ${(p) => p.theme.borderRadius.default};
`;

const Img = styled.img`
  object-fit: cover;

  ${ShareStyles}
`;

const NoImageWrapper = styled.div`
  ${ShareStyles}
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.color.lightText};
  font-size: 48px;
`;

const colors = [
  { name: 'blue', color: '#0185fe' },
  { name: 'green', color: '#00a481' },
  { name: 'purple', color: '#6F00FF' },
  { name: 'pink', color: '#ff55d3' },
  { name: 'red', color: '#E0282E' },
  { name: 'orange', color: '#F4801A' },
  { name: 'yellow', color: '#F2BD27' },
];

export const ThemePage = () => {
  const { user, updateUser, updateUserIsLoading } = useAuth();

  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [resizeLogoImgIsLoading, setResizeLogoImgIsLoading] = useState(false);

  const logoImgFileInput = useRef<HTMLInputElement | null>(null);

  const handleUploadLogoImgFileClick = useCallback(() => {
    // Click on the visually hidden file input
    if (logoImgFileInput?.current) {
      logoImgFileInput.current.click();
    }
  }, []);

  const [storeName, setStoreName] = useState(user?.storeName ?? '');

  const [themeColor, setThemeColor] = useState(
    user?.theme?.primaryColor ?? colors[0].name
  );

  const [title, setTitle] = useState(user?.homepage?.heroTitle ?? '');
  const [subTitle, setSubTitle] = useState(user?.homepage?.heroSubTitle ?? '');

  const [homepageImageFile, setHomepageImageFile] = useState<File | null>(null);
  const [resizeHomepageImgIsLoading, setResizeHomepageImgIsLoading] =
    useState(false);

  const homepageImageFileInput = useRef<HTMLInputElement | null>(null);

  const handleUploadHomepageImgFileClick = useCallback(() => {
    // Click on the visually hidden file input
    if (homepageImageFileInput?.current) {
      homepageImageFileInput.current.click();
    }
  }, []);

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.target.name === 'storeName') {
        setStoreName(e.target.value);
      }
      if (e.target.name === 'title') {
        setTitle(e.target.value);
      }
      if (e.target.name === 'subTitle') {
        setSubTitle(e.target.value);
      }
      if (e.target.name === 'logoImage') {
        const files = (e.target as HTMLInputElement)?.files as FileList;
        if (files[0]) {
          // Resize the image and store the image
          setResizeLogoImgIsLoading(true);
          const resizedFile = await resizeFileImg(files[0]);
          if (resizedFile) {
            setLogoImageFile(resizedFile);
          }
          setResizeLogoImgIsLoading(false);
        }
      }
      if (e.target.name === 'homepageImage') {
        const files = (e.target as HTMLInputElement)?.files as FileList;
        if (files[0]) {
          // Resize the image and store the image
          setResizeHomepageImgIsLoading(true);
          const resizedFile = await resizeFileImg(files[0]);
          if (resizedFile) {
            setHomepageImageFile(resizedFile);
          }
          setResizeHomepageImgIsLoading(false);
        }
      }
    },
    []
  );

  // Social icons links
  const [instagramLink, setInstagramLink] = useState(
    user?.social?.instagramLink ?? ''
  );
  const [twitterLink, setTwitterLink] = useState(
    user?.social?.twitterLink ?? ''
  );
  const [facebookLink, setFacebookLink] = useState(
    user?.social?.facebookLink ?? ''
  );
  const [tiktokLink, setTiktokLink] = useState(user?.social?.tiktokLink ?? '');
  const [snapchatLink, setSnapchatLink] = useState(
    user?.social?.snapchatLink ?? ''
  );
  const [youtubeLink, setYoutubeLink] = useState(
    user?.social?.youtubeLink ?? ''
  );
  const [spotifyLink, setSpotifyLink] = useState(
    user?.social?.spotifyLink ?? ''
  );
  const [appleMusicLink, setAppleMusicLink] = useState(
    user?.social?.appleMusicLink ?? ''
  );
  const [discordLink, setDiscordLink] = useState(
    user?.social?.discordLink ?? ''
  );

  const handleSocialIconsChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.name === 'instagram') {
        setInstagramLink(e.target.value);
      }
      if (e.target.name === 'twitter') {
        setTwitterLink(e.target.value);
      }
      if (e.target.name === 'facebook') {
        setFacebookLink(e.target.value);
      }
      if (e.target.name === 'tiktok') {
        setTiktokLink(e.target.value);
      }
      if (e.target.name === 'snapchat') {
        setSnapchatLink(e.target.value);
      }
      if (e.target.name === 'youtube') {
        setYoutubeLink(e.target.value);
      }
      if (e.target.name === 'spotify') {
        setSpotifyLink(e.target.value);
      }
      if (e.target.name === 'appleMusic') {
        setAppleMusicLink(e.target.value);
      }
      if (e.target.name === 'discord') {
        setDiscordLink(e.target.value);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        // Edit user mutation
        await updateUser({
          storeName,
          image: logoImageFile,
          theme: { primaryColor: themeColor },
          homepage: {
            heroTitle: title,
            heroSubTitle: subTitle,
          },
          heroImage: homepageImageFile,
          social: {
            instagramLink,
            twitterLink,
            facebookLink,
            tiktokLink,
            snapchatLink,
            youtubeLink,
            spotifyLink,
            appleMusicLink,
            discordLink,
          },
        });
        message.success('Your changes has been saved.');
      } catch (err) {
        Logger.error(err);
        message.error();
      }
    },
    [
      themeColor,
      storeName,
      logoImageFile,
      title,
      subTitle,
      updateUser,
      homepageImageFile,
      instagramLink,
      twitterLink,
      facebookLink,
      tiktokLink,
      snapchatLink,
      youtubeLink,
      spotifyLink,
      appleMusicLink,
      discordLink,
    ]
  );

  const [base64HomepageImg, setBase64HomepageImg] = useState<any>('');
  const [base64LogoImg, setBase64LogoImg] = useState<any>('');

  const handleSetBase64Img = useCallback(async () => {
    if (homepageImageFile) {
      let resizeFileForPreview = homepageImageFile;
      if (resizeFileForPreview.size > 2258) {
        resizeFileForPreview = (await resizeFileImg(
          homepageImageFile,
          180
        )) as File;
      }
      const src = await encodeImageFileAsURL(resizeFileForPreview as File);
      setBase64HomepageImg(`${src}`);
    }
    if (logoImageFile) {
      let resizeFileForPreview = logoImageFile;
      if (logoImageFile.size > 1200) {
        resizeFileForPreview = (await resizeFileImg(logoImageFile, 40)) as File;
      }
      const src = await encodeImageFileAsURL(resizeFileForPreview as File);
      setBase64LogoImg(`${src}`);
    }
  }, [homepageImageFile, logoImageFile]);

  useEffect(() => {
    handleSetBase64Img();
  }, [handleSetBase64Img]);

  const currentLogoImageSrc = useMemo(
    () => (logoImageFile ? URL.createObjectURL(logoImageFile) : user?.image),
    [logoImageFile, user?.image]
  );

  const currentHomepageImageSrc = useMemo(
    () =>
      homepageImageFile
        ? URL.createObjectURL(homepageImageFile)
        : user?.homepage?.heroImage,
    [homepageImageFile, user?.homepage?.heroImage]
  );

  const SHOW_SOCIAL_LINKS = true;

  return (
    <ThemePageWrapper>
      <Form onSubmit={handleSubmit}>
        <CardsWrapper>
          <Card title="Store info">
            <Label>Store image</Label>
            <ImageWrapper>
              {currentLogoImageSrc ? (
                <Img src={currentLogoImageSrc} />
              ) : (
                <NoImageWrapper>
                  <Icon name="image" />
                </NoImageWrapper>
              )}

              <Button
                type="button"
                secondary
                onClick={handleUploadLogoImgFileClick}
                isLoading={resizeLogoImgIsLoading}
              >
                {currentLogoImageSrc ? 'Update image' : 'Add image'}
              </Button>

              <VisuallyHiddenInput
                type="file"
                onChange={handleChange}
                name="logoImage"
                accept="image/png, image/jpg, image/jpeg, image/webp"
                ref={logoImgFileInput}
              />
            </ImageWrapper>

            <Input
              label="Store Name"
              value={storeName}
              onChange={handleChange}
              placeholder="Enter your store name"
              required
              name="storeName"
            />

            <Textarea
              label="Description"
              placeholder="100% organic coffee"
              value={title}
              onChange={handleChange}
              // required
              name="title"
            />

            <Label>Banner image (Aspect ratio 3:1)</Label>
            <HeroImg src={currentHomepageImageSrc}>
              <Button
                secondary
                type="button"
                onClick={handleUploadHomepageImgFileClick}
                isLoading={resizeHomepageImgIsLoading}
              >
                {currentHomepageImageSrc ? 'Update image' : 'Add image'}
              </Button>

              <VisuallyHiddenInput
                type="file"
                onChange={handleChange}
                name="homepageImage"
                accept="image/png, image/jpg, image/jpeg, image/webp"
                ref={homepageImageFileInput}
              />
            </HeroImg>
          </Card>

          <Card title="Styles">
            <Label>Primary color</Label>
            <ColorBtns>
              {colors.map(({ name, color }) => (
                <ColorButton
                  key={name}
                  $color={color}
                  onClick={() => setThemeColor(name)}
                  $isSelected={themeColor === name}
                  type="button"
                />
              ))}
            </ColorBtns>

            <Label>Border radius</Label>
            <div>
              <button>0px</button>
              <button>4px</button>
            </div>
          </Card>

          {/* <Card title="Homepage">
            <Input
              label="Subtitle"
              placeholder="Let's try it out!"
              value={subTitle}
              onChange={handleChange}
              // required
              name="subTitle"
            />
          </Card> */}

          {SHOW_SOCIAL_LINKS && (
            <Card title="Social icons">
              <Input
                label="Instagram URL"
                placeholder="https://www.instagram.com/username"
                name="instagram"
                value={instagramLink}
                onChange={handleSocialIconsChange}
              />

              <Input
                label="Twitter URL"
                placeholder="https://www.twitter.com/username"
                name="twitter"
                value={twitterLink}
                onChange={handleSocialIconsChange}
              />

              <Input
                label="Facebook URL"
                placeholder="https://facebook.com/facebookpageurl"
                name="facebook"
                value={facebookLink}
                onChange={handleSocialIconsChange}
              />

              <Input
                label="Tiktok URL"
                placeholder="https://www.tiktok.com/username"
                name="tiktok"
                value={tiktokLink}
                onChange={handleSocialIconsChange}
              />

              <Input
                label="Snapchat URL"
                placeholder="https://www.snapchat.com/add/username"
                name="snapchat"
                value={snapchatLink}
                onChange={handleSocialIconsChange}
              />

              <Input
                label="Youtube URL"
                placeholder="https://youtube.com/channel/youtubechannelurl"
                name="youtube"
                value={youtubeLink}
                onChange={handleSocialIconsChange}
              />

              <Input
                label="Spotify URL"
                placeholder="https://open.spotify.com/artist/artistname"
                name="spotify"
                value={spotifyLink}
                onChange={handleSocialIconsChange}
              />

              <Input
                label="Apple music URL"
                placeholder="https://music.apple.com/us/album/youralbum"
                name="appleMusic"
                value={appleMusicLink}
                onChange={handleSocialIconsChange}
              />

              <Input
                label="Discord URL"
                placeholder="https://discord.com/invite/servername"
                name="discord"
                value={discordLink}
                onChange={handleSocialIconsChange}
              />
            </Card>
          )}
        </CardsWrapper>

        <div style={{ marginTop: '20px' }}>
          <Button fullWidth type="submit" isLoading={updateUserIsLoading}>
            Save changes
          </Button>
        </div>
      </Form>

      <PreviewChange
        storeName={storeName}
        title={title}
        subTitle={subTitle}
        homepageImgSrc={base64HomepageImg}
        logoImgSrc={base64LogoImg}
        themeColor={themeColor}
      />
    </ThemePageWrapper>
  );
};
