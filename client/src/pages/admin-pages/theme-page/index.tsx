import {
  Button,
  UnstyledButton,
  Input,
  VisuallyHiddenInput,
  Icon,
  message,
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
  height: 40px;
  width: 40px;
  margin: 12px 0 20px;
  border-radius: ${(p) => p.theme.borderRadius.default};
  background: ${(p) => p.$color};
  transition: 0.2s;

  ${(p) =>
    p.$isSelected &&
    css`
      box-shadow: 0 0 0 2px ${p.theme.color.background},
        0 0 0 4px ${p.theme.color.primary};
    `}
`;

const HeroImg = styled.div<{ src?: string }>`
  width: 100%;
  aspect-ratio: 4 / 3;
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

  console.log('=>>>', user?.homepage);

  const [title, setTitle] = useState(user?.homepage?.heroTitle ?? '');
  const [subTitle, setSubTitle] = useState(user?.homepage?.heroSubTitle ?? '');

  const [imageSrc, setImageSrc] = useState(
    'https://images.squarespace-cdn.com/content/v1/54f775e2e4b07edc19ac338f/1585420060107-NSVI5AGYCZ27S1DG976T/image-asset.jpeg?format=1500w'
  );
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

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        // Edit user mutation
        await updateUser({
          storeName,
          image: logoImageFile,
          theme: { primaryColor: themeColor },
          homepage: { heroTitle: title, heroSubTitle: subTitle },
        });
        message.success('Your changes has been saved.');
      } catch (err) {
        Logger.error(err);
        message.error();
      }
      //
      console.log('Saving changes...');
      console.log(user);
      console.log(
        'WTF',
        themeColor,
        storeName,
        logoImageFile,
        title,
        subTitle,
        homepageImageFile
      );
    },
    [
      user,
      themeColor,
      storeName,
      logoImageFile,
      title,
      subTitle,
      homepageImageFile,
      updateUser,
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
    () => (logoImageFile ? URL.createObjectURL(logoImageFile) : user.image),
    [logoImageFile, user.image]
  );

  const currentHomepageImageSrc = useMemo(
    () =>
      homepageImageFile ? URL.createObjectURL(homepageImageFile) : imageSrc,
    [homepageImageFile, imageSrc]
  );

  const SHOW_SOCIAL_LINKS = true;

  return (
    <ThemePageWrapper>
      <Form onSubmit={handleSubmit}>
        <CardsWrapper>
          <Card title="Logo">
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
          </Card>

          <Card title="Colors">
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
          </Card>

          <Card title="Homepage">
            <Label>Image</Label>
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

            <Input
              label="Title"
              placeholder="100% organic coffee"
              value={title}
              onChange={handleChange}
              // required
              name="title"
            />

            <Input
              label="Subtitle"
              placeholder="Let's try it out!"
              value={subTitle}
              onChange={handleChange}
              // required
              name="subTitle"
            />
          </Card>

          {SHOW_SOCIAL_LINKS && (
            <Card title="Social media links">
              <Input
                label="Instagram URL"
                placeholder="https://www.instagram.com/username"
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                label="Twitter URL"
                placeholder="https://www.twitter.com/username"
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                label="Facebook URL"
                placeholder="https://facebook.com/facebookpageurl"
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                label="Tiktok URL"
                placeholder="https://www.tiktok.com/username"
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                label="Youtube URL"
                placeholder="https://youtube.com/channel/youtubechannelurl"
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                label="Spotify URL"
                placeholder="https://open.spotify.com/artist/artistname"
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                label="Apple music URL"
                placeholder="https://music.apple.com/us/album/youralbum"
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
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
