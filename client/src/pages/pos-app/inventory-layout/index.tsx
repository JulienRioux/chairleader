import { StoreImgIcon } from 'components';
import { Button, ChildWrapper, Icon, UnstyledLink } from 'components-library';
import { Cart } from 'components/cart';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useStore } from 'hooks/store';
import { ToggleTheme } from 'pages/homepage';
import { ReactNode } from 'react';
import { useMatch } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from 'utils';

const TopNav = styled.div`
  padding: 8px 20px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  position: sticky;
  top: 0;
  background: ${(p) => p.theme.color.background};
  z-index: 9;
`;

const PageTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-transform: capitalize;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChildrenWrapper = styled.div`
  margin: 20px;
`;

const StoreImgAndName = styled(UnstyledLink)`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 480px;

  @media (max-width: 1000px) {
    display: flex;
  }
`;

const CartWrapper = styled.div`
  position: sticky;
  top: 0;
  border-left: 1px solid ${(p) => p.theme.color.lightGrey};
  height: 100vh;

  @media (max-width: 1000px) {
    display: none;
  }
`;

const LeftSideWrapper = styled.div`
  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const MobileCartFixedBtn = styled(Button)`
  position: fixed;
  bottom: 8px;
  right: 8px;
  z-index: 9;
  width: calc(100% - 16px);

  ${ChildWrapper} {
    justify-content: space-between;
    width: 100%;
  }

  display: none;
  @media (max-width: 1000px) {
    display: inline-flex;
  }
`;

const StyledStoreImgIcon = styled(StoreImgIcon)`
  margin-right: 12px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const StoreLogo = () => {
  const { store } = useStore();

  return (
    <StoreImgAndName to={routes.store.inventory}>
      <StyledStoreImgIcon image={store?.image} storeName={store?.storeName} />
      <PageTitle>{store?.storeName}</PageTitle>
    </StoreImgAndName>
  );
};

const MobileCartBtn = () => {
  const { totalWithSaleTax, cartItems, cartItemsNumber } = useCart();
  const { currency } = useCurrency();
  const isOnProductPage = useMatch(`${routes.store.inventory}/:productId`);

  if (!cartItems.length || isOnProductPage) {
    return null;
  }

  return (
    <MobileCartFixedBtn to={routes.store.cart}>
      <span>{cartItemsNumber} items</span>
      <span>
        {currency} {totalWithSaleTax}
      </span>
    </MobileCartFixedBtn>
  );
};

export const InventoryLayout = ({ children }: { children: ReactNode }) => {
  const isNotOnInventoryPage = !useMatch(routes.store.inventory);

  return (
    <div>
      <ContentWrapper>
        <LeftSideWrapper>
          <TopNav>
            <StoreLogo />
            <ButtonsWrapper>
              {isNotOnInventoryPage && (
                <Button
                  style={{ marginRight: '8px' }}
                  secondary
                  icon="arrow_back"
                  to={-1}
                />
              )}
              <ToggleTheme />
            </ButtonsWrapper>
          </TopNav>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </LeftSideWrapper>

        <CartWrapper>
          <Cart />
        </CartWrapper>
      </ContentWrapper>

      <MobileCartBtn />
    </div>
  );
};
