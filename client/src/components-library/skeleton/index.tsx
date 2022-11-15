import { cartItemImgSharedStyles } from 'components/cart-item';
import styled, { css } from 'styled-components';
import { flashingAnimation } from 'utils/keyframes';

export const skeletonSharedStyles = css`
  background: ${(p) => p.theme.color.text}22;
  border-radius: ${(p) => p.theme.borderRadius.default};
  border-color: transparent;

  animation: 1.6s ${flashingAnimation} infinite linear;
`;

const CartItemSkeletonWrapper = styled.div``;

const CartItemSkeletonImg = styled.div`
  ${cartItemImgSharedStyles}

  width: 100%;

  ${skeletonSharedStyles}
`;

const CartItemSkeletonTitle = styled.div`
  height: 21px;
  margin: 8px 0;
  width: 60%;
  border-radius: ${(p) => p.theme.borderRadius.default};

  ${skeletonSharedStyles};
`;

const CartItemSkeletonPrice = styled.div`
  height: 21px;
  width: 40%;

  ${skeletonSharedStyles};
`;

export const CartItemSkeletonComponent = () => {
  return (
    <CartItemSkeletonWrapper>
      <CartItemSkeletonImg />

      <CartItemSkeletonTitle />

      <CartItemSkeletonPrice />
    </CartItemSkeletonWrapper>
  );
};

export const CartItemSkeleton = ({ length = 12 }) => {
  return (
    <>
      {Array.from({ length }, (_, i) => (
        <CartItemSkeletonComponent key={`${i + 1}_CartItemSkeleton`} />
      ))}
    </>
  );
};
