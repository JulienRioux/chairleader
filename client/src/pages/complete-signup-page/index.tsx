import { useLazyQuery } from '@apollo/client';
import {
  Button,
  Icon,
  Input,
  message,
  Select,
  VisuallyHiddenInput,
} from 'components-library';
import { Label } from 'components-library/input/input.styles';
import { SHOW_MULTIPLE_CURRENCY } from 'configs';
import { useAuth } from 'hooks/auth';
import { CURRENCY } from 'hooks/currency';
import { Card } from 'pages/admin-pages/invoice-page';
import { HalfImagePageLayout } from 'pages/auth-page';
import { CHECK_IF_SUBODMAIN_IS_AVAILABLE } from 'queries';
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Logger, resizeFileImg, routes, validateSolanaAddress } from 'utils';

const Par = styled.p`
  color: ${(p) => p.theme.color.lightText};
`;

const SaleTaxWrapper = styled.div`
  position: relative;
`;

const CreateWalletLink = styled.a`
  padding-bottom: 20px;
  display: block;
  font-size: 14px;
`;

const PercentIconWrapper = styled.div`
  position: absolute;
  right: 12px;
  z-index: 9;
  bottom: 26px;
  pointer-events: none;
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

const AuthPageWrapper = styled.div`
  margin: 100px auto;
  width: ${(p) => p.theme.layout.mediumWidth};
`;

const CURRENCY_OPTIONS = [
  {
    value: CURRENCY.SOL,
    label: 'SOL',
  },
  {
    value: CURRENCY.USDC,
    label: 'USDC',
  },
];

const isAlphanumeric = (str: string) => str.match(/^[0-9a-z]+$/i);
const isValidSubdomain = (str: string) => str.match(/^[0-9a-z-]+$/i);

export const UpdateUserForm = ({ isCompletingSignup = false }) => {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement | null>(null);

  const { updateUser, updateUserIsLoading, user } = useAuth();

  const [storeName, setStoreName] = useState(user?.storeName ?? '');
  const [subDomain, setSubDomain] = useState(user?.subDomain ?? '');
  const [domainNameError, setDomainNameError] = useState('');
  const [walletAddress, setWalletAddress] = useState(user?.walletAddress ?? '');
  const [walletAddressError, setWalletAddressError] = useState('');
  const [currency, setCurrency] = useState(user?.currency ?? CURRENCY.USDC);
  const [saleTax, setSaleTax] = useState(user?.saleTax ?? '0');

  // Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resizeImgIsLoading, setResizeImgIsLoading] = useState(false);

  let currentImageSrc = user?.image;

  if (imageFile) {
    currentImageSrc = URL.createObjectURL(imageFile);
  }

  const [
    checkIfSubdomainIsAvailable,
    { loading: subdomainAvailabilityIsLoading },
  ] = useLazyQuery(CHECK_IF_SUBODMAIN_IS_AVAILABLE);

  const handleUploadFileClick = useCallback(() => {
    // Click on the visually hidden file input
    if (fileInput?.current) {
      fileInput.current.click();
    }
  }, []);

  const handleChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'storeName') {
      setStoreName(e.target.value);
    }
    if (e.target.name === 'walletAddress') {
      setWalletAddressError('');
      setWalletAddress(e.target.value);
    }

    if (e.target.name === 'domainName') {
      if (e.target.value.length === 1 && !isAlphanumeric(e.target.value)) {
        return;
      }
      const formattedDomainName = e.target.value
        .toLowerCase()
        .replace(' ', '-');
      setDomainNameError('');

      // Prevent double dashes
      if (formattedDomainName.slice(-2) === '--') {
        return;
      }

      if (isValidSubdomain(formattedDomainName) || formattedDomainName === '') {
        setSubDomain(formattedDomainName);
      }
    }
    if (e.target.name === 'currency') {
      setCurrency(e.target.value);
    }
    if (e.target.name === 'saleTax') {
      setSaleTax(e.target.value);
    }
    if (e.target.name === 'image') {
      const files = (e.target as HTMLInputElement)?.files as FileList;
      if (files[0]) {
        // Resize the image and store the image
        setResizeImgIsLoading(true);
        const resizedFile = await resizeFileImg(files[0], 400);
        if (resizedFile) {
          setImageFile(resizedFile);
        }
        setResizeImgIsLoading(false);
      }
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      // Authenticate or update user info
      try {
        const solanaAddressIsValid = await validateSolanaAddress(walletAddress);
        if (!solanaAddressIsValid) {
          setWalletAddressError('Your address is not valid.');
          return;
        }

        // If the subdomain changed, make sure it's available before updating
        if (user?.subDomain !== subDomain) {
          const subdomainIsAvaliableData = await checkIfSubdomainIsAvailable({
            variables: { subdomain: subDomain },
          });
          const subdomainIsAvaliable =
            subdomainIsAvaliableData?.data?.checkIfSubdomainIsAvailable;

          if (!subdomainIsAvaliable) {
            setDomainNameError(`${subDomain} is already taken.`);
            return;
          }
        }

        // Edit user mutation
        await updateUser({
          storeName,
          walletAddress,
          subDomain,
          currency,
          saleTax: Number(saleTax),
          image: imageFile,
        });

        message.success('Your informations have been updated.');

        if (isCompletingSignup) {
          navigate(routes.admin.inventory);
          return;
        }
      } catch (err) {
        message.error('Something went wrong... Please try again.');
        Logger.error(err);
      }
    },
    [
      walletAddress,
      user?.subDomain,
      subDomain,
      updateUser,
      storeName,
      currency,
      saleTax,
      imageFile,
      isCompletingSignup,
      checkIfSubdomainIsAvailable,
      navigate,
    ]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card title="Store settings">
        {!user?.image && (
          <>
            <Label>Store image</Label>
            <ImageWrapper>
              {currentImageSrc ? (
                <Img src={currentImageSrc} />
              ) : (
                <NoImageWrapper>
                  <Icon name="image" />
                </NoImageWrapper>
              )}

              <Button
                type="button"
                secondary
                onClick={handleUploadFileClick}
                isLoading={resizeImgIsLoading}
              >
                {currentImageSrc ? 'Update image' : 'Add image'}
              </Button>

              <VisuallyHiddenInput
                type="file"
                onChange={handleChange}
                name="image"
                accept="image/png, image/jpg, image/jpeg, image/webp"
                ref={fileInput}
              />
            </ImageWrapper>
          </>
        )}

        {!user?.storeName && (
          <Input
            label="Store Name"
            value={storeName}
            onChange={handleChange}
            placeholder="Enter your store name"
            required
            name="storeName"
          />
        )}

        <Input
          label="Subdomain name"
          value={subDomain}
          onChange={handleChange}
          placeholder="Enter your domain name"
          required
          name="domainName"
          error={domainNameError}
        />

        <Input
          label="Email"
          value={user?.email}
          onChange={() => null}
          disabled
        />

        <Input
          label="Solana wallet address"
          value={walletAddress}
          onChange={handleChange}
          placeholder="Enter your Solana wallet address"
          required
          name="walletAddress"
          error={walletAddressError}
        />
        <CreateWalletLink
          href="https://phantom.app"
          target="_blank"
          rel="noreferrer"
        >
          Don't have a Solana wallet? Click to create one <Icon name="launch" />
        </CreateWalletLink>

        {SHOW_MULTIPLE_CURRENCY && (
          <Select
            label="Currency"
            value={currency}
            onChange={handleChange}
            options={CURRENCY_OPTIONS}
            name="currency"
            id="currency"
            placeholder="Select a currency"
            required
          />
        )}

        <SaleTaxWrapper>
          <Input
            label="Sale tax (Percent)"
            value={saleTax}
            onChange={handleChange}
            placeholder="Enter your sale tax percentage"
            required
            name="saleTax"
            type="number"
            max={100}
            min={0}
            step={0.01}
          />
          <PercentIconWrapper>
            <Icon name="percent" />
          </PercentIconWrapper>
        </SaleTaxWrapper>
      </Card>

      <Button
        isLoading={updateUserIsLoading || subdomainAvailabilityIsLoading}
        type="submit"
        fullWidth
        style={{ marginTop: '20px' }}
      >
        Save and continue
      </Button>
    </form>
  );
};

export const CompleteSignupPage = () => {
  const { logoutUser, logoutLoading } = useAuth();

  return (
    <HalfImagePageLayout>
      <AuthPageWrapper>
        <h1>Complete Signup</h1>

        <Par>
          Please fill these informations to help us setting up your Chairleader
          POS.
        </Par>

        <UpdateUserForm isCompletingSignup />

        <Button
          style={{ marginTop: '8px' }}
          secondary
          type="button"
          fullWidth
          onClick={logoutUser}
          isLoading={logoutLoading}
        >
          Cancel registration
        </Button>
      </AuthPageWrapper>
    </HalfImagePageLayout>
  );
};
