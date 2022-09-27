import {
  Button,
  Icon,
  Input,
  Loader,
  message,
  Textarea,
  useModal,
  VisuallyHiddenInput,
} from 'components-library';
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  toBigNumber,
  toMetaplexFileFromBrowser,
} from '@metaplex-foundation/js';
import { useMetaplex } from 'hooks/metaplex';
import styled, { css } from 'styled-components';
import { Label, RequiredWrapper } from 'components-library/input/input.styles';
import { ADMIN_PAYER_ADDRESS, CLUSTER_ENV, Logger, resizeFileImg } from 'utils';
import { NftsList } from 'components/nfts-list';
import { PublicKey } from '@solana/web3.js';
import { useMutation } from '@apollo/client';
import { ADD_NFT } from 'queries';
import { useNft } from 'hooks/nft';

const ImageWrapper = styled.div`
  margin: 8px 0 24px;
  display: flex;
  align-items: flex-end;

  button {
    margin-left: 12px;
  }
`;

const ShareStyles = css`
  height: 200px;
  width: 200px;
  border: ${(p) => p.theme.borderWidth} solid ${(p) => p.theme.color.text};
  border-radius: ${(p) => p.theme.borderRadius.default};
  cursor: pointer;
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

const ServiceFeesExplaination = styled.div`
  margin-bottom: 20px;
  color: ${(p) => p.theme.color.lightText};
  font-size: 14px;
`;

export const TokenGating = () => {
  const { metaplex } = useMetaplex();
  const wallet = useWallet();
  const { openModal, Modal, closeModal } = useModal();
  const { refetchStoreNfts } = useNft();

  const [addNft, { loading: addNftIsLoading }] = useMutation(ADD_NFT);

  const [uploadingNft, setUploadingNft] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxSupply, setMaxSupply] = useState('1000');
  const [price, setPrice] = useState('');

  // Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resizeImgIsLoading, setResizeImgIsLoading] = useState(false);

  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.target.name === 'name') {
        setName(e.target.value);
        return;
      }
      if (e.target.name === 'description') {
        setDescription(e.target.value);
        return;
      }
      if (e.target.name === 'price') {
        setPrice(e.target.value);
        return;
      }
      if (e.target.name === 'maxSupply') {
        setMaxSupply(e.target.value);
        return;
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
        return;
      }
    },
    []
  );

  const resetForm = useCallback(() => {
    setName('');
    setDescription('');
    setImageFile(null);
  }, []);

  const uploadNFT = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!imageFile) {
        message.error('Please add a NFT asset.');
        return;
      }
      if (!metaplex) {
        return;
      }

      try {
        setUploadingNft(true);
        const { uri } = await metaplex
          .nfts()
          .uploadMetadata({
            image: await toMetaplexFileFromBrowser(imageFile),
            name,
            description,
            external_url: 'https://chairleader.xyz/',
            collection: {
              name: 'Testing collections',
              family: 'Chairleader.xyz',
            },
            initialPrice: price,
          })
          .run();

        const { nft } = await metaplex
          .nfts()
          .create({
            uri,
            name,
            maxSupply: toBigNumber(maxSupply),
            sellerFeeBasisPoints: 500, // Represents 5.00%.
            // isCollection: true,
            // collection: new PublicKey(
            //   'H6ywXv7vqimtRcpHREX3nP78MiHTWQpEC4Rxb7gGHwUW'
            // ),
            updateAuthority: ADMIN_PAYER_ADDRESS,
            mintAuthority: ADMIN_PAYER_ADDRESS,
            payer: ADMIN_PAYER_ADDRESS,
            tokenOwner: new PublicKey(
              process.env.REACT_APP_TRANSACTION_PAYEE_PUBLIC_KEY ?? ''
            ),
          })
          .run();

        const newNftAddress = nft.address.toString();

        console.log(
          'NFT ceated:',
          `https://solscan.io/account/${newNftAddress}?cluster=${CLUSTER_ENV}`
        );

        // Add the NFT to our DB
        await addNft({
          variables: { nftAddress: newNftAddress, price: Number(price) },
        });

        message.success(`${name} has been created successfully!`);

        // TODO: This is not working properly...
        refetchStoreNfts();

        setUploadingNft(false);
        closeModal();
        resetForm();
      } catch (err) {
        console.error(err);
        message.error('Something went wrong...');
        Logger.error(err);
        setUploadingNft(false);
      }
    },
    [
      imageFile,
      metaplex,
      name,
      description,
      maxSupply,
      addNft,
      refetchStoreNfts,
      closeModal,
      resetForm,
      price,
    ]
  );

  const handleUploadFileClick = useCallback(() => {
    // Click on the visually hidden file input
    if (fileInput?.current) {
      fileInput.current.click();
    }
  }, []);

  if (wallet.connecting) {
    return <Loader />;
  }

  if (!wallet.connected) {
    return <p>Connect your wallet in order to create NFTs.</p>;
  }

  let currentImageSrc = '';

  if (imageFile) {
    currentImageSrc = URL.createObjectURL(imageFile);
  }

  const SELLING_SERVICE_FEE =
    Number(process.env.REACT_APP_SELLING_NFT_SERVICE_FEE ?? 0) * 100;

  const REVENUE_AFTER_FEES =
    (1 - Number(process.env.REACT_APP_SELLING_NFT_SERVICE_FEE ?? 0)) *
    Number(price);

  return (
    wallet.connected && (
      <div>
        <Button onClick={openModal}>Create new NFT</Button>

        <NftsList />

        <Modal title="Create new NFT">
          <form onSubmit={uploadNFT}>
            <Input
              label="Name"
              onChange={handleChange}
              value={name}
              required
              name="name"
              placeholder="Crypto Punk"
              autoFocus
            />
            <Textarea
              label="Description"
              onChange={handleChange}
              value={description}
              required
              name="description"
              placeholder="These NFT will unlocked exclusive products."
            />
            <Label>
              NFT asset <RequiredWrapper>*</RequiredWrapper>
            </Label>
            <ImageWrapper>
              {currentImageSrc ? (
                <Img src={currentImageSrc} onClick={handleUploadFileClick} />
              ) : (
                <NoImageWrapper onClick={handleUploadFileClick}>
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
            </ImageWrapper>
            <VisuallyHiddenInput
              type="file"
              onChange={handleChange}
              name="image"
              accept="image/png, image/jpg, image/jpeg, image/webp"
              ref={fileInput}
            />
            <Input
              label="Price (USDC)"
              type="number"
              onChange={handleChange}
              value={price}
              required
              name="price"
              placeholder="10"
              min={1}
            />

            {price && (
              <ServiceFeesExplaination>
                <div style={{ marginBottom: '4px' }}>
                  Service fee: {SELLING_SERVICE_FEE} %
                </div>
                <div>You will receive: {REVENUE_AFTER_FEES} USDC</div>
              </ServiceFeesExplaination>
            )}

            <Input
              label="Maximum supply"
              type="number"
              onChange={handleChange}
              value={maxSupply}
              required
              name="maxSupply"
              placeholder="1000"
            />
            <div style={{ marginTop: '20px' }}>
              <Button type="submit" fullWidth isLoading={uploadingNft}>
                Save and continue
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    )
  );
};
