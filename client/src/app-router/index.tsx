import { AdminLayout } from 'components';
import { HIDE_APP, USE_CATEGORY } from 'configs';
import { CategoryForm } from 'pages/admin-pages/category-form';
import { InventoryPage } from 'pages/admin-pages/inventory-page';
import { PaymentsPage } from 'pages/admin-pages/payments-page';
import { PointOfSalePage } from 'pages/admin-pages/point-of-sale-page';
import { ProductForm } from 'pages/admin-pages/product-form';
import { UserPage } from 'pages/admin-pages/user-page';
import { AuthPage } from 'pages/auth-page';
import { CompleteSignupPage } from 'pages/complete-signup-page';
import { ErrorPage } from 'pages/error-page';
import { Homepage } from 'pages/homepage';
import { NftApp, StoreApp } from 'pages/pos-app';
import { VerifyCodePage } from 'pages/verify-code-page';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from 'utils';
import { CartPage } from 'pages/cart-page';
import { CartProvider } from 'hooks/cart';
import { CurrencyProvider } from 'hooks/currency';
import { InvoicePage } from 'pages/admin-pages/invoice-page';
import { StoreNotFoundPage } from 'pages/store-not-found-page';
import { Loader } from 'components-library';
import { useStore } from 'hooks/store';
import { DashboardPage } from 'pages/admin-pages/dashboard-page';
import { CartPaymentPage } from 'pages/cart-payment-page';
import { StaticPage } from 'pages/static-page/inex';
import { PricingPage } from 'pages/pricing-page';
import { SolanaPayProviders } from 'contexts/solana-pay';
import { TokenGating } from 'pages/admin-pages/token-gating';
import { TokenGatingNft } from 'pages/admin-pages/token-gating-nft';
import { ConfirmationPage } from 'pages/confirmation-page';
import { ProfilePage } from 'pages/profile-page';
import { StoreHomepage } from 'pages/pos-app/store-homepage';
import { ThemePage } from 'pages/admin-pages/theme-page';

export const AdminAppRouter = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path={'/inventory'} element={<InventoryPage />} />

        <Route path={'/inventory/:productId'} element={<ProductForm />} />

        <Route path={'/payments'} element={<PaymentsPage />} />

        <Route path={'/payments/:orderId'} element={<InvoicePage />} />

        <Route path={'/point-of-sale'} element={<PointOfSalePage />} />

        <Route path={'/my-store'} element={<UserPage />} />

        <Route path={'/new-product'} element={<ProductForm />} />

        <Route path={'/token-gating'} element={<TokenGating />} />

        <Route
          path={'/token-gating/:address'}
          element={<TokenGatingNft isAdminApp />}
        />

        <Route
          path={'/token-gating/:address/rewards'}
          element={<h1>Select rewards</h1>}
        />

        {USE_CATEGORY && (
          <Route path={'/new-category'} element={<CategoryForm />} />
        )}

        <Route path={'/dashboard'} element={<DashboardPage />} />

        <Route path={'/theme'} element={<ThemePage />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AdminLayout>
  );
};

export const StoreAppRouter = () => {
  return (
    <CurrencyProvider>
      <CartProvider>
        <SolanaPayProviders>
          <Routes>
            <Route path={'/inventory/*'} element={<StoreApp />} />

            <Route path={`${routes.store.nfts}/*`} element={<NftApp />} />

            <Route path={routes.store.cart} element={<CartPage />} />

            <Route path={routes.store.payment} element={<CartPaymentPage />} />

            <Route
              path={'/confirmation/:orderId/tx/:signatureId'}
              element={<ConfirmationPage isConfirmation />}
            />

            <Route
              path={'/confirmation/:orderId'}
              element={<ConfirmationPage />}
            />

            <Route path={'/profile'} element={<ProfilePage />} />

            <Route path={routes.base} element={<StoreHomepage />} />

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </SolanaPayProviders>
      </CartProvider>
    </CurrencyProvider>
  );
};

const MainAppRouter = () => {
  return (
    <Routes>
      <Route path={routes.base} element={<Homepage />} />

      <Route path={routes.auth} element={<AuthPage />} />

      <Route path={routes.completeSignup} element={<CompleteSignupPage />} />

      <Route
        path={routes.magicLink + '/:userEmail'}
        element={<VerifyCodePage />}
      />

      <Route path={routes.storeNotFound} element={<StoreNotFoundPage />} />

      <Route path={routes.admin.base + '/*'} element={<AdminAppRouter />} />

      <Route path={routes.store.base + '/*'} element={<StoreAppRouter />} />

      <Route
        path={routes.static.base + '/:staticPage'}
        element={<StaticPage />}
      />

      <Route path={routes.pricing} element={<PricingPage />} />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

const HideAppRouter = () => (
  <Routes>
    <Route path={routes.base} element={<Homepage />} />
    <Route path={routes.pricing} element={<PricingPage />} />
    <Route path="*" element={<Navigate to={routes.base} />} />
    <Route
      path={routes.static.base + '/:staticPage'}
      element={<StaticPage />}
    />
  </Routes>
);

export const AppRouter = () => {
  const { store, isLoading } = useStore();

  if (HIDE_APP) {
    return <HideAppRouter />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (store) {
    return <StoreAppRouter />;
  }

  return <MainAppRouter />;
};
