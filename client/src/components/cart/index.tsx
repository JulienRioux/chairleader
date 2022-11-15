import { CartItem, CartTotal } from 'components';
import { Button, Icon } from 'components-library';
import { CloseBtn } from 'components-library/modal/styled';
import { IInventoryItem, useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { PRODUCT_TYPE } from 'pages/admin-pages/product-form';
import { useState } from 'react';
import styled from 'styled-components';

const CartHeader = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin: 0;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  min-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
`;

const Par = styled.p`
  color: ${(p) => p.theme.color.lightText};
  padding-top: 20px;
`;

const CartItemsAndTotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const HeaderAndITems = styled.div`
  overflow: scroll;
`;

const CartItemsWrapper = styled.div`
  padding: 8px 12px;
  overflow: scroll;
  height: 100%;
`;

const FIRST_ITEMS_LENGTH = 2;

export const CartItems = ({
  enableUpdate = true,
  showMoreButton = false,
  handleCloseModal,
}: {
  enableUpdate?: boolean;
  showMoreButton?: boolean;
  handleCloseModal?: () => void;
}) => {
  const { cartItems } = useCart();
  const { currency } = useCurrency();

  const [showAllITems, setShowAllITems] = useState(false);

  let firstCartITems = cartItems;

  let restITems: IInventoryItem[] = [];

  if (showMoreButton) {
    firstCartITems = cartItems.slice(0, FIRST_ITEMS_LENGTH);
    restITems = cartItems.slice(FIRST_ITEMS_LENGTH);
  }

  const hasMoreItems = FIRST_ITEMS_LENGTH < cartItems.length;

  const ToggleBtn = ({ showLess = false }) => (
    <div style={{ marginTop: '20px' }}>
      <Button
        fullWidth
        onClick={() => setShowAllITems(!showAllITems)}
        secondary
      >
        {showLess ? 'Show less' : `Show all items (${restITems.length} more)`}
      </Button>
    </div>
  );

  const getTotalSupply = ({
    totalSupply,
    productVariants,
    productType,
    allPossibleVariantsObject,
  }: any) => {
    if (productType === PRODUCT_TYPE.SIMPLE_PRODUCT) {
      return totalSupply;
    }
    return allPossibleVariantsObject[productVariants]?.qty;
  };

  return (
    <HeaderAndITems>
      {cartItems.length ? (
        firstCartITems.map(
          ({
            _id,
            qty,
            image,
            title,
            price,
            totalSupply,
            productVariants,
            productType,
            allPossibleVariantsObject,
            variantNames,
          }) => {
            return (
              <CartItem
                key={`${_id}_${productVariants}`}
                id={_id}
                qty={qty}
                image={image}
                title={title}
                price={price}
                totalSupply={getTotalSupply({
                  totalSupply,
                  productVariants,
                  productType,
                  allPossibleVariantsObject,
                })}
                enableUpdate={enableUpdate}
                currency={currency}
                productVariants={productVariants}
                variantNames={variantNames}
                handleCloseModal={handleCloseModal}
              />
            );
          }
        )
      ) : (
        <Par>You don't have anything in your cart yet!</Par>
      )}

      {!showAllITems && showMoreButton && hasMoreItems && <ToggleBtn />}

      {showAllITems &&
        restITems.map(
          ({
            _id,
            qty,
            image,
            title,
            price,
            totalSupply,
            productVariants,
            variantNames,
          }) => (
            <CartItem
              key={`${_id}_${productVariants}`}
              id={_id}
              qty={qty}
              image={image}
              title={title}
              price={price}
              totalSupply={totalSupply}
              enableUpdate={enableUpdate}
              currency={currency}
              productVariants={productVariants}
              variantNames={variantNames}
              handleCloseModal={handleCloseModal}
            />
          )
        )}

      {showAllITems && showMoreButton && hasMoreItems && <ToggleBtn showLess />}
    </HeaderAndITems>
  );
};

export const Cart = ({ onCloseClick }: { onCloseClick: () => void }) => {
  return (
    <>
      <CartItemsAndTotalWrapper>
        <CartHeader>
          <div>Cart items</div>

          <CloseBtn onClick={onCloseClick}>
            <Icon name="close" />
          </CloseBtn>
        </CartHeader>
        <CartItemsWrapper>
          <CartItems handleCloseModal={onCloseClick} />
        </CartItemsWrapper>

        <CartTotal />
      </CartItemsAndTotalWrapper>
    </>
  );
};
