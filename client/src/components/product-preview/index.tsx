import { UnstyledLink, Icon } from 'components-library';
import { useAuth } from 'hooks/auth';
import { useCurrency } from 'hooks/currency';
import { useNft } from 'hooks/nft';
import styled, { css } from 'styled-components';
import { routes } from 'utils';

const ProductWrapper = styled(UnstyledLink)<{ $isOutOfStock: boolean }>`
  position: relative;
  ${(p) =>
    p.$isOutOfStock &&
    css`
      ${ProductTitle}, ${Price} ,${Img} {
        opacity: 0.3;
      }
    `}
`;

const ProductTitle = styled.h3`
  margin: 12px 0;
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
  width: 100%;
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
  background: ${(p) => p.theme.color.lightGrey};
  ${sharedStyles};
`;

export const OutOfStockBadge = () => (
  <OutOfStockBadgeWrapper>Out of stock</OutOfStockBadgeWrapper>
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
}: {
  isPositionAbsolute?: boolean;
}) => (
  <TokenGatedBadgeWrapper isPositionAbsolute={isPositionAbsolute}>
    <Icon name="lock" />
    <TokenGatedText>Token gated</TokenGatedText>
  </TokenGatedBadgeWrapper>
);

interface ProductPreviewProps {
  image: string;
  title: string;
  price: string;
  id: string;
  isPos?: boolean;
  totalSupply?: number;
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
    <Price>
      {priceDisplay} {currency}
    </Price>
  </>
);

export const ProductPreview = ({
  image,
  title,
  price,
  id,
  isPos,
  totalSupply,
}: ProductPreviewProps) => {
  const { user, currencyDecimals } = useAuth();
  const { currency, decimals } = useCurrency();
  const { checkIfTokenGatedProduct } = useNft();

  const isOutOfStock = totalSupply === 0;

  const priceDisplay = Number(
    Number(price)?.toFixed(isPos ? decimals : currencyDecimals)
  );

  const isLockedProduct = checkIfTokenGatedProduct(id);

  return (
    <ProductWrapper
      to={`${isPos ? routes.store.inventory : routes.admin.inventory}/${id}`}
      $isOutOfStock={isOutOfStock}
    >
      <ProductPreviewItem
        image={image}
        title={title}
        priceDisplay={priceDisplay}
        currency={isPos ? currency : user?.currency}
      />

      <BadgeWrapper>
        {isLockedProduct && <TokenGatedBadge />}

        {isOutOfStock && <OutOfStockBadge />}
      </BadgeWrapper>
    </ProductWrapper>
  );
};
