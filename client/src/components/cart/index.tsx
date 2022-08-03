import { CartItem, CartTotal } from 'components';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import styled from 'styled-components';

const Header = styled.h3`
  font-weight: bold;
  font-size: 20px;
  margin: 12px 0;
`;

const CartWrapper = styled.div``;

const Par = styled.p`
  color: ${(p) => p.theme.color.lightText};
  padding-top: 20px;
`;

const CartItemsAndTotalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;
`;

const HeaderAndITems = styled.div`
  padding: 8px 20px;
  overflow: scroll;
`;

export const CartItems = ({ showHeaderText = true, enableUpdate = true }) => {
  const { cartItems } = useCart();
  const { currency } = useCurrency();

  return (
    <HeaderAndITems>
      {showHeaderText && <Header>Current order</Header>}

      {cartItems.length ? (
        cartItems.map(({ _id, qty, image, title, price, totalSupply }) => (
          <CartItem
            key={_id}
            id={_id}
            qty={qty}
            image={image}
            title={title}
            price={price}
            totalSupply={totalSupply}
            enableUpdate={enableUpdate}
            currency={currency}
          />
        ))
      ) : (
        <Par>No item in your cart yet.</Par>
      )}
    </HeaderAndITems>
  );
};

export const Cart = () => {
  return (
    <CartWrapper>
      <CartItemsAndTotalWrapper>
        <CartItems />

        <CartTotal />
      </CartItemsAndTotalWrapper>
    </CartWrapper>
  );
};
