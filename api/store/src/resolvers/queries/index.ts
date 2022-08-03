import { getInvoiceByIdQuery, getInvoicesByStoreIdQuery } from './invoices';
import { getProductsByUserIdQuery } from './products';
import { getStoreDataQuery } from './store';
import { getMeQuery } from './user';

export const Query = {
  getMe: getMeQuery,
  getProductsByUserId: getProductsByUserIdQuery,
  getInvoicesByStoreId: getInvoicesByStoreIdQuery,
  getStoreData: getStoreDataQuery,
  getInvoiceById: getInvoiceByIdQuery,
};
