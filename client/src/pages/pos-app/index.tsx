import { StorePage } from 'pages/admin-pages/inventory-page';
import { ErrorPage } from 'pages/error-page';
import { Routes, Route } from 'react-router-dom';
import { InventoryLayout } from './inventory-layout';
import { NftPage } from './nft-page';
import { NftsPage } from './nfts-page';
import { ProductPage } from './product-page';

export const StoreApp = () => {
  return (
    <InventoryLayout>
      <Routes>
        <Route path={'/'} element={<StorePage />} />

        <Route path={'/:productId'} element={<ProductPage />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </InventoryLayout>
  );
};

export const NftApp = () => {
  return (
    <InventoryLayout>
      <Routes>
        <Route path={'/'} element={<NftsPage />} />

        <Route path={'/:address'} element={<NftPage />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </InventoryLayout>
  );
};
