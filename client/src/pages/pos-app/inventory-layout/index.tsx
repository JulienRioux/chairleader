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

const TopNavWrapper = styled.div`
  padding: 8px 20px;
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

const PageTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-transform: capitalize;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChildrenWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  padding: 20px;
`;

const StoreImgAndName = styled(UnstyledLink)`
  display: flex;
  align-items: center;
  overflow: hidden;
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

  animation: 0.2s ${drawerIn};

  ${(p) =>
    p.isClosing &&
    css`
      animation: 0.2s ${drawerOut};
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

  animation: 0.2s ${fadeIn};

  ${(p) =>
    p.isClosing &&
    css`
      animation: 0.2s ${fadeOut};
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

const StyledStoreImgIcon = styled(StoreImgIcon)`
  margin-right: 12px;
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
  font-size: 12px;
  margin-top: 2px;
`;

const MenuBtn = styled(UnstyledButton)`
  padding: 4px;
  font-size: 20px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
`;

const MobileMenu = ({
  handleToggleModal,
}: {
  handleToggleModal: () => void;
}) => {
  const { cartItemsNumber } = useCart();
  const { toggleTheme, isDarkTheme } = useTheme();

  return (
    <MobileBottomMenu>
      <UnstyledLink to={routes.store.inventory}>
        <MenuBtn>
          <Icon name="house" />
          <MobileMenuLabel>Home</MobileMenuLabel>
        </MenuBtn>
      </UnstyledLink>

      <UnstyledLink to={routes.store.nfts}>
        <MenuBtn>
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

const AMINATION_DURATION = 200;

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

  const isNotOnInventoryPage = !useMatch(routes.store.inventory);
  const isNotOnNftsPage = !useMatch(routes.store.nfts);

  const isOnNftsPage = useMatch(routes.store.nfts);

  const isOnSingleNftPage = useMatch(`${routes.store.nfts}/:address`);

  const showNftsLink = !isOnNftsPage && !isOnSingleNftPage;

  const handleToggleModal = useCallback(() => {
    setShowCartPreview(!showCartPreview);
  }, [showCartPreview]);

  return (
    <div>
      <ContentWrapper>
        <LeftSideWrapper>
          <TopNavWrapper>
            <TopNav>
              <StoreLogo />
              <ButtonsWrapper>
                {isNotOnInventoryPage && isNotOnNftsPage && (
                  <Button
                    style={{ marginRight: '8px' }}
                    secondary
                    icon="arrow_back"
                    to={-1}
                  />
                )}

                {showNftsLink && !hasMobileNavBar && (
                  <Button
                    icon="grid_view"
                    style={{ marginRight: '8px' }}
                    to={routes.store.nfts}
                    secondary
                  >
                    NFTs
                  </Button>
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
