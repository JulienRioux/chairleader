import { UnstyledLink, Icon } from 'components-library';
import { useAuth } from 'hooks/auth';
import { useCurrency } from 'hooks/currency';
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
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${(p) => p.theme.color.background};
  border: 1px solid;
  padding: 4px 8px;
  border-radius: ${(p) => p.theme.borderRadius.default};
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

interface ProductPreviewProps {
  image: string;
  title: string;
  price: string;
  id: string;
  isPos?: boolean;
  totalSupply?: number;
}

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

  const isOutOfStock = totalSupply === 0;

  const priceDisplay = Number(
    Number(price).toFixed(isPos ? decimals : currencyDecimals)
  );

  return (
    <ProductWrapper
      to={`${isPos ? routes.store.inventory : routes.admin.inventory}/${id}`}
      $isOutOfStock={isOutOfStock}
    >
      {image ? (
        <Img src={image} />
      ) : (
        <NoImageProduct>
          <Icon name="image" />
        </NoImageProduct>
      )}
      <ProductTitle>{title}</ProductTitle>
      <Price>
        {priceDisplay} {isPos ? currency : user?.currency}
      </Price>

      {isOutOfStock && <OutOfStockBadge />}
    </ProductWrapper>
  );
};
