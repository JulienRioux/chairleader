import { StoreImgIcon } from 'components';
import { Button, Icon, UnstyledLink } from 'components-library';
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

  display: none;
  @media (max-width: 1000px) {
    display: inline-flex;
  }
`;

const InnerMobileCartBtn = styled.span`
  position: relative;
`;

const QtyBadge = styled.div`
  position: absolute;
  bottom: calc(100% + 4px);
  left: calc(100% + 4px);
  border: 1px solid ${(p) => p.theme.color.primary};
  background: ${(p) => p.theme.color.background};
  color: ${(p) => p.theme.color.primary};
  heigth: 14px;
  min-heigth: 14px;
  min-width: 14px;
  font-size: 14px;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
`;

const StyledStoreImgIcon = styled(StoreImgIcon)`
  margin-right: 12px;
`;

export const StoreLogo = () => {
  const { store } = useStore();
  console.log('store', store?.image);

  return (
    <StoreImgAndName to={routes.store.inventory}>
      <StyledStoreImgIcon image={store?.image} storeName={store?.storeName} />
      {/* <StoreImg src="http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/running-shoe.png" /> */}
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
      <InnerMobileCartBtn>
        {currency} {totalWithSaleTax}{' '}
        <Icon style={{ marginLeft: '8px' }} name="shopping_cart" />
        <QtyBadge>{cartItemsNumber}</QtyBadge>
      </InnerMobileCartBtn>
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
            <div>
              <ToggleTheme />

              {isNotOnInventoryPage ? (
                <Button secondary icon="arrow_back" to={-1} />
              ) : (
                <Button secondary icon="search" to={routes.store.search} />
              )}
            </div>
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
