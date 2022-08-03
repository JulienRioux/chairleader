import { StorePage } from 'pages/admin-pages/inventory-page';
import { ErrorPage } from 'pages/error-page';
import { Routes, Route } from 'react-router-dom';
import { InventoryLayout } from './inventory-layout';
import { ProductPage } from './product-page';

export const StoreApp = () => {
  return (
    <InventoryLayout>
      <Routes>
        <Route path={'/'} element={<StorePage />} />

        <Route path={'/:productId'} element={<ProductPage />} />

        <Route path={'/search'} element={<h1>Search</h1>} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </InventoryLayout>
  );
};
