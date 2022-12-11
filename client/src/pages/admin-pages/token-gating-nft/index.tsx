import { useMutation, useQuery } from '@apollo/client';
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
import { FIND_NFT_BY_ADDRESS, SAVE_TRANSACTION_INVOICE } from 'queries';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CLUSTER_ENV,
  formatShortAddress,
  printNewNftEditionWithoutFees,
  getNftMetadata,
  Logger,
  routes,
  getProductVariantsLowestPrice,
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
  NoImageProduct,
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
  DealWrapper,
  RewardWrapper,
  RewardBanner,
  RewardTitle,
  RewardDescription,
  IconWrapper,
} from './token-gating.nft.styles';
import { NftOwnerBadge } from 'pages/pos-app/product-page';
import styled from 'styled-components';
import { useSplTokenPayent } from 'hooks/spl-token-payment';
import { useWalletModal } from 'hooks/wallet-modal';
import { RewardsSelection } from '../rewards-selection';
import { useBalance } from 'hooks/balance';

export const NftImgWrapper = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const NftInfoWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const DealItem = ({
  productId,
  isAdminApp,
}: {
  productId: string;
  isAdminApp: boolean;
}) => {
  const { inventory: adminApp } = useInventory();
  const { user, currencyDecimals } = useAuth();
  const { decimals } = useCurrency();

  const { inventory: storeApp } = useStore();
  const { currency: storeAppCurrency } = useCurrency();

  const [inventory, currency, linkPath] = isAdminApp
    ? [adminApp, user?.currency, routes.admin.inventory]
    : [storeApp, storeAppCurrency, routes.store.inventory];

  const currentProduct = inventory.find(({ _id }) => _id === productId);

  const { productPrice, hasMultiplePrice } = getProductVariantsLowestPrice({
    allPossibleVariantsObject: currentProduct?.allPossibleVariantsObject,
    price: currentProduct?.price?.toString() ?? '',
    productType: currentProduct?.productType ?? '',
  });

  const priceDisplay = Number(
    Number(productPrice)?.toFixed(!isAdminApp ? decimals : currencyDecimals)
  );

  const priceDisplayString = `${
    hasMultiplePrice ? 'From ' : ''
  } ${priceDisplay}`;

  return (
    <DealItemButton to={`${linkPath}/${productId}`}>
      {currentProduct?.image ? (
        <ProductImg src={currentProduct?.image} />
      ) : (
        <NoImageProduct>
          <Icon name="image" />
        </NoImageProduct>
      )}
      <DealTitle>{currentProduct?.title}</DealTitle>

      <DealPrice>
        {priceDisplayString} {currency}
      </DealPrice>
    </DealItemButton>
  );
};

const ExclusivitiesCarousel = ({
  productsUnlocked,
  refetchNftByAddress,
  rewardsUnlocked,
  isAdminApp,
}: {
  productsUnlocked?: string[];
  rewardsUnlocked?: any[];
  refetchNftByAddress: () => void;
  isAdminApp: boolean;
}) => {
  const {
    Modal: ExclusivitiesModal,
    openModal: openExclusivitiesModal,
    closeModal: closeExclusivitiesModal,
  } = useModal();
  const {
    Modal: RewardsModal,
    openModal: openRewardsModal,
    closeModal: closeRewardsModal,
  } = useModal();

  const hasRewards = !!rewardsUnlocked?.length;

  return (
    <DealsWrapper>
      <DealWrapper>
        <TitleWrapper>
          <TokenGateTypeTitle>
            <Icon name="lock_open" /> Exclusivities unlocked
          </TokenGateTypeTitle>
          {isAdminApp && (
            <StyledButton secondary onClick={openExclusivitiesModal}>
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
      </DealWrapper>

      <DealWrapper>
        <TitleWrapper>
          <TokenGateTypeTitle>
            <Icon name="lock_open" /> Rewards unlocked
          </TokenGateTypeTitle>

          {isAdminApp && (
            <StyledButton secondary onClick={openRewardsModal}>
              {`${hasRewards ? 'Update' : 'Add'} rewards`}
            </StyledButton>
          )}
        </TitleWrapper>

        <Scoller>
          {rewardsUnlocked?.map(
            ({ type, value }: { type: string; value: number }) => (
              <RewardWrapper
                key={`${type}_${value}`}
                {...(isAdminApp && { onClick: openRewardsModal })}
                isAdminApp={isAdminApp}
              >
                <RewardBanner>{value}% OFF</RewardBanner>
                <RewardTitle>
                  {value}% {type.replace('_', ' ')}
                </RewardTitle>
                <RewardDescription>On all products</RewardDescription>
              </RewardWrapper>
            )
          )}
        </Scoller>

        {!rewardsUnlocked?.length && <p>No rewards yet.</p>}
      </DealWrapper>

      <ExclusivitiesModal title="Select exclusive products" isMaxWidth>
        <ExclusivitiesSelection
          closeModal={closeExclusivitiesModal}
          refetchNftByAddress={refetchNftByAddress}
        />
      </ExclusivitiesModal>

      <RewardsModal title={`${hasRewards ? 'Update' : 'Select'} rewards`}>
        <RewardsSelection
          closeModal={closeRewardsModal}
          refetchNftByAddress={refetchNftByAddress}
        />
      </RewardsModal>
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
  const navigate = useNavigate();

  const { refetchStoreNfts } = useNft();
  const { userBalance, isLoading: userBalanceIsLoading } = useBalance();

  const [showAll, setShowAll] = useState(false);

  const { publicKey } = useWallet();
  const [nftDataIsLoading, setNftDataIsLoading] = useState(false);

  const {
    loading: currentNftIsLoading,
    data: currentNft,
    refetch: refetchNftByAddress,
  } = useQuery(FIND_NFT_BY_ADDRESS, {
    variables: { nftAddress: address },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
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
    getProductLockedMapIsLoading,
  } = useNft();

  const { makePayment } = useSplTokenPayent();

  const [saveTransactionInvoice] = useMutation(SAVE_TRANSACTION_INVOICE);

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
  }, [address]);

  const handlePrintNewEdition = useCallback(async () => {
    if (!address) {
      message.error();
      return;
    }

    // Send msg if the user balance is less than the price
    if (Number(price) > (userBalance ?? 0)) {
      message.error(
        `Insufficient funds. You have ${userBalance} USDC in your wallet. Please add funds in order to continue the transaction.`,
        6
      );
      return;
    }

    setPrintNftIsLoading(true);

    const identity = metaplex?.identity();
    const newOwnerPublicKey = identity ? identity.publicKey : null;

    if (!newOwnerPublicKey) {
      message.error();
      return;
    }

    try {
      const transactionDetails = await makePayment({
        amount: Number(price),
        isNft: true,
      });

      message.success('Payment succeed.');

      const printedNft = await printNewNftEditionWithoutFees({
        originalNftAddress: address,
        newOwnerPublicKey,
      });

      const nftItem = {
        _id: printedNft?.address?.toBase58(),
        qty: 1,
        title: printedNft?.json?.name,
        description: printedNft?.json?.description,
        image: printedNft?.json?.image,
        productVariants: 'nft',
      };

      await saveTransactionInvoice({
        variables: {
          cartItems: JSON.stringify([nftItem]),
          totalPrice: Number(price),
          totalSaleTax: 0,
          totalWithSaleTax: Number(price),
          shippingFee: 0,
          ...transactionDetails,
          isNft: true,
        },
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
      message.error();
    }
  }, [
    address,
    price,
    userBalance,
    metaplex,
    makePayment,
    saveTransactionInvoice,
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
    await refetchStoreNfts();
    message.success('Archive status changed.');
    navigate(-1);
  }, [
    updateNft,
    currentNft?.findNftByAddress?._id,
    currentNft?.findNftByAddress?.isArchived,
    refetchNftByAddress,
    refetchStoreNfts,
    navigate,
  ]);

  useEffect(() => {
    // Load the NFT metadata
    loadNftData();
  }, [loadNftData]);

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
          <NftInfoWrapper>
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
                  isLoading={printNftIsLoading || getProductLockedMapIsLoading}
                  disabled={hasNftPrintedVersion || userBalanceIsLoading}
                >
                  {hasNftPrintedVersion ? (
                    "You're already member"
                  ) : (
                    <>
                      <span>Buy now {price} USDC</span>
                      <IconWrapper>
                        <Icon name="lock" />
                      </IconWrapper>
                    </>
                  )}
                </Button>
              ) : (
                <div>
                  <Button
                    icon="lock"
                    fullWidth
                    onClick={openConnectModal}
                    style={{ margin: '20px 0' }}
                  >
                    Connect your wallet to purchase
                  </Button>
                </div>
              ))}
          </NftInfoWrapper>

          {isAdminApp && (
            <NftInfoWrapper>
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
                  {nftIsArchived ? 'Unarchive NFT' : 'Archive NFT membership'}
                </Button>
              </div>
            </NftInfoWrapper>
          )}
        </DetailsWrapper>

        <RightWrapper>
          {currentNftIsLoading ? (
            <div>
              <Loader />
              <div style={{ textAlign: 'center' }}>
                Loading latest exclusivities and rewards
              </div>
            </div>
          ) : (
            <ExclusivitiesCarousel
              productsUnlocked={currentNft?.findNftByAddress?.productsUnlocked}
              rewardsUnlocked={currentNft?.findNftByAddress?.rewardsUnlocked}
              refetchNftByAddress={refetchNftByAddress}
              isAdminApp={isAdminApp}
            />
          )}
        </RightWrapper>
      </TokenGatingNftWrapper>
    </TokenGatingNftPageWrapper>
  );
};
