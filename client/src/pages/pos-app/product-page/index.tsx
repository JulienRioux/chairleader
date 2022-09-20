import { useWallet } from '@solana/wallet-adapter-react';
import { Button, NumberInput, Icon } from 'components-library';
import { OutOfStockBadge } from 'components/product-preview';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useNft } from 'hooks/nft';
import { useScrollTop } from 'hooks/scroll-top';
import { useStore } from 'hooks/store';
import { useWalletModal } from 'hooks/wallet-modal';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { routes } from 'utils';

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
  padding: 8px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 480px;
  background: ${(p) => p.theme.color.background};

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

export const ProductPage = () => {
  useScrollTop();
  const { updateQuantity, cartItems } = useCart();
  const { decimals } = useCurrency();
  const navigate = useNavigate();
  const { publicKey } = useWallet();

  const { openConnectModal } = useWalletModal();

  const { userNfts } = useNft();

  const { inventory } = useStore();

  const { currency } = useCurrency();

  const [imageSrc, setImageSrc] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxQuantity, setMaxQuantity] = useState<number | undefined>();
  const [qty, setQty] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

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
    navigate(routes.store.inventory);
  }, [navigate, productId, qty, updateQuantity]);

  const isOutOfStock = maxQuantity === 0;

  const priceDisplay = Number(Number(price)?.toFixed(decimals));

  // TODO: This will needs to be rewrite...
  // const tokenGated: string[] = [];
  const tokenGated: string[] = ['3TXh8vQGvgAxUSEEkcHyZdpy12pTX6TcAXsmDJnvuPLJ'];
  const isTokenGatedProduct = tokenGated.length > 0;

  // The product is unlocked if the user wallet is connected and the user has one token-gating NFT
  const productIsUnlocked =
    publicKey && tokenGated.some((nftAddress) => userNfts.includes(nftAddress));

  // Show the connect wallet button if the product is token-gated and the user wallet is not connected.
  const SHOW_CONNECT_WALLET_BUTTON = isTokenGatedProduct && !publicKey;

  // Show the missing token msg if the product it token-gated, the user wallet is connected and the user did not have the right token
  const SHOW_MISSING_TOKEN_MSG =
    isTokenGatedProduct && publicKey && !productIsUnlocked;

  return (
    <ProductWrapper>
      <p>Exclusive product (Token gated)</p>
      <ImgWrapper>
        {imageSrc ? (
          <Img src={imageSrc} />
        ) : (
          <NoImageProduct>
            <Icon name="image" />
          </NoImageProduct>
        )}

        {isOutOfStock && <OutOfStockBadge />}
      </ImgWrapper>

      <ProductTitle>{name}</ProductTitle>
      <Price>
        {priceDisplay} {currency}
      </Price>
      <Description>{description}</Description>

      <DummyDiv />

      {!isOutOfStock && (
        <AddToCartWrapper>
          <InnerAddToCartWrapper>
            {(!isTokenGatedProduct || productIsUnlocked) && (
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

            {SHOW_MISSING_TOKEN_MSG && <p>LINK OR MODAL TO PURCHASE NFT?</p>}
          </InnerAddToCartWrapper>
        </AddToCartWrapper>
      )}

      {isOutOfStock && <p>Out of stock</p>}
    </ProductWrapper>
  );
};
