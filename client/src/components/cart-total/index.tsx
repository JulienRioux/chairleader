import { Button } from 'components-library';
import { useAuth } from 'hooks/auth';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useStore } from 'hooks/store';
import styled, { css } from 'styled-components';
import { routes } from 'utils';

const CartTotalWrapper = styled.div`
  padding: 20px 20px 8px;
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const SubTotalItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
`;

const TotalItem = styled.div<{ $showTopBorder: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 20px 0 32px;
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};

  ${(p) =>
    p.$showTopBorder &&
    css`
      border-top: none;
    `}
`;

export const CartSummary = ({
  totalPrice,
  totalSaleTax,
  totalWithSaleTax,
  currency,
  isAdminApp,
  shippingFee,
}: {
  totalPrice: number;
  totalSaleTax: number;
  totalWithSaleTax: number;
  currency: string;
  isAdminApp?: boolean;
  shippingFee?: number;
}) => {
  const { store } = useStore();
  const { user } = useAuth();

  const saleTax = isAdminApp ? user?.saleTax : store?.saleTax;

  const hasSaleTaxOrShippingFees = !!saleTax || !!shippingFee;

  return (
    <>
      {hasSaleTaxOrShippingFees && (
        <SubTotalItem>
          <span>Subtotal:</span>
          {totalPrice} {currency}
        </SubTotalItem>
      )}

      {!!saleTax && (
        <SubTotalItem>
          <span>Total sale tax ({saleTax}%):</span>
          {totalSaleTax} {currency}
        </SubTotalItem>
      )}

      {!!shippingFee && (
        <SubTotalItem>
          <span>Shipping fee:</span>
          {shippingFee ? `${shippingFee} ${currency}` : 'Free'}
        </SubTotalItem>
      )}

      <TotalItem $showTopBorder={!hasSaleTaxOrShippingFees}>
        <span>Total:</span>
        <strong>
          {totalWithSaleTax} {currency}
        </strong>
      </TotalItem>
    </>
  );
};

export const CartTotal = () => {
  const { totalPrice, totalSaleTax, totalWithSaleTax, cartItems, shippingFee } =
    useCart();

  const { currency } = useCurrency();

  if (!cartItems.length) {
    return null;
  }

  return (
    <CartTotalWrapper>
      <CartSummary
        totalPrice={totalPrice}
        totalSaleTax={totalSaleTax}
        totalWithSaleTax={totalWithSaleTax}
        currency={currency}
        shippingFee={shippingFee}
      />

      <Button fullWidth to={routes.store.cart}>
        Checkout
      </Button>
    </CartTotalWrapper>
  );
};
