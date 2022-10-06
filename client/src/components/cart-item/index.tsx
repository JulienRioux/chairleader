import {
  Icon,
  NumberInput,
  UnstyledButton,
  UnstyledLink,
} from 'components-library';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { routes } from 'utils';

const CartItemWrapper = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};

  :last-of-type {
    border: none;
  }
`;

const ImgAndName = styled.div`
  display: flex;
`;

const ProductTitle = styled(UnstyledLink)`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: bold;
  display: block;
`;

const ProductVariants = styled.div`
  margin-bottom: 12px;
  font-size: 13px;
  color: ${(p) => p.theme.color.text}bb;
`;

const Price = styled.div`
  color: ${(p) => p.theme.color.primary};

  span {
    color: ${(p) => p.theme.color.lightText};
    font-size: 14px;
  }
`;

export const cartItemImgSharedStyles = css`
  width: 80px;
  aspect-ratio: ${(p) => p.theme.products.image.aspectRatio};
  border-radius: ${(p) => p.theme.borderRadius.default};
  margin-right: 12px;
  border: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const Img = styled.img`
  object-position: center;
  object-fit: cover;
  ${cartItemImgSharedStyles}
`;

const NoImageProduct = styled.div<{ isCustomProduct: boolean }>`
  font-size: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.color.text}44;
  background: ${(p) => p.theme.color.lightGrey};
  ${cartItemImgSharedStyles}
  min-width: 80px;
  ${(p) => p.isCustomProduct && `background: transparent;`}
`;

const PriceAndTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

const Total = styled.div`
  span {
    color: ${(p) => p.theme.color.primary};
  }
`;

const DeleteButton = styled(UnstyledButton)`
  color: ${(p) => p.theme.color.lightText};
  padding: 8px;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.color.text}0c;
  transition: 0.2s;

  :hover {
    background: ${(p) => p.theme.color.text}1c;
  }
`;

const TitleAndDeleteBtn = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TextAndBtns = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const CustomText = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: ${(p) => p.theme.color.primary};
`;

export const CartItem = ({
  id,
  qty,
  image,
  title,
  price,
  totalSupply,
  enableUpdate,
  currency,
  isAdmin,
  productVariants,
}: {
  id: string;
  qty: number;
  image: string;
  title: string;
  price: number;
  totalSupply: number;
  enableUpdate: boolean;
  currency: string;
  isAdmin?: boolean;
  productVariants?: string;
}) => {
  const { decimals } = useCurrency();

  const { updateQuantity, removeItemFromCart } = useCart();

  const handleUpdateQuantity = useCallback(
    (qty: number) => {
      updateQuantity({ id, qty });
    },
    [id, updateQuantity]
  );

  const isCustomProduct = id?.startsWith('CUSTOM_ITEM_');

  const priceDisplay = Number((price * qty)?.toFixed(decimals ?? 6));

  return (
    <CartItemWrapper>
      <ImgAndName>
        {image ? (
          <Img src={image} />
        ) : (
          <NoImageProduct isCustomProduct={isCustomProduct}>
            {isCustomProduct ? (
              <CustomText>CUSTOM</CustomText>
            ) : (
              <Icon name="image" />
            )}
          </NoImageProduct>
        )}

        <TextAndBtns>
          <TitleAndDeleteBtn>
            <div>
              <ProductTitle
                to={`${
                  isAdmin ? routes.admin.inventory : routes.store.inventory
                }/${id}`}
              >
                {title}
              </ProductTitle>
              {productVariants && (
                <ProductVariants>{productVariants}</ProductVariants>
              )}
            </div>

            {enableUpdate && (
              <DeleteButton onClick={() => removeItemFromCart(id)}>
                <Icon name="delete_outline" />
              </DeleteButton>
            )}
          </TitleAndDeleteBtn>

          {enableUpdate && (
            <NumberInput
              value={qty}
              onChange={handleUpdateQuantity}
              max={totalSupply}
            />
          )}
        </TextAndBtns>
      </ImgAndName>

      <PriceAndTotal>
        <Price>
          <span>{!enableUpdate && `${qty} x `}</span>
          {priceDisplay} {currency} {enableUpdate && <span>each</span>}
        </Price>

        {price && (
          <Total>
            Total:{' '}
            <span>
              {priceDisplay} {currency}
            </span>
          </Total>
        )}
      </PriceAndTotal>
    </CartItemWrapper>
  );
};
