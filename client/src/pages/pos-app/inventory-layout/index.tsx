import { Footer, StoreImgIcon } from 'components';
import {
  Button,
  ChildWrapper,
  Icon,
  UnstyledButton,
  UnstyledExternalLink,
  UnstyledLink,
} from 'components-library';
import { Cart } from 'components/cart';
import { ConnectWalletBtn } from 'components/connect-wallet-btn';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useStore } from 'hooks/store';
import { AppLogo } from 'pages/homepage';
import { ReactNode, useCallback, useState, useEffect } from 'react';
import { Link, useMatch, useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { routes } from 'utils';
import { useMediaQuery } from 'hooks/media-query';
import {
  drawerIn,
  fadeIn,
  fadeOut,
  drawerOut,
  scaleIn,
  numberSlideIn,
  launchIconSlide,
} from 'utils/keyframes';
import { SocialMediaIcons } from '../store-homepage';
import {
  StoreBannerSkeleton,
  StoreInfoSkeleton,
} from './store-banner-skeleton';

const AMINATION_DURATION = 500;

const TopNavWrapper = styled.div`
  padding: 8px 12px 0;
  background: ${(p) => p.theme.color.background}66;
  backdrop-filter: blur(4px);
  z-index: 9;
`;

const TopNav = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  min-height: 40px;
`;

const ChildrenWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  padding: 12px;
`;

const ChildrenContentWrapper = styled.div<{ $addPadding: boolean }>`
  ${(p) => p.$addPadding && `margin: 40px 0 60px;`}

  min-height: 500px;
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
  width: 480px;
  max-width: 100%;
  max-height: 100%;
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
  @media (max-width: 800px) {
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
  @media (max-width: 800px) {
    display: inline-flex;
  }
`;

const FloatingCartButtonWrapper = styled.div`
  position: sticky;
  bottom: 8px;
  left: 0;
  right: 0;
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  pointer-events: none;
`;

const CartButtonWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
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

  /* animation: 0.2s ${scaleIn} forwards;

  span {
    overflow: hidden;
    animation: 0.4s ${numberSlideIn} forwards;
  } */
`;

const LaunchWrapper = styled.div`
  margin-left: 8px;
  opacity: 0;
  transition: 0.2s;
`;

const AppLogoWrapper = styled(UnstyledExternalLink)`
  display: flex;
  align-items: center;

  :hover {
    ${LaunchWrapper} {
      animation: 0.4s ${launchIconSlide} forwards;
    }
  }
`;

const BackButton = styled(Button)`
  color: ${(p) => p.theme.color.text};
  border: none;

  :hover {
    background: ${(p) => p.theme.color.text}11;
  }
`;

export const StoreLogo = ({ ...rest }) => {
  const { store } = useStore();
  const [searchParams] = useSearchParams();

  const previewStoreName = searchParams.get('preview_store_name');
  const previewStoreLogo = searchParams
    .get('preview_store_logo')
    ?.replaceAll(' ', '+');

  return (
    <StoreImgAndName to={routes.store.base}>
      <StoreImgIcon
        image={previewStoreLogo ? previewStoreLogo : store?.image}
        storeName={previewStoreName ? previewStoreName : store?.storeName}
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
  @media (max-width: 800px) {
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
  width: 64px;

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

  const isOnInventoryPage = useMatch(routes.store.inventory);
  const isOnProductPage = useMatch(`${routes.store.inventory}/:productId`);

  const productsBtnIsActive = !!(isOnInventoryPage || isOnProductPage);

  const isOnNftsPage = useMatch(routes.store.nfts);
  const isOnSingleNftPage = useMatch(`${routes.store.nfts}/:address`);

  const contactLinkIsActive = !!useMatch(routes.store.contact);

  const nftsBtnIsActive = !!(isOnNftsPage || isOnSingleNftPage);

  return (
    <MobileBottomMenu>
      <UnstyledLink to={routes.store.inventory}>
        <MenuBtn $isActive={productsBtnIsActive}>
          <Icon name="storefront" />
          <MobileMenuLabel>Products</MobileMenuLabel>
        </MenuBtn>
      </UnstyledLink>

      <UnstyledLink to={routes.store.nfts}>
        <MenuBtn $isActive={nftsBtnIsActive}>
          <Icon name="card_membership" />
          <MobileMenuLabel>Memberships</MobileMenuLabel>
        </MenuBtn>
      </UnstyledLink>

      <UnstyledLink to={routes.store.contact}>
        <MenuBtn $isActive={contactLinkIsActive}>
          <Icon name="send" />
          <MobileMenuLabel>Contact</MobileMenuLabel>
        </MenuBtn>
      </UnstyledLink>

      <MenuBtn onClick={handleToggleModal}>
        <Icon name="shopping_bag" />
        <MobileMenuLabel>Cart</MobileMenuLabel>

        {!!cartItemsNumber && (
          <CartItemsNumberBadge>
            <span key={`cart_items_total${cartItemsNumber}`}>
              {cartItemsNumber}
            </span>
          </CartItemsNumberBadge>
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
  const { isLoading } = useStore();

  const hasMobileNavBar = useMediaQuery('(max-width: 800px)');

  const { cartItemsNumber } = useCart();

  const [showCartPreview, setShowCartPreview] = useState(false);

  const isOnHomepage = useMatch(routes.store.base);

  const isNotOnInventoryPage = !useMatch(routes.store.inventory);
  const isNotOnNftsPage = !useMatch(routes.store.nfts);

  const handleToggleModal = useCallback(() => {
    setShowCartPreview(!showCartPreview);
  }, [showCartPreview]);

  const isOnSingleProductPage = useMatch(
    `${routes.store.inventory}/:productId`
  );

  const isOnProductPage = useMatch(`${routes.store.inventory}/:productId`);

  return (
    <div>
      <ContentWrapper>
        <LeftSideWrapper>
          <TopNavWrapper>
            <TopNav>
              {!isOnProductPage ? (
                <AppLogoWrapper href="https://chairleader.xyz/" target="_blank">
                  <AppLogo />
                  <LaunchWrapper>
                    <Icon name="launch" />
                  </LaunchWrapper>
                </AppLogoWrapper>
              ) : (
                <span />
              )}

              {!isOnHomepage && isNotOnInventoryPage && isNotOnNftsPage && (
                <BackButton secondary icon="arrow_back" to={-1} />
              )}
            </TopNav>
          </TopNavWrapper>

          <ChildrenWrapper>
            {!isOnSingleProductPage && <NewStoreBannerUi />}

            <ChildrenContentWrapper $addPadding={!isOnProductPage}>
              {children}

              {!isLoading && !hasMobileNavBar && !isNotOnInventoryPage && (
                <FloatingCartButtonWrapper>
                  <CartButtonWrapper>
                    <Button
                      secondary
                      style={{ marginLeft: '8px', pointerEvents: 'auto' }}
                      icon="shopping_bag"
                      onClick={handleToggleModal}
                    >
                      View cart
                    </Button>
                    {!!cartItemsNumber && (
                      <CartItemsNumberBadge>
                        <span key={`cart_items_total${cartItemsNumber}`}>
                          {cartItemsNumber}
                        </span>
                      </CartItemsNumberBadge>
                    )}
                  </CartButtonWrapper>
                </FloatingCartButtonWrapper>
              )}
            </ChildrenContentWrapper>

            {!isOnSingleProductPage && !hasMobileNavBar && <Footer isStore />}
          </ChildrenWrapper>
        </LeftSideWrapper>

        {showCartPreview && (
          <CartPreview handleToggleModal={handleToggleModal} />
        )}
      </ContentWrapper>

      <MobileMenu handleToggleModal={handleToggleModal} />
    </div>
  );
};

const BannerImg = styled.img`
  width: 100%;
  aspect-ratio: 3 / 1;
  border-radius: ${(p) => p.theme.borderRadius.default};
  background: ${(p) => p.theme.color.lightGrey};
  object-position: center;
  object-fit: cover;
  image-rendering: pixelated;
  border: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const StoreImg = styled.img`
  width: 128px;
  height: 128px;
  aspect-ratio: 3 / 1;
  border-radius: ${(p) => p.theme.borderRadius.default};
  background: ${(p) => p.theme.color.lightGrey};
  object-position: center;
  object-fit: cover;
  image-rendering: pixelated;
  border: 1px solid ${(p) => p.theme.color.white}88;

  @media (max-width: 800px) {
    width: 80px;
    height: 80px;
  }
`;

export const StoreName = styled.h1`
  margin: 0;
  font-size: 32px;
  display: flex;
  align-items: center;

  @media (max-width: 800px) {
    font-size: 24px;
  }
`;

export const StoreInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const VerifiedIconWrapper = styled.span`
  color: #1d9cea;
  font-size: 24px;
  margin: 0 0 0px 12px;

  @media (max-width: 800px) {
    font-size: 20px;
  }
`;

const LinksWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0 0;
  position: sticky;
  top: 0;
  z-index: 1;
  background: ${(p) => p.theme.color.background}cc;
  backdrop-filter: blur(4px);
  overflow-x: scroll;
  overflow-y: hidden;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};

  @media (max-width: 800px) {
    display: none;
  }
`;

const LeftLinks = styled.div`
  display: flex;
`;

const NavLink = styled.span<{ isActive?: boolean }>`
  margin: 0;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  transition: 0.4s;
  color: ${(p) => p.theme.color.text};
  margin: 4px;
  border-radius: ${(p) => p.theme.borderRadius.default};

  :active {
    transform: translateY(3px);
  }

  ${(p) =>
    !p.isActive &&
    css`
      background: transparent;
    `}
`;

const NavLinkWrapper = styled(Link)<{ isActive?: boolean; to: any }>`
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  text-decoration: none;

  ${(p) =>
    p.isActive &&
    css`
      color: ${p.theme.color.primary};
      border-color: ${p.theme.color.primary};
    `}

  :hover {
    ${NavLink} {
      ${(p) =>
        !p.isActive &&
        css`
          background: ${(p) => p.theme.color.text}11;
        `}
    }
  }
`;

const BannerWrapper = styled.div`
  position: relative;
`;

const ImgWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
`;

const SocialMediaIconsWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

const Description = styled.p`
  line-height: 1.4;
  color: ${(p) => p.theme.color.lightText};
`;

const decodeURIComponentSafe = (s: string) => {
  if (!s) {
    return s;
  }
  return decodeURIComponent(s.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25'));
};

const NewStoreBannerUi = () => {
  const { store, isLoading } = useStore();

  const [storeName, setStoreName] = useState(store?.storeName);
  const [storeLogo, setStoreLogo] = useState(store?.image);
  const [title, setTitle] = useState(store?.homepage?.heroTitle);
  const [imgSrc, setImgSrc] = useState(store?.homepage?.heroImage);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const previewStoreName = searchParams.get('preview_store_name');
    if (previewStoreName) {
      setStoreName(decodeURIComponentSafe(previewStoreName));
    }
    const homepageTitle = searchParams.get('homepage_title');
    if (homepageTitle) {
      // ??? 👟 Multiverse next gen sneakers ☁️ Bubble air comfort 💚 100% Vegan
      setTitle(decodeURIComponentSafe(homepageTitle));
    }
    const homepageHeroImg = searchParams.get('homepage_hero_img');
    if (homepageHeroImg) {
      setImgSrc(decodeURIComponentSafe(homepageHeroImg).replaceAll(' ', '+'));
    }
    const previewStoreLogo = searchParams
      .get('preview_store_logo')
      ?.replaceAll(' ', '+');
    if (previewStoreLogo) {
      setStoreLogo(
        decodeURIComponentSafe(previewStoreLogo).replaceAll(' ', '+')
      );
    }
  }, [searchParams]);

  const isOnNftsPage = useMatch(routes.store.nfts);
  const isOnSingleNftPage = useMatch(`${routes.store.nfts}/:address`);

  const nftsLinkIsActive = !!(isOnNftsPage || isOnSingleNftPage);

  const isOnProductsPage = useMatch(routes.store.inventory);
  const isOnSingleProductPage = useMatch(
    `${routes.store.inventory}/:productId`
  );
  const contactLinkIsActive = !!useMatch(routes.store.contact);

  const profileLinkIsActive = !!useMatch(routes.store.profile);

  const isOnConfirmationPage = !!useMatch(
    `${routes.store.confirmation}/:orderId`
  );

  const productsLinkActive = !!(isOnProductsPage || isOnSingleProductPage);

  return (
    <>
      <div>
        {isLoading ? (
          <StoreBannerSkeleton />
        ) : (
          <BannerWrapper>
            <BannerImg src={imgSrc} />

            <ImgWrapper>
              <StoreImg src={storeLogo} />
            </ImgWrapper>

            <SocialMediaIconsWrapper>
              <SocialMediaIcons />
            </SocialMediaIconsWrapper>
          </BannerWrapper>
        )}
      </div>

      {isLoading ? (
        <StoreInfoSkeleton />
      ) : (
        <>
          <StoreInfoWrapper>
            <StoreName>
              <span>{storeName}</span>
              <VerifiedIconWrapper>
                {/* Simple hack for now... */}
                {store.subDomain === 'store' && <Icon name="verified" />}
              </VerifiedIconWrapper>
            </StoreName>

            <ConnectWalletBtn />
          </StoreInfoWrapper>

          <Description>{title}</Description>
        </>
      )}

      <LinksWrapper>
        <LeftLinks>
          <NavLinkWrapper
            isActive={productsLinkActive}
            to={routes.store.inventory}
          >
            <NavLink isActive={productsLinkActive}>Products</NavLink>
          </NavLinkWrapper>

          <NavLinkWrapper isActive={nftsLinkIsActive} to={routes.store.nfts}>
            <NavLink isActive={nftsLinkIsActive}>NFT memberships</NavLink>
          </NavLinkWrapper>

          <NavLinkWrapper
            isActive={profileLinkIsActive}
            to={routes.store.profile}
          >
            <NavLink isActive={profileLinkIsActive}>Profile</NavLink>
          </NavLinkWrapper>

          <NavLinkWrapper
            isActive={contactLinkIsActive}
            to={routes.store.contact}
          >
            <NavLink isActive={contactLinkIsActive}>Contact</NavLink>
          </NavLinkWrapper>
        </LeftLinks>

        {(isOnSingleNftPage || isOnConfirmationPage) && (
          <NavLinkWrapper to={-1}>
            <NavLink>
              <Icon name="arrow_back" />
            </NavLink>
          </NavLinkWrapper>
        )}
      </LinksWrapper>
    </>
  );
};
