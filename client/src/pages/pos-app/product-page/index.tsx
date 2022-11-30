import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  Button,
  NumberInput,
  Icon,
  UnstyledLink,
  Loader,
  message,
  SelectButtons,
} from 'components-library';
import {
  BadgeWrapper,
  OutOfStockBadge,
  TokenGatedBadge,
} from 'components/product-preview';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useMediaQuery } from 'hooks/media-query';
import { useNft } from 'hooks/nft';
import { useScrollTop } from 'hooks/scroll-top';
import { useStore } from 'hooks/store';
import { useWalletModal } from 'hooks/wallet-modal';
import { PRODUCT_TYPE } from 'pages/admin-pages/product-form';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  formatShortAddress,
  formatVariantsOptions,
  getNftDataFromAddressArr,
  routes,
} from 'utils';
import { slideInBottom } from 'utils/keyframes';

const ProductWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 800px) {
    display: block;
  }
`;

const TitleAndPrice = styled.div``;

const ProductTitle = styled.h3`
  margin: 12px 0;
  font-size: 32px;

  @media (max-width: 800px) {
    font-size: 24px;
  }
`;

const Price = styled.div`
  color: ${(p) => p.theme.color.primary};
  font-size: 18px;
`;

const Description = styled.p`
  color: ${(p) => p.theme.color.lightText};
  line-height: 1.6;
`;

const sharedStyles = css`
  width: 100%;
  aspect-ratio: ${(p) => p.theme.products.image.aspectRatio};
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const Img = styled.img`
  ${sharedStyles}
  object-position: center;
  object-fit: cover;
`;

const NoImageProduct = styled.div`
  font-size: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.color.text}44;
  background: ${(p) => p.theme.color.text}11;
  ${sharedStyles}
`;

const ImgWrapper = styled.div`
  position: relative;
  animation: 0.4s ${slideInBottom} forwards;
`;

/** This is needed to make sure we're not having any content under the add to cart button */
const DummyDiv = styled.div`
  height: 80px;
`;

const AddToCartWrapper = styled.div`
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
  padding: 9px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${(p) => p.theme.color.background};
  z-index: 9;
  min-height: 42px;

  @media (max-width: 1000px) {
    right: 0;
  }
`;

const InnerAddToCartWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  gap: 20px;

  @media (max-width: 800px) {
    justify-content: space-between;
  }
`;

const NftCardScroller = styled.div`
  display: inline-flex;
`;

const NftCardScrollerWrapper = styled.div`
  overflow: scroll;
  padding: 8px 0;
`;

const NftImg = styled(Img)``;

const NftCardWrapper = styled(UnstyledLink)`
  margin-right: 20px;
  max-width: 140px;
  width: 140px;
  position: relative;

  :last-of-type {
    margin-right: 0;
  }
`;

const NftName = styled.div`
  margin: 4px 0 8px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: initial;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const NftAddress = styled.div`
  font-size: 12px;
  color: ${(p) => p.theme.color.primary};
  /* display: inline;
  background: ${(p) => p.theme.color.primary}22;
  border: 1px solid ${(p) => p.theme.color.primary}22;
  border-radius: ${(p) => p.theme.borderRadius.input};
  padding: 2px 4px; */
`;

export const HasNftPrintedVersionBadge = styled.div`
  display: flex;
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${(p) => p.theme.color.background}88;
  padding: 2px 4px;
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid;
`;

const QualifyingNftsHeader = styled.h3`
  font-size: 16px;
  margin: 40px 0 8px;
`;

export const NftOwnerBadge = () => (
  <HasNftPrintedVersionBadge>
    <Icon style={{ marginRight: '4px' }} name="lock_open" />
    <div>Member</div>
  </HasNftPrintedVersionBadge>
);

const NftCard = ({
  image,
  name,
  address,
}: {
  image: string;
  name: string;
  address: string;
}) => {
  const { checkIfUserHasPrintedVersion } = useNft();

  const hasNftPrintedVersion = checkIfUserHasPrintedVersion(address);

  return (
    <NftCardWrapper to={`${routes.store.nfts}/${address}`}>
      <NftImg src={image} />
      <NftName>{name}</NftName>

      <NftAddress>{formatShortAddress(address)}</NftAddress>

      {hasNftPrintedVersion && <NftOwnerBadge />}
    </NftCardWrapper>
  );
};

export const ProductPage = () => {
  useScrollTop();
  const { updateQuantity, cartItems } = useCart();
  const { decimals } = useCurrency();
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  const { openConnectModal } = useWalletModal();

  const {
    mapProductLockedToMaster,
    checkIfUserCanPurchaseTokenGatedProduct,
    getProductLockedMapIsLoading,
    storeNftsAreLoading,
  } = useNft();

  const { inventory } = useStore();

  const { currency } = useCurrency();

  const isMobileView = useMediaQuery('(max-width: 800px)');

  const [imageSrc, setImageSrc] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxQuantity, setMaxQuantity] = useState<number | undefined>();
  const [qty, setQty] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productType, setProductType] = useState('');
  const [variantNames, setVariantNames] = useState<string[]>([]);
  const [variantsValues, setVariantsValues] = useState<[[string]]>();
  const [allPossibleVariantsObject, setAllPossibleVariantsObject] =
    useState<any>({});

  const [productVariants, setProductVariants] = useState<string[]>([]);

  const [tokenGatedNftData, setTokenGatedNftData] = useState<any>([]);
  const [tokenGatedNftDataIsLoading, setTokenGatedNftDataIsLoading] =
    useState(false);

  const { productId } = useParams();

  useEffect(() => {
    if (productId) {
      const currentProduct = inventory?.find(({ _id }) => _id === productId);

      const itemInCart = cartItems?.find(({ _id }) => _id === productId);

      const cartQuantity = itemInCart?.qty;

      setIsUpdating(!!cartQuantity);

      if (currentProduct) {
        // Fields for all product types
        setName(currentProduct?.title);
        setDescription(currentProduct?.description);
        setImageSrc(currentProduct?.image);
        setProductType(currentProduct.productType);
        setQty(cartQuantity ?? 1);

        if (currentProduct.productType === PRODUCT_TYPE.SIMPLE_PRODUCT) {
          setPrice(currentProduct?.price?.toString());
          setMaxQuantity(currentProduct?.totalSupply);
        }

        if (currentProduct.productType === PRODUCT_TYPE.PRODUCT_WITH_VARIANT) {
          setVariantNames(currentProduct.variantNames ?? []);
          setVariantsValues(currentProduct.variantsValues);
          const initProductVariantsValues: string[] =
            currentProduct.variantsValues?.map((option) => option[0], []) ?? [];

          setProductVariants(initProductVariantsValues);

          setAllPossibleVariantsObject(
            currentProduct.allPossibleVariantsObject
          );

          // Set the price and max quantity
          const formattedOptions = formatVariantsOptions(
            initProductVariantsValues
          );

          const currentOptionPriceAndQty =
            currentProduct.allPossibleVariantsObject[formattedOptions];

          setPrice(currentOptionPriceAndQty?.price?.toString());
          setMaxQuantity(currentOptionPriceAndQty?.qty);
        }
      }
    }
    // Only run this on product mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleAddToCart = useCallback(() => {
    if (productId) {
      updateQuantity({
        id: productId,
        qty,
        productVariants: formatVariantsOptions(productVariants),
        price,
      });
    }
    message.success(`${qty} x ${name} added to the cart.`);
    navigate(-1);
  }, [name, navigate, price, productId, productVariants, qty, updateQuantity]);

  const isOutOfStock = Number(maxQuantity) === 0;

  const priceDisplay = Number(Number(price)?.toFixed(decimals));

  const { isTokenGated, isUnlocked } = productId
    ? checkIfUserCanPurchaseTokenGatedProduct(productId)
    : { isTokenGated: false, isUnlocked: false };

  // Show the connect wallet button if the product is token-gated and the user wallet is not connected.
  const SHOW_CONNECT_WALLET_BUTTON = isTokenGated && !publicKey;

  // Show the missing token msg if the product it token-gated, the user wallet is connected and the user did not have the right token
  const SHOW_MISSING_TOKEN_MSG = isTokenGated && publicKey && !isUnlocked;

  const getNftMetadata = useCallback(async () => {
    setTokenGatedNftDataIsLoading(true);
    const masterNftTokenGatingAddress =
      mapProductLockedToMaster[productId ?? ''];

    const nftData = await getNftDataFromAddressArr(masterNftTokenGatingAddress);

    setTokenGatedNftData(nftData);
    setTokenGatedNftDataIsLoading(false);
  }, [productId, mapProductLockedToMaster]);

  useEffect(() => {
    getNftMetadata();
  }, [getNftMetadata]);

  const handleProductVariantsChange = useCallback(
    (option: string, index: number) => {
      const productVariantsCopy = [...productVariants];
      productVariantsCopy[index] = option;

      setProductVariants(productVariantsCopy);
      // Set the price and max quantity
      const formattedOptions = formatVariantsOptions(productVariantsCopy);

      const currentOptionPriceAndQty =
        allPossibleVariantsObject[formattedOptions];

      setPrice(currentOptionPriceAndQty?.price?.toString());
      setMaxQuantity(currentOptionPriceAndQty?.qty);
      // Simple solution: Reset the quantity to fix some issue that could happens if the next selection did not have the qty as maxQty
      setQty(1);
    },
    [allPossibleVariantsObject, productVariants]
  );

  const checkIfOptionIsOutOfStock = useCallback(
    ({ index, option }: { index: number; option: string }) => {
      const isLastOptionsGroup = variantNames.length - 1 === index;
      if (!isLastOptionsGroup) {
        return false;
      }
      const productVariantsCopy = [...productVariants];
      productVariantsCopy[index] = option;
      const formattedOptions = formatVariantsOptions(productVariantsCopy);
      return Number(allPossibleVariantsObject[formattedOptions].qty) === 0;
    },
    [allPossibleVariantsObject, productVariants, variantNames.length]
  );

  const IS_PRODUCT_WITH_VARIANTS =
    productType === PRODUCT_TYPE.PRODUCT_WITH_VARIANT;

  return (
    <ProductWrapper>
      <ImgWrapper>
        {imageSrc ? (
          <Img src={imageSrc} />
        ) : (
          <NoImageProduct>
            <Icon name="image" />
          </NoImageProduct>
        )}

        <BadgeWrapper>
          {isTokenGated && <TokenGatedBadge isUnlocked={isUnlocked} />}

          {isOutOfStock && <OutOfStockBadge />}
        </BadgeWrapper>
      </ImgWrapper>

      <div>
        <TitleAndPrice>
          <ProductTitle>{name}</ProductTitle>
          <Price>
            {priceDisplay} {currency}
          </Price>
        </TitleAndPrice>

        <Description>{description}</Description>

        {IS_PRODUCT_WITH_VARIANTS &&
          variantNames?.map((variantName, index) => (
            <SelectButtons
              key={variantName}
              label={variantName}
              options={variantsValues ? variantsValues[index] : []}
              value={productVariants[index]}
              onChange={(option: string) =>
                handleProductVariantsChange(option, index)
              }
              checkIfOptionIsOutOfStock={(option: string) =>
                checkIfOptionIsOutOfStock({ index, option })
              }
            />
          ))}

        {tokenGatedNftDataIsLoading ? (
          <Loader />
        ) : (
          !!tokenGatedNftData.length && (
            <>
              <QualifyingNftsHeader>NFT membership:</QualifyingNftsHeader>

              <NftCardScrollerWrapper>
                <NftCardScroller>
                  {tokenGatedNftData.map(
                    ({
                      address,
                      json: { name, image },
                    }: {
                      address: PublicKey;
                      json: { name: string; image: string };
                    }) => {
                      const addressString = address.toBase58();
                      return (
                        <NftCard
                          key={addressString}
                          image={image}
                          name={name}
                          address={addressString}
                        />
                      );
                    }
                  )}
                </NftCardScroller>
              </NftCardScrollerWrapper>
            </>
          )
        )}
      </div>

      <DummyDiv />

      <AddToCartWrapper>
        <InnerAddToCartWrapper>
          {!storeNftsAreLoading && (!isTokenGated || isUnlocked) && (
            <>
              {isOutOfStock ? (
                <span />
              ) : (
                <NumberInput value={qty} onChange={setQty} max={maxQuantity} />
              )}

              <Button onClick={handleAddToCart} disabled={isOutOfStock}>
                {isOutOfStock ? (
                  'Unavailable'
                ) : (
                  <>
                    {isUpdating && productType === PRODUCT_TYPE.SIMPLE_PRODUCT
                      ? 'Update cart'
                      : 'Add to cart'}{' '}
                    {Number((Number(price) * qty)?.toFixed(decimals))}{' '}
                    {currency}
                  </>
                )}
              </Button>
            </>
          )}

          {SHOW_CONNECT_WALLET_BUTTON && (
            <Button
              fullWidth={isMobileView}
              icon="lock"
              onClick={openConnectModal}
            >
              Connect your wallet to unlock
            </Button>
          )}

          {SHOW_MISSING_TOKEN_MSG && (
            <>
              {getProductLockedMapIsLoading ? (
                <div>Checking NFT ownership...</div>
              ) : (
                <div>You don't own NFT membership.</div>
              )}
              <Button
                icon="card_membership"
                to={routes.store.nfts}
                isLoading={getProductLockedMapIsLoading}
              >
                Get NFT membership
              </Button>
            </>
          )}
        </InnerAddToCartWrapper>
      </AddToCartWrapper>
    </ProductWrapper>
  );
};
