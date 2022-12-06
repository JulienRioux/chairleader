import {
  Button,
  Icon,
  UnstyledExternalLink,
  UnstyledLink,
  Loader,
} from 'components-library';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import styled, { css, useTheme } from 'styled-components';
import { Logger, routes } from 'utils';
import { ToggleTheme } from 'pages/homepage';
import { useAuth } from 'hooks/auth';
import { ConnectWalletBtn } from 'components/connect-wallet-btn';
import { useMediaQuery } from 'hooks/media-query';

export const AdminLayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const InnerSideNav = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const SideNav = styled.div`
  height: 100vh;
  border-right: 1px solid ${(p) => p.theme.color.lightGrey};
  position: sticky;
  top: 0;
  width: 260px;
  background: ${(p) => p.theme.color.background};

  @media (max-width: 800px) {
    position: fixed;
    z-index: 9999999999;
    width: 100%;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const SideNavLabel = styled.div`
  margin-left: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ChildrenWrapper = styled.div`
  margin: 20px;
  /* Taking into account send feedback button */
  margin-bottom: 60px;

  @media (max-width: 800px) {
    /* Taking into account the bottom navigation + send feedback button */
    margin-bottom: 100px;
  }
`;

const SideNavWrapper = styled(UnstyledLink)<{ $isActive?: boolean }>`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  border-radius: ${(p) => p.theme.borderRadius.default};

  ${(p) =>
    p.$isActive &&
    css`
      color: ${(p) => p.theme.color.primary};
      background: ${(p) => p.theme.color.primary}18 !important;
    `}

  :hover {
    background: ${(p) => p.theme.color.black}11;
  }
`;

const StoreImageWapper = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  height: 44px;

  /* @media (max-width: 800px) {
    display: none;
  } */
`;

const SideNavIconWrapper = styled.div`
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SharedStyles = css`
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: ${(p) => p.theme.borderWidth} solid ${(p) => p.theme.color.lightGrey};
  width: 40px;
  height: 40px;
  transition: 0.2s;
`;

const StoreImg = styled.img`
  object-fit: cover;
  image-rendering: pixelated;

  ${SharedStyles}

  width: 38px;
  height: 38px;
`;

const NoImgStore = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: ${(p) => p.theme.color.text};

  ${SharedStyles};
`;

const TopNav = styled.div`
  padding: 4px 12px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PageTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-transform: capitalize;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 12px;
`;

const RightButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const RightLayoutWrapper = styled.div`
  width: calc(100vw - 261px);

  @media (max-width: 800px) {
    width: 100vw;
  }
`;

const SendFeedbackLink = styled(UnstyledExternalLink)`
  position: fixed;
  bottom: 8px;
  right: 8px;

  bottom: 20px;
  right: 80px;
`;

const CloseBtnWrapper = styled.div`
  display: none;

  @media (max-width: 800px) {
    margin: 20px;
    display: block;
  }
`;

const MenuBtnWrapper = styled.div`
  display: none;
  margin-left: 8px;

  @media (max-width: 800px) {
    display: block;
  }
`;

const StoreImgIconWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  span {
    margin-left: 8px;
    font-weight: bold;
    font-size: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    /* @media (max-width: 800px) {
      display: none;
    } */
  }
`;

export const StoreImgIcon = ({
  image,
  storeName,
  ...props
}: {
  image?: string;
  storeName?: string;
}) => (
  <>
    {image ? (
      <StoreImgIconWrapper>
        <StoreImg src={image} {...props} />
        {storeName && <span>{storeName}</span>}
      </StoreImgIconWrapper>
    ) : (
      <NoImgStore {...props}>{storeName ? storeName[0] : ''}</NoImgStore>
    )}
  </>
);

const SIDE_NAV_ROUTE = [
  { route: routes.admin.inventory, icon: 'local_offer', label: 'Products' },
  {
    route: routes.admin.tokenGating,
    icon: 'card_membership',
    label: 'NFT memberships',
  },
  { route: routes.admin.loyalty, icon: 'favorite', label: 'Loyalty programs' },
  { route: routes.admin.payments, icon: 'receipt_long', label: 'Orders' },
  { route: routes.admin.dashboard, icon: 'equalizer', label: 'Dashboard' },
  { route: routes.admin.theme, icon: 'palette', label: 'Theme' },
  {
    route: routes.admin.shippingAndDelivery,
    icon: 'local_shipping',
    label: 'Shipping and delivery',
  },
  { route: routes.admin.myStore, icon: 'settings', label: 'Settings' },
  { route: routes.admin.pos, icon: 'shopping_bag', label: 'Open store' },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const { user, isLoading } = useAuth();
  const theme = useTheme();

  const isMobileView = useMediaQuery('(max-width: 800px)');

  const [showMenu, setShowMenu] = useState(false);

  const isOnProductPage = useMatch(`${routes.admin.inventory}/:productId`);
  const isOnInvoicePage = useMatch(`${routes.admin.payments}/:orderId`);
  const isOnNftPage = useMatch(`${routes.admin.tokenGating}/:address`);
  const isOnSelectRewardsPage = useMatch(
    `${routes.admin.tokenGating}/:address/rewards`
  );
  const isOnSelectExclusivitiesPage = useMatch(
    `${routes.admin.tokenGating}/:address/exclusivities`
  );

  const showBackButton =
    isOnProductPage ||
    isOnInvoicePage ||
    isOnNftPage ||
    isOnSelectRewardsPage ||
    isOnSelectExclusivitiesPage;

  const pageTitle = pathname
    .replace('/admin/', '')
    .replaceAll('-', ' ')
    .replaceAll('/', ' / ');

  useEffect(() => {
    if (!isMobileView && !showMenu) {
      setShowMenu(true);
    }
  }, [isMobileView, showMenu]);

  useEffect(() => {
    // Setting up intercom
    window.intercomSettings = {
      api_base: 'https://api-iam.intercom.io',
      app_id: process.env.REACT_APP_INTERCOM_APP_ID,
      name: user?.storeName,
      email: user?.email,
      store_id: user?._id,
      store_name: user?.storeName,
      store_subdomain: user?.subDomain,
      action_color: theme?.color?.primary ?? '#0185fe',
      background_color: theme?.color?.primary ?? '#0185fe',
    };
    window.Intercom('update');
  }, [user, theme]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AdminLayoutWrapper>
      {showMenu && (
        <SideNav>
          <InnerSideNav>
            <StoreImageWapper>
              <StoreImgIcon image={user?.image} storeName={user?.storeName} />
            </StoreImageWapper>

            {SIDE_NAV_ROUTE.map(({ icon, route, label }) => (
              <SideNavWrapper
                key={label}
                $isActive={pathname === route}
                to={route}
                onClick={() => isMobileView && setShowMenu(false)}
              >
                <SideNavIconWrapper>
                  <Icon name={icon} />
                </SideNavIconWrapper>

                <SideNavLabel>{label}</SideNavLabel>
              </SideNavWrapper>
            ))}
          </InnerSideNav>

          <CloseBtnWrapper>
            <div style={{ margin: '12px 0', textAlign: 'end' }}>
              <ToggleTheme />
            </div>

            <div style={{ marginBottom: '8px' }}>
              <ConnectWalletBtn fullWidth isAdmin />
            </div>

            <Button secondary fullWidth onClick={() => setShowMenu(false)}>
              Close
            </Button>
          </CloseBtnWrapper>
        </SideNav>
      )}

      <RightLayoutWrapper>
        <TopNav>
          <PageTitle>{pageTitle}</PageTitle>

          <RightButtonWrapper>
            {showBackButton && (
              <Button
                secondary
                icon="arrow_back"
                to={-1}
                style={{ marginRight: '8px' }}
              />
            )}

            {!isMobileView && (
              <>
                <ToggleTheme style={{ marginRight: '8px' }} />
                <span>
                  <ConnectWalletBtn isAdmin />
                </span>
              </>
            )}

            <MenuBtnWrapper>
              <Button icon="menu" secondary onClick={() => setShowMenu(true)} />
            </MenuBtnWrapper>
          </RightButtonWrapper>
        </TopNav>
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </RightLayoutWrapper>

      <SendFeedbackLink href="https://chairleader.canny.io/" target="_blank">
        <Button secondary>
          Send feedback <Icon style={{ marginLeft: '8px' }} name="launch" />
        </Button>
      </SendFeedbackLink>
    </AdminLayoutWrapper>
  );
};
