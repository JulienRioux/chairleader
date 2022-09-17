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
import { Label } from 'components-library/input/input.styles';
import { CLUSTER_ENV, Logger, resizeFileImg } from 'utils';
import { NftsList } from 'components/nfts-list';

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

// const getNftsByOwner = async () => {
//   try {
//     console.log('Loading...');

//     const myNfts = await metaplex
//       .nfts()
//       .findAllByOwner({
//         owner: new PublicKey('BJ2L3GBiCiKd7nCdH3zYBzSbvvkiJZ3QjfASrxKhux2Q'),
//       })
//       .run();

//     return myNfts;
//   } catch (err) {
//     console.error(err);
//   }
// };

export const TokenGating = () => {
  const { metaplex } = useMetaplex();
  const wallet = useWallet();
  const { openModal, Modal, closeModal } = useModal();

  const [uploadingNft, setUploadingNft] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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
        const { uri, metadata } = await metaplex
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
          })
          .run();

        const { nft } = await metaplex
          .nfts()
          .create({
            uri,
            name,
            sellerFeeBasisPoints: 500, // Represents 5.00%.
            // isCollection: true,
            // collection: new PublicKey(
            //   'H6ywXv7vqimtRcpHREX3nP78MiHTWQpEC4Rxb7gGHwUW'
            // ),
            maxSupply: toBigNumber(100),
          })
          .run();

        console.log(
          'NFT:',
          `https://solscan.io/account/${nft.address.toString()}?cluster=${CLUSTER_ENV}`
        );
        message.success('Nft created successfully!');
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
    [imageFile, metaplex, name, description, closeModal, resetForm]
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

  return (
    wallet.connected && (
      <div>
        <Button onClick={openModal}>Create NFT</Button>

        <NftsList />

        <Modal title="Configure your NFT">
          <form onSubmit={uploadNFT}>
            <Input
              label="Name"
              onChange={handleChange}
              value={name}
              required
              name="name"
              placeholder="Crypto Punk"
            />

            <Textarea
              label="Description"
              onChange={handleChange}
              value={description}
              required
              name="description"
              placeholder="These NFT will unlocked exclusive products."
            />

            <Label>NFT asset</Label>
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
