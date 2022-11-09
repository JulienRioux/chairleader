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

const AMINATION_DURATION = 500;

const TopNavWrapper = styled.div`
  padding: 8px 12px;
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
`;

const ChildrenWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
  padding: 12px;
`;

const ChildrenContentWrapper = styled.div`
  margin: 40px 0;
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
  const hasMobileNavBar = useMediaQuery('(max-width: 1000px)');

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

  return (
    <div>
      <ContentWrapper>
        <LeftSideWrapper>
          <TopNavWrapper>
            <TopNav>
              <AppLogoWrapper href="https://chairleader.xyz/" target="_blank">
                <AppLogo />
                <LaunchWrapper>
                  <Icon name="launch" />
                </LaunchWrapper>
              </AppLogoWrapper>

              {!isOnHomepage && isNotOnInventoryPage && isNotOnNftsPage && (
                <Button secondary icon="arrow_back" to={-1} />
              )}
            </TopNav>
          </TopNavWrapper>

          <ChildrenWrapper>
            {!isOnSingleProductPage && <NewStoreBannerUi />}

            <ChildrenContentWrapper>
              {children}

              {!hasMobileNavBar && !isNotOnInventoryPage && (
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

            {!isOnSingleProductPage && <Footer />}
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

const StoreName = styled.h1`
  margin: 0;
  font-size: 32px;
  display: flex;
  align-items: center;

  @media (max-width: 800px) {
    font-size: 24px;
  }
`;

const StoreInfoWrapper = styled.div`
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
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  margin: 20px 0 0;
  position: sticky;
  top: 0;
  z-index: 1;
  background: ${(p) => p.theme.color.background}cc;
  backdrop-filter: blur(4px);
  overflow-x: scroll;
  overflow-y: hidden;

  @media (max-width: 800px) {
    display: none;
  }
`;

const LeftLinks = styled.div`
  display: flex;
`;

const NavLink = styled(Link)<{ isActive?: boolean; to: any }>`
  margin: 0 0 -1px;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  transition: 0.4s;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  text-decoration: none;
  color: ${(p) => p.theme.color.text};

  :active {
    transform: translateY(3px);
  }

  :hover {
    ${(p) =>
      !p.isActive &&
      css`
        background: ${(p) => p.theme.color.text}11;
      `}
  }

  ${(p) =>
    p.isActive &&
    css`
      color: ${p.theme.color.primary};
      border-color: ${p.theme.color.primary};
    `}
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

const NewStoreBannerUi = () => {
  const { store } = useStore();

  const [title, setTitle] = useState(store?.homepage?.heroTitle);
  const [subTitle, setSubTitle] = useState(store?.homepage?.heroSubTitle);
  const [imgSrc, setImgSrc] = useState(store?.homepage?.heroImage);

  const [searchParams] = useSearchParams();

  console.log('imgSrc', imgSrc);

  useEffect(() => {
    const homepageTitle = searchParams.get('homepage_title');
    if (homepageTitle) {
      setTitle(decodeURIComponent(homepageTitle));
    }
    const homepageSubTitle = searchParams.get('homepage_sub_title');
    if (homepageSubTitle) {
      setSubTitle(decodeURIComponent(homepageSubTitle));
    }
    const homepageHeroImg = searchParams.get('homepage_hero_img');
    if (homepageHeroImg) {
      setImgSrc(decodeURIComponent(homepageHeroImg).replaceAll(' ', '+'));
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
        <BannerWrapper>
          <BannerImg src={imgSrc} />

          <ImgWrapper>
            <StoreImg src={store?.image} />
          </ImgWrapper>

          <SocialMediaIconsWrapper>
            <SocialMediaIcons />
          </SocialMediaIconsWrapper>
        </BannerWrapper>
      </div>

      <StoreInfoWrapper>
        <StoreName>
          <span>{store?.storeName}</span>
          <VerifiedIconWrapper>
            <Icon name="verified" />
          </VerifiedIconWrapper>
        </StoreName>

        <ConnectWalletBtn />
      </StoreInfoWrapper>

      <Description>{store?.homepage?.heroTitle}</Description>

      <LinksWrapper>
        <LeftLinks>
          <NavLink to={routes.store.inventory} isActive={productsLinkActive}>
            Products
          </NavLink>

          <NavLink to={routes.store.nfts} isActive={nftsLinkIsActive}>
            NFT memberships
          </NavLink>

          <NavLink to={routes.store.profile} isActive={profileLinkIsActive}>
            Profile
          </NavLink>

          <NavLink to={routes.store.contact} isActive={contactLinkIsActive}>
            Contact
          </NavLink>
        </LeftLinks>

        {(isOnSingleNftPage || isOnConfirmationPage) && (
          <NavLink to={-1}>
            <Icon name="arrow_back" />
          </NavLink>
        )}
      </LinksWrapper>
    </>
  );
};

const FooterWrapper = styled.div`
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const StoreFooter = () => {
  return <FooterWrapper>footer</FooterWrapper>;
};
