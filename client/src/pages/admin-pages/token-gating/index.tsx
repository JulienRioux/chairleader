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
import { ADMIN_PAYER_ADDRESS, Logger, resizeFileImg } from 'utils';
import { NftsList } from 'components/nfts-list';
import { PublicKey } from '@solana/web3.js';
import { useMutation } from '@apollo/client';
import { ADD_NFT } from 'queries';
import { useNft } from 'hooks/nft';
import { NFT_ROYALTY, SELLING_NFT_SERVICE_FEE } from 'configs';
import { useWalletModal } from 'hooks/wallet-modal';
import { Alert } from '../product-form';
import { useBalance } from 'hooks/balance';

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
  border: ${(p) => p.theme.borderWidth} solid ${(p) => p.theme.color.text}66;
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

const TokenGatingWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

export const TokenGating = () => {
  const { metaplex } = useMetaplex();
  const wallet = useWallet();
  const { openModal, Modal, closeModal } = useModal();
  const { refetchStoreNfts, storeNfts } = useNft();
  const { openConnectModal } = useWalletModal();
  const { userSolBalance } = useBalance();

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
          const resizedFile = await resizeFileImg(files[0], 800);
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

      if (!userSolBalance) {
        message.error(
          'Please add $SOL in order to pay for the transaction fees of NFT membership creation.',
          6
        );
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
              name: 'Chairleader collections',
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
            sellerFeeBasisPoints: NFT_ROYALTY * 10000, // Represents 1.00%.
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
            confirmOptions: { commitment: 'finalized' },
          })
          .run();

        const newNftAddress = nft.address.toString();

        // Add the NFT to our DB
        await addNft({
          variables: { nftAddress: newNftAddress, price: Number(price) },
        });

        message.success(`${name} has been created successfully!`);

        refetchStoreNfts();

        setUploadingNft(false);
        closeModal();
        resetForm();
      } catch (err) {
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

  const activeNfts = storeNfts?.findNftsByStoreId?.filter(
    ({ isArchived }: { isArchived: boolean }) => !isArchived
  );

  const [showMaxNftReachMsg, setShowMaxNftReachMsg] = useState(false);

  const handleCreateNftModal = useCallback(() => {
    if (activeNfts.length) {
      setShowMaxNftReachMsg(true);
      return;
    }
    openModal();
  }, [openModal, activeNfts]);

  if (wallet.connecting) {
    return <Loader />;
  }

  let currentImageSrc = '';

  if (imageFile) {
    currentImageSrc = URL.createObjectURL(imageFile);
  }

  const REVENUE_AFTER_FEES = (1 - SELLING_NFT_SERVICE_FEE) * Number(price);

  return (
    <TokenGatingWrapper>
      {showMaxNftReachMsg && (
        <Alert>
          You cannot have more than one NFT membership at the time for the
          moment. To create a new one, you need to archive your current one
          first.
        </Alert>
      )}

      {wallet.connected ? (
        <Button onClick={handleCreateNftModal}>Create NFT membership</Button>
      ) : (
        <Button icon="lock" onClick={openConnectModal}>
          Connect wallet to create NFTs
        </Button>
      )}

      <div style={{ margin: '20px 0' }}>
        <NftsList />
      </div>

      <Modal title="Create NFT membership">
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
                Service fee: {SELLING_NFT_SERVICE_FEE} %
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
    </TokenGatingWrapper>
  );
};
