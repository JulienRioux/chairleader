import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  Button,
  NumberInput,
  Icon,
  UnstyledLink,
  Loader,
  message,
} from 'components-library';
import {
  BadgeWrapper,
  OutOfStockBadge,
  TokenGatedBadge,
} from 'components/product-preview';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useNft } from 'hooks/nft';
import { useScrollTop } from 'hooks/scroll-top';
import { useStore } from 'hooks/store';
import { useWalletModal } from 'hooks/wallet-modal';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { formatShortAddress, getNftDataFromAddressArr, routes } from 'utils';

const ProductWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.mediumWidth};
  margin: 0 auto;
`;

const ProductTitle = styled.h3`
  margin: 12px 0;
  font-size: 20px;
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
  font-size: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.color.text}44;
  background: ${(p) => p.theme.color.lightGrey};
  ${sharedStyles}
`;

const ImgWrapper = styled.div`
  position: relative;
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

  @media (max-width: 1000px) {
    right: 0;
  }
`;

const InnerAddToCartWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.mediumWidth};
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin-right: 12px;
  max-width: 140px;
  width: 140px;
  padding: 8px;
  border: 1px solid ${(p) => p.theme.color.text}22;
  border-radius: ${(p) => p.theme.borderRadius.default};
  position: relative;

  :last-of-type {
    margin-right: 0;
  }
`;

const NftName = styled.div`
  margin: 8px 0;
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

const HasNftPrintedVersionBadge = styled.div`
  display: flex;
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${(p) => p.theme.color.background}88;
  padding: 2px 4px;
  font-size: 12px;
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid;
`;

const QualifyingNftsHeader = styled.h3`
  font-size: 16px;
  margin: 40px 0 8px;
`;

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

      {hasNftPrintedVersion && (
        <HasNftPrintedVersionBadge>
          <Icon style={{ marginRight: '4px' }} name="verified" />
          <div>Owner</div>
        </HasNftPrintedVersionBadge>
      )}
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

  const { mapProductLockedToMaster, checkIfUserCanPurchaseTokenGatedProduct } =
    useNft();

  const { inventory } = useStore();

  const { currency } = useCurrency();

  const [imageSrc, setImageSrc] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxQuantity, setMaxQuantity] = useState<number | undefined>();
  const [qty, setQty] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

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
        const { title, description, price, totalSupply, image } =
          currentProduct;
        setName(title);
        setDescription(description);
        setPrice(price.toString());
        setMaxQuantity(totalSupply);
        setImageSrc(image);
        setQty(cartQuantity ?? 1);
      }
    }
  }, [inventory, productId, cartItems]);

  const handleAddToCart = useCallback(() => {
    productId && updateQuantity({ id: productId, qty });
    message.success(`${qty} x ${name} added to the cart.`);
    navigate(routes.store.inventory);
  }, [name, navigate, productId, qty, updateQuantity]);

  const isOutOfStock = maxQuantity === 0;

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
          {isTokenGated && <TokenGatedBadge isUnlocked={true} />}

          {isOutOfStock && <OutOfStockBadge />}
        </BadgeWrapper>
      </ImgWrapper>

      <ProductTitle>{name}</ProductTitle>
      <Price>
        {priceDisplay} {currency}
      </Price>
      <Description>{description}</Description>

      {tokenGatedNftDataIsLoading ? (
        <Loader />
      ) : (
        !!tokenGatedNftData.length && (
          <>
            <QualifyingNftsHeader>Qualifying NFTs:</QualifyingNftsHeader>

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

      <DummyDiv />

      {!isOutOfStock && (
        <AddToCartWrapper>
          <InnerAddToCartWrapper>
            {(!isTokenGated || isUnlocked) && (
              <>
                <NumberInput value={qty} onChange={setQty} max={maxQuantity} />

                <Button onClick={handleAddToCart} disabled={maxQuantity === 0}>
                  {isUpdating ? 'Update cart' : 'Add to cart'}{' '}
                  {Number((Number(price) * qty)?.toFixed(decimals))} {currency}
                </Button>
              </>
            )}

            {SHOW_CONNECT_WALLET_BUTTON && (
              <Button fullWidth icon="lock" onClick={openConnectModal}>
                Connect your wallet to unlock
              </Button>
            )}

            {SHOW_MISSING_TOKEN_MSG && (
              <>
                <p>You don't own qualifying NFT.</p>
                <Button to={`${routes.store.nfts}?productId=${productId}`}>
                  Shop qualifying NFTs
                </Button>
              </>
            )}
          </InnerAddToCartWrapper>
        </AddToCartWrapper>
      )}

      {isOutOfStock && <p>Out of stock</p>}
    </ProductWrapper>
  );
};
