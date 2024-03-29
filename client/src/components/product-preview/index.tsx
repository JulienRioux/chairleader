import { UnstyledLink, Icon } from 'components-library';
import { useAuth } from 'hooks/auth';
import { useCurrency } from 'hooks/currency';
import { useNft } from 'hooks/nft';
import styled, { css } from 'styled-components';
import { getProductVariantsLowestPrice, routes } from 'utils';
import { slideInBottom } from 'utils/keyframes';

const ProductWrapper = styled(UnstyledLink)<{
  $isOutOfStock: boolean;
  $delay: number;
}>`
  position: relative;
  opacity: 0;
  animation: 0.4s ${slideInBottom} ${(p) => p.$delay}s forwards;

  ${(p) =>
    p.$isOutOfStock &&
    css`
      ${ProductTitle}, ${Price} ,${Img} {
        opacity: 0.3;
      }
    `}
`;

const ProductTitle = styled.h3`
  margin: 8px 0;
  font-size: 20px;
`;

const Price = styled.div`
  color: ${(p) => p.theme.color.primary};
  font-size: 18px;
`;

const OutOfStockBadgeWrapper = styled.div`
  background: ${(p) => p.theme.color.background};
  border: 1px solid;
  padding: 4px 8px;
  border-radius: ${(p) => p.theme.borderRadius.default};
  text-align: center;
`;
const sharedStyles = css`
  width: calc(100% - 2px);
  aspect-ratio: ${(p) => p.theme.products.image.aspectRatio};
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const Img = styled.img`
  object-position: center;
  object-fit: cover;
  ${sharedStyles}
`;

const NoImageProduct = styled.div`
  font-size: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.color.text}44;
  background: ${(p) => p.theme.color.text}11;
  ${sharedStyles};
`;

export const OutOfStockBadge = () => (
  <OutOfStockBadgeWrapper>Out of stock</OutOfStockBadgeWrapper>
);

export const DraftBadge = () => (
  <OutOfStockBadgeWrapper>Draft</OutOfStockBadgeWrapper>
);

const TokenGatedBadgeWrapper = styled.div<{ isPositionAbsolute?: boolean }>`
  background: ${(p) => p.theme.color.background};
  border: 1px solid;
  padding: 4px 8px;
  border-radius: ${(p) => p.theme.borderRadius.default};
  display: flex;
  color: ${(p) => p.theme.color.primary};
  margin-bottom: 8px;
  text-align: center;
  font-size: 16px;

  ${(p) =>
    p.isPositionAbsolute &&
    css`
      position: absolute;
      top: 8px;
      right: 8px;
    `}
`;

const TokenGatedText = styled.div`
  margin-left: 4px;
`;

export const BadgeWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
`;

export const TokenGatedBadge = ({
  isPositionAbsolute,
  isUnlocked,
}: {
  isPositionAbsolute?: boolean;
  isUnlocked?: boolean;
}) => (
  <TokenGatedBadgeWrapper isPositionAbsolute={isPositionAbsolute}>
    {isUnlocked ? (
      <>
        <Icon name="lock_open" />
        <TokenGatedText>Exclusivity</TokenGatedText>
      </>
    ) : (
      <>
        <Icon name="lock" />
        <TokenGatedText>Exclusivity</TokenGatedText>
      </>
    )}
  </TokenGatedBadgeWrapper>
);

interface ProductPreviewProps {
  image: string;
  title: string;
  price: string;
  id: string;
  isPos?: boolean;
  totalSupply?: number;
  status?: string;
  allPossibleVariantsObject?: any;
  productType: string;
  index?: number;
}

export const ProductPreviewItem = ({
  image,
  title,
  priceDisplay,
  currency,
}: any) => (
  <>
    {image ? (
      <Img src={image} />
    ) : (
      <NoImageProduct>
        <Icon name="image" />
      </NoImageProduct>
    )}
    <ProductTitle>{title}</ProductTitle>
    {priceDisplay && (
      <Price>
        {priceDisplay} {currency}
      </Price>
    )}
  </>
);

export const ProductPreview = ({
  image,
  title,
  price,
  id,
  isPos,
  totalSupply,
  status,
  productType,
  allPossibleVariantsObject,
  index = 0,
}: ProductPreviewProps) => {
  const { user, currencyDecimals } = useAuth();
  const { currency, decimals } = useCurrency();
  const {
    checkIfUserCanPurchaseTokenGatedProduct,
    getProductLockedMapIsLoading,
  } = useNft();

  const isOutOfStock = totalSupply === 0;

  const { productPrice, hasMultiplePrice } = getProductVariantsLowestPrice({
    allPossibleVariantsObject,
    price,
    productType,
  });

  const priceDisplay = Number(
    Number(productPrice)?.toFixed(isPos ? decimals : currencyDecimals)
  );

  const { isTokenGated, isUnlocked } =
    checkIfUserCanPurchaseTokenGatedProduct(id);

  return (
    <ProductWrapper
      to={`${isPos ? routes.store.inventory : routes.admin.inventory}/${id}`}
      $isOutOfStock={isOutOfStock}
      $delay={index < 8 ? index / 20 : 0}
    >
      <ProductPreviewItem
        image={image}
        title={title}
        priceDisplay={`${hasMultiplePrice ? 'From ' : ''} ${priceDisplay}`}
        currency={isPos ? currency : user?.currency}
      />

      <BadgeWrapper>
        {isTokenGated && <TokenGatedBadge isUnlocked={isUnlocked} />}

        {isOutOfStock && <OutOfStockBadge />}

        {status === 'draft' && <DraftBadge />}
      </BadgeWrapper>
    </ProductWrapper>
  );
};
