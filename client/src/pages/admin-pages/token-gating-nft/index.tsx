import { useQuery } from '@apollo/client';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Button,
  Icon,
  Loader,
  message,
  UnstyledExternalLink,
  useModal,
} from 'components-library';
import { useAuth } from 'hooks/auth';
import { useCurrency } from 'hooks/currency';
import { useInventory } from 'hooks/inventory';
import { useMetaplex } from 'hooks/metaplex';
import { useNft } from 'hooks/nft';
import { usePrintedNftsEditions } from 'hooks/printed-nfts-editions';
import { useStore } from 'hooks/store';
import { FIND_NFT_BY_ADDRESS } from 'queries';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CLUSTER_ENV,
  formatShortAddress,
  printNewNftEditionWithoutFees,
  getNftMetadata,
  Logger,
  routes,
} from 'utils';
import { ExclusivitiesSelection } from '../exclusitivies-selection';
import { DetailItem } from '../invoice-page';
import { useStoreLink } from '../point-of-sale-page';

import {
  DealItemButton,
  DealPrice,
  DealTitle,
  DealsWrapper,
  Scoller,
  ProductImg,
  TitleWrapper,
  StyledButton,
  TokenGateTypeTitle,
  TokenGatingNftWrapper,
  TokenGatingNftPageWrapper,
  DetailsWrapper,
  Description,
  SolScanLink,
  EditionNumber,
  NftName,
  NftImg,
  RightWrapper,
} from './token-gating.nft.styles';
import { NftOwnerBadge } from 'pages/pos-app/product-page';
import styled from 'styled-components';
import { useSplTokenPayent } from 'hooks/spl-token-payment';
import { useWalletModal } from 'hooks/wallet-modal';

export const NftImgWrapper = styled.div`
  position: relative;
`;

const DealItem = ({
  productId,
  isAdminApp,
}: {
  productId: string;
  isAdminApp: boolean;
}) => {
  const { inventory: adminApp } = useInventory();
  const { user } = useAuth();

  const { inventory: storeApp } = useStore();
  const { currency: storeAppCurrency } = useCurrency();

  const [inventory, currency, linkPath] = isAdminApp
    ? [adminApp, user?.currency, routes.admin.inventory]
    : [storeApp, storeAppCurrency, routes.store.inventory];

  const currentProduct = inventory.find(({ _id }) => _id === productId);

  return (
    <DealItemButton to={`${linkPath}/${productId}`}>
      <ProductImg src={currentProduct?.image} />
      <DealTitle>{currentProduct?.title}</DealTitle>

      <DealPrice>
        {currentProduct?.price} {currency}
      </DealPrice>
    </DealItemButton>
  );
};

const ExclusivitiesCarousel = ({
  productsUnlocked,
  refetchNftByAddress,
  isAdminApp,
}: {
  productsUnlocked?: string[];
  refetchNftByAddress: () => void;
  isAdminApp: boolean;
}) => {
  const { Modal, openModal, closeModal } = useModal();

  return (
    <DealsWrapper>
      <TitleWrapper>
        <TokenGateTypeTitle>
          <Icon name="lock_open" /> Exclusivities unlocked
        </TokenGateTypeTitle>
        {isAdminApp && (
          <StyledButton secondary onClick={openModal}>
            Select exclusivities
          </StyledButton>
        )}
      </TitleWrapper>

      <Scoller>
        {productsUnlocked?.map((productId) => (
          <DealItem
            key={productId}
            productId={productId}
            isAdminApp={isAdminApp}
          />
        ))}
      </Scoller>

      {!productsUnlocked?.length && <p>No exclusivities yet.</p>}

      <Modal title="Select exclusive products" isMaxWidth>
        <ExclusivitiesSelection
          closeModal={closeModal}
          refetchNftByAddress={refetchNftByAddress}
        />
      </Modal>
    </DealsWrapper>
  );
};

export const TokenGatingNft = ({
  isAdminApp = false,
}: {
  isAdminApp?: boolean;
}) => {
  const { openConnectModal } = useWalletModal();
  const { metaplex } = useMetaplex();
  const { address } = useParams();

  const [showAll, setShowAll] = useState(false);

  const { connecting, publicKey } = useWallet();
  const [nftDataIsLoading, setNftDataIsLoading] = useState(false);

  const {
    loading: currentNftIsLoading,
    data: currentNft,
    refetch: refetchNftByAddress,
  } = useQuery(FIND_NFT_BY_ADDRESS, {
    variables: { nftAddress: address },
    notifyOnNetworkStatusChange: true,
  });

  const {
    editionsPrintedList,
    editionsPrintedListIsLoading,
    refreshEditionsPrintedList,
  } = usePrintedNftsEditions(address);

  const {
    refreshUserNfts,
    refreshProductLockedMap,
    updateNft,
    updateNftIsLoading,
    checkIfUserHasPrintedVersion,
  } = useNft();

  const { makePayment } = useSplTokenPayent();

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [royalties, setRoyalties] = useState<any>();
  const [currentSupply, setCurrentSupply] = useState<any>();
  const [maxSupply, setMaxSupply] = useState<any>();
  const [externalUrl, setExternalUrl] = useState('');
  const [price, setPrice] = useState('');

  const [printNftIsLoading, setPrintNftIsLoading] = useState(false);

  const storeLink = useStoreLink();

  const loadNftData = useCallback(async () => {
    if (address) {
      setNftDataIsLoading(true);
      const nft = await getNftMetadata(address);

      setImage(nft?.json?.image ?? '');
      setName(nft?.json?.name ?? '');
      setDescription(nft?.json?.description ?? '');
      setRoyalties(Number(nft?.sellerFeeBasisPoints) / 100 ?? null);
      setExternalUrl(nft?.json?.external_url ?? '');
      setPrice(nft?.json?.initialPrice ?? '');

      if (nft.edition.isOriginal) {
        setMaxSupply(nft.edition.maxSupply);
        setCurrentSupply(nft.edition.supply);
      }
      setNftDataIsLoading(false);
    }
  }, [address, metaplex]);

  const handlePrintNewEdition = useCallback(async () => {
    if (!address) {
      return;
    }

    setPrintNftIsLoading(true);

    const identity = metaplex?.identity();
    const newOwnerPublicKey = identity ? identity.publicKey : null;

    if (!newOwnerPublicKey) {
      return;
    }

    try {
      await makePayment({ amount: Number(price), isNft: true });

      message.success('Payment succeed.');

      await printNewNftEditionWithoutFees({
        originalNftAddress: address,
        newOwnerPublicKey,
      });

      setPrintNftIsLoading(false);

      loadNftData();
      refreshEditionsPrintedList();
      refreshUserNfts();

      refreshProductLockedMap();

      message.success('NFT added successfully.');
    } catch (err) {
      Logger.error(err);
      setPrintNftIsLoading(false);
    }
  }, [
    address,
    metaplex,
    makePayment,
    price,
    loadNftData,
    refreshEditionsPrintedList,
    refreshUserNfts,
    refreshProductLockedMap,
  ]);

  const handleIsArchiveChange = useCallback(async () => {
    await updateNft({
      nftId: currentNft?.findNftByAddress?._id,
      isArchived: !currentNft?.findNftByAddress?.isArchived,
    });
    await refetchNftByAddress();
    message.success('Archive status changed.');
  }, [
    currentNft?.findNftByAddress?._id,
    currentNft?.findNftByAddress?.isArchived,
    refetchNftByAddress,
    updateNft,
  ]);

  useEffect(() => {
    // Load the NFT metadata
    loadNftData();
  }, [loadNftData]);

  if (connecting) {
    return (
      <div>
        <Loader />
        <p style={{ textAlign: 'center' }}>Connecting to wallet</p>
      </div>
    );
  }

  if (nftDataIsLoading) {
    return <Loader />;
  }

  const printedAddresses = showAll
    ? editionsPrintedList
    : editionsPrintedList.slice(0, 5);

  const hasMorePrintedNfts = editionsPrintedList.length > 5;

  const nftIsArchived = currentNft?.findNftByAddress?.isArchived;

  const hasNftPrintedVersion = checkIfUserHasPrintedVersion(address);

  return (
    <TokenGatingNftPageWrapper>
      <div>
        <SolScanLink
          href={`https://solscan.io/token/${address}?cluster=${CLUSTER_ENV}`}
          target="_blank"
        >
          {formatShortAddress(address)}
          <Icon name="launch" style={{ marginLeft: '8px' }} />
        </SolScanLink>
      </div>
      <TokenGatingNftWrapper>
        <DetailsWrapper>
          <NftImgWrapper>
            <NftImg {...(image && { src: image })} />

            {hasNftPrintedVersion && <NftOwnerBadge />}
          </NftImgWrapper>
          <NftName>{name}</NftName>

          <Description>{description}</Description>

          <DetailItem label="Editions">{`${currentSupply} minted of maximum ${maxSupply}`}</DetailItem>

          <DetailItem label="External Link">
            {externalUrl ? (
              <a href={externalUrl} target="_blank" rel="noreferrer">
                {externalUrl}
              </a>
            ) : (
              '-'
            )}
          </DetailItem>

          <DetailItem label="Royalty">{royalties}%</DetailItem>

          <DetailItem label="Price">{price} USDC</DetailItem>

          {isAdminApp && (
            <UnstyledExternalLink
              href={`${storeLink}${routes.store.nfts}/${address}`}
              target="_blank"
            >
              <Button
                fullWidth
                secondary
                style={{ margin: '20px 0' }}
                icon="launch"
              >
                See in store
              </Button>
            </UnstyledExternalLink>
          )}

          {!isAdminApp &&
            (publicKey ? (
              <Button
                fullWidth
                style={{ margin: '20px 0' }}
                onClick={handlePrintNewEdition}
                isLoading={printNftIsLoading}
                disabled={hasNftPrintedVersion}
              >
                {hasNftPrintedVersion ? 'You own this NFT' : 'Buy now'}
              </Button>
            ) : (
              <div>
                <Button icon="lock" fullWidth onClick={openConnectModal}>
                  Connect your wallet to purchase
                </Button>
              </div>
            ))}

          {isAdminApp && (
            <>
              <h4>Printed tokens:</h4>

              {editionsPrintedListIsLoading && <Loader />}

              {!editionsPrintedListIsLoading && (
                <>
                  {printedAddresses.map((printedNftAddress, i) => (
                    <SolScanLink
                      href={`https://solscan.io/token/${printedNftAddress}?cluster=${CLUSTER_ENV}`}
                      target="_blank"
                      key={printedNftAddress}
                      style={{ margin: '0 8px 4px 0' }}
                    >
                      <span>{formatShortAddress(printedNftAddress)}</span>
                      <EditionNumber>
                        (Edition #{i + 1}/{editionsPrintedList.length})
                      </EditionNumber>

                      <Icon name="launch" style={{ marginLeft: '8px' }} />
                    </SolScanLink>
                  ))}

                  {!showAll && hasMorePrintedNfts && (
                    <div>
                      <Button
                        onClick={() => setShowAll(true)}
                        secondary
                        style={{ padding: '4px' }}
                      >
                        Show more
                      </Button>
                    </div>
                  )}

                  {printedAddresses.length === 0 && (
                    <p>No printed token yet.</p>
                  )}
                </>
              )}

              <div style={{ marginTop: '20px' }}>
                <Button
                  fullWidth
                  danger
                  onClick={handleIsArchiveChange}
                  isLoading={updateNftIsLoading}
                >
                  {nftIsArchived ? 'Unarchive NFT' : 'Archive NFT'}
                </Button>
              </div>
            </>
          )}
        </DetailsWrapper>

        <RightWrapper>
          {currentNftIsLoading ? (
            <div>
              <Loader />
              <div style={{ textAlign: 'center' }}>Loading exclusivities</div>
            </div>
          ) : (
            <ExclusivitiesCarousel
              productsUnlocked={currentNft?.findNftByAddress?.productsUnlocked}
              refetchNftByAddress={refetchNftByAddress}
              isAdminApp={isAdminApp}
            />
          )}
        </RightWrapper>
      </TokenGatingNftWrapper>
    </TokenGatingNftPageWrapper>
  );
};
