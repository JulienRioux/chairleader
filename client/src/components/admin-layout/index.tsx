import { Button, UnstyledLink } from 'components-library';
import { USE_CATEGORY } from 'configs';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { routes } from 'utils';
import { ToggleTheme } from 'pages/homepage';
import { useMediaQuery } from 'hooks/media-query';
import { useAuth } from 'hooks/auth';

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

  @media (max-width: 800px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 4px 20px;
  }
`;

const SideNav = styled.div`
  height: 100vh;
  border-right: 1px solid ${(p) => p.theme.color.lightGrey};
  position: sticky;
  top: 0;

  @media (max-width: 800px) {
    height: auto;
    border-right: none;
    border-top: 1px solid ${(p) => p.theme.color.lightGrey};
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${(p) => p.theme.color.background};
    z-index: 9;
  }
`;

const ChildrenWrapper = styled.div`
  margin: 20px;

  @media (max-width: 800px) {
    /* Taking into account the bottom navigation */
    margin-bottom: 80px;
  }
`;

const SideNavWrapper = styled.div`
  margin-bottom: 12px;

  @media (max-width: 800px) {
    margin: 0;
  }
`;

const SideNavLink = styled(Button)<{ isActive?: boolean }>`
  background: ${(p) => p.theme.color.background};
  color: ${(p) => p.theme.color.text};
  border: none;
  font-size: 20px;
  ${(p) =>
    p.isActive &&
    css`
      color: ${(p) => p.theme.color.primary};
      background: ${(p) => p.theme.color.primary}18;
    `}
`;

const SharedStyles = css`
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 2px solid ${(p) => p.theme.color.lightGrey};
  width: 40px;
  height: 40px;
  transition: 0.2s;
`;

const StoreImg = styled.img`
  ${SharedStyles}
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

const StoreImgLink = styled(UnstyledLink)``;

const TopNav = styled.div`
  padding: 8px 20px;
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
  overflow: scroll;
  width: 100%;
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
      <StoreImg src={image} {...props} />
    ) : (
      <NoImgStore {...props}>{storeName ? storeName[0] : ''}</NoImgStore>
    )}
  </>
);

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const isMobileView = useMediaQuery('(max-width: 800px)');
  const { user } = useAuth();

  const pageTitle = pathname
    .replace('/admin/', '')
    .replaceAll('-', ' ')
    .replace('/', ' / ');

  return (
    <AdminLayoutWrapper>
      <SideNav>
        <InnerSideNav>
          <SideNavWrapper>
            <StoreImgLink to={routes.admin.myStore}>
              <StoreImgIcon image={user?.image} storeName={user?.storeName} />
            </StoreImgLink>
          </SideNavWrapper>

          <SideNavWrapper>
            <SideNavLink
              to={routes.admin.inventory}
              isActive={pathname === routes.admin.inventory}
              icon="inventory_2"
            />
          </SideNavWrapper>

          <SideNavWrapper>
            <SideNavLink
              to={routes.admin.payments}
              icon="receipt_long"
              isActive={pathname === routes.admin.payments}
            />
          </SideNavWrapper>

          <SideNavWrapper>
            <SideNavLink
              to={routes.admin.pos}
              icon="point_of_sale"
              isActive={pathname === routes.admin.pos}
            />
          </SideNavWrapper>
        </InnerSideNav>
      </SideNav>
      <RightLayoutWrapper>
        <TopNav>
          <PageTitle>{pageTitle}</PageTitle>

          <RightButtonWrapper>
            <ToggleTheme />

            {USE_CATEGORY && (
              <Button
                secondary
                to={routes.admin.newCategory}
                style={{ marginRight: '8px' }}
              >
                Add category
              </Button>
            )}

            <Button
              to={routes.admin.newProduct}
              style={{ marginRight: '8px' }}
              icon={isMobileView ? 'add' : undefined}
            >
              {isMobileView ? '' : 'Add product'}
            </Button>

            <Button secondary icon="search" to={routes.admin.search} />
          </RightButtonWrapper>
        </TopNav>
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </RightLayoutWrapper>
    </AdminLayoutWrapper>
  );
};
