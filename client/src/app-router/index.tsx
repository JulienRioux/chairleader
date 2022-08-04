import { AdminLayout } from 'components';
import { USE_CATEGORY } from 'configs';
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
import { StoreApp } from 'pages/pos-app';
import { VerifyCodePage } from 'pages/verify-code-page';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from 'utils';
import {
  CartPage,
  ConfirmationPage,
  SolanaPayProviders,
} from 'pages/cart-page';
import { CartProvider } from 'hooks/cart';
import { CurrencyProvider } from 'hooks/currency';
import { InvoicePage } from 'pages/admin-pages/invoice-page';
import { StoreNotFoundPage } from 'pages/store-not-found-page';
import { Loader } from 'components-library';
import { useStore } from 'hooks/store';
import { DashboardPage } from 'pages/admin-pages/dashboard-page';

export const AdminAppRouter = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path={'/inventory'} element={<InventoryPage />} />

        <Route path={'/inventory/:productId'} element={<ProductForm />} />

        <Route path={'/payments'} element={<PaymentsPage />} />

        <Route path={'/payments/:invoiceId'} element={<InvoicePage />} />

        <Route path={'/point-of-sale'} element={<PointOfSalePage />} />

        <Route path={'/my-store'} element={<UserPage />} />

        <Route path={'/new-product'} element={<ProductForm />} />

        {USE_CATEGORY && (
          <Route path={'/new-category'} element={<CategoryForm />} />
        )}

        <Route path={'/dashboard'} element={<DashboardPage />} />

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

            <Route path={routes.store.cart} element={<CartPage />} />

            <Route
              path={'/confirmation/:orderId/tx/:signatureId'}
              element={<ConfirmationPage />}
            />

            <Route
              path={routes.base}
              element={<Navigate to={routes.store.inventory} />}
            />

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

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export const AppRouter = () => {
  const { store, isLoading } = useStore();

  if (isLoading) {
    return <Loader />;
  }

  if (store) {
    return <StoreAppRouter />;
  }

  return <MainAppRouter />;
};
