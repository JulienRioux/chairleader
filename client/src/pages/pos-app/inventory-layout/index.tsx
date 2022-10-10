import { StoreImgIcon } from 'components';
import {
  Button,
  ChildWrapper,
  Icon,
  UnstyledButton,
  UnstyledLink,
} from 'components-library';
import { Cart } from 'components/cart';
import { ConnectWalletBtn } from 'components/connect-wallet-btn';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useStore } from 'hooks/store';
import { ToggleTheme } from 'pages/homepage';
import { ReactNode, useCallback, useState, useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { routes } from 'utils';
import { useMediaQuery } from 'hooks/media-query';
import { useTheme } from 'hooks/theme';
import { drawerIn, fadeIn, fadeOut, drawerOut } from 'utils/keyframes';

const AMINATION_DURATION = 300;

const TopNavWrapper = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  height: 44px;
`;

const TopNav = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  position: sticky;
  top: 0;
  background: ${(p) => p.theme.color.background};
  z-index: 9;
`;

const LogoAndLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(UnstyledLink)<{ isActive?: boolean }>`
  margin: 0 8px;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: 0.2s;

  :active {
    transform: translateY(3px);
  }

  ${(p) =>
    p.isActive &&
    css`
      color: ${p.theme.color.primary};
      background-color: ${p.theme.color.primary}11;
    `}
`;

const ChildrenWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  padding: 12px;
`;

const StoreImgAndName = styled(UnstyledLink)`
  display: flex;
  align-items: center;
  overflow: hidden;

  :active {
    transform: translateY(3px);
  }
`;

const ContentWrapper = styled.div``;

const CartWrapper = styled.div<{ isClosing: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  border-left: 1px solid ${(p) => p.theme.color.lightGrey};
  height: 100vh;
  width: 480px;
  max-width: 100%;
  z-index: 12;
  background: ${(p) => p.theme.color.background};

  animation: ${AMINATION_DURATION}ms ${drawerIn};

  ${(p) =>
    p.isClosing &&
    css`
      animation: ${AMINATION_DURATION}ms ${drawerOut};
    `}
`;

const CartBackdrop = styled.div<{ isClosing: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: ${(p) => p.theme.color.backdrop};

  animation: ${AMINATION_DURATION}ms ${fadeIn};

  ${(p) =>
    p.isClosing &&
    css`
      animation: ${AMINATION_DURATION}ms ${fadeOut};
    `}
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

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CartButtonWrapper = styled.div`
  position: relative;
`;

const CartItemsNumberBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: ${(p) => p.theme.color.primary};
  color: ${(p) => p.theme.color.buttonText};
  min-width: 18px;
  min-height: 18px;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`;

export const StoreLogo = ({ ...rest }) => {
  const { store } = useStore();

  return (
    <StoreImgAndName to={routes.store.base}>
      <StoreImgIcon
        image={store?.image}
        storeName={store?.storeName}
        {...rest}
      />
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

const MobileBottomMenu = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  min-height: 60px;
  background: ${(p) => p.theme.color.background};
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
  padding: 0 16px;

  display: none;
  @media (max-width: 1000px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const MobileMenuLabel = styled.div`
  font-size: 10px;
  margin-top: 2px;
`;

const MenuBtn = styled(UnstyledButton)<{ $isActive?: boolean }>`
  padding: 4px;
  font-size: 20px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  border-radius: ${(p) => p.theme.borderRadius.default};
  height: 48px;
  width: 48px;

  ${(p) =>
    p.$isActive &&
    css`
      color: ${p.theme.color.primary};
      background: ${p.theme.color.primary}11;
    `}
`;

const MobileMenu = ({
  handleToggleModal,
}: {
  handleToggleModal: () => void;
}) => {
  const { cartItemsNumber } = useCart();
  const { toggleTheme, isDarkTheme } = useTheme();

  const isOnInventoryPage = useMatch(routes.store.inventory);
  const isOnProductPage = useMatch(`${routes.store.inventory}/:productId`);

  const productsBtnIsActive = !!(isOnInventoryPage || isOnProductPage);

  const isOnNftsPage = useMatch(routes.store.nfts);
  const isOnSingleNftPage = useMatch(`${routes.store.nfts}/:address`);

  const nftsBtnIsActive = !!(isOnNftsPage || isOnSingleNftPage);

  return (
    <MobileBottomMenu>
      <UnstyledLink to={routes.store.inventory}>
        <MenuBtn $isActive={productsBtnIsActive}>
          <Icon name="house" />
          <MobileMenuLabel>Products</MobileMenuLabel>
        </MenuBtn>
      </UnstyledLink>

      <UnstyledLink to={routes.store.nfts}>
        <MenuBtn $isActive={nftsBtnIsActive}>
          <Icon name="grid_view" />
          <MobileMenuLabel>NFTs</MobileMenuLabel>
        </MenuBtn>
      </UnstyledLink>

      <MenuBtn onClick={toggleTheme}>
        <Icon name={isDarkTheme ? 'light_mode' : 'dark_mode'} />
        <MobileMenuLabel>Switch</MobileMenuLabel>
      </MenuBtn>

      <MenuBtn onClick={handleToggleModal}>
        <Icon name="shopping_bag" />
        <MobileMenuLabel>Cart</MobileMenuLabel>

        {!!cartItemsNumber && (
          <CartItemsNumberBadge>{cartItemsNumber}</CartItemsNumberBadge>
        )}
      </MenuBtn>
    </MobileBottomMenu>
  );
};

const CartPreview = ({
  handleToggleModal,
}: {
  handleToggleModal: () => void;
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleToggleCartPreview = useCallback(() => {
    setTimeout(() => {
      setIsClosing(false);
      handleToggleModal();
    }, AMINATION_DURATION);
    document.body.style.overflow = 'unset';
    setIsClosing(true);
  }, [handleToggleModal]);

  useEffect(() => {
    // Stop scrolling when the modal open
    document.body.style.overflow = 'hidden';

    // Cleanup the body overflow style on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <CartWrapper isClosing={isClosing}>
        <Cart onCloseClick={handleToggleCartPreview} />
      </CartWrapper>
      <CartBackdrop isClosing={isClosing} onClick={handleToggleCartPreview} />
    </>
  );
};

export const InventoryLayout = ({ children }: { children: ReactNode }) => {
  const hasMobileNavBar = useMediaQuery('(max-width: 1000px)');

  const { cartItemsNumber } = useCart();

  const [showCartPreview, setShowCartPreview] = useState(false);

  const isOnHomepage = useMatch(routes.store.base);

  const isNotOnInventoryPage = !useMatch(routes.store.inventory);
  const isNotOnNftsPage = !useMatch(routes.store.nfts);

  const handleToggleModal = useCallback(() => {
    setShowCartPreview(!showCartPreview);
  }, [showCartPreview]);

  const isOnNftsPage = useMatch(routes.store.nfts);
  const isOnSingleNftPage = useMatch(`${routes.store.nfts}/:address`);

  const nftsLinkIsActive = !!(isOnNftsPage || isOnSingleNftPage);

  const isOnProductsPage = useMatch(routes.store.inventory);
  const isOnSingleProductPage = useMatch(
    `${routes.store.inventory}/:productId`
  );

  const productsLinkActive = !!(isOnProductsPage || isOnSingleProductPage);

  return (
    <div>
      <ContentWrapper>
        <LeftSideWrapper>
          <TopNavWrapper>
            <TopNav>
              <LogoAndLinks>
                <StoreLogo />

                {!hasMobileNavBar && (
                  <>
                    <NavLink
                      style={{ marginLeft: '20px' }}
                      to={routes.store.inventory}
                      isActive={productsLinkActive}
                    >
                      Products
                    </NavLink>

                    <NavLink to={routes.store.nfts} isActive={nftsLinkIsActive}>
                      NFTs
                    </NavLink>
                  </>
                )}
              </LogoAndLinks>
              <ButtonsWrapper>
                {!isOnHomepage && isNotOnInventoryPage && isNotOnNftsPage && (
                  <Button
                    style={{ marginRight: '8px' }}
                    secondary
                    icon="arrow_back"
                    to={-1}
                  />
                )}

                <ConnectWalletBtn />

                {!hasMobileNavBar && (
                  <>
                    <ToggleTheme />

                    <CartButtonWrapper>
                      <Button
                        secondary
                        style={{ marginLeft: '8px' }}
                        icon="shopping_bag"
                        onClick={handleToggleModal}
                      />
                      {!!cartItemsNumber && (
                        <CartItemsNumberBadge>
                          {cartItemsNumber}
                        </CartItemsNumberBadge>
                      )}
                    </CartButtonWrapper>
                  </>
                )}
              </ButtonsWrapper>
            </TopNav>
          </TopNavWrapper>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </LeftSideWrapper>

        {showCartPreview && (
          <CartPreview handleToggleModal={handleToggleModal} />
        )}
      </ContentWrapper>

      <MobileMenu handleToggleModal={handleToggleModal} />
    </div>
  );
};
