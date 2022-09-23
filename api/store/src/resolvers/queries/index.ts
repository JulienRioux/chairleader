import { getInvoiceByIdQuery, getInvoicesByStoreIdQuery } from './invoices';
import { findNftByAddressQuery, findNftsByStoreIdQuery } from './nft';
import { getProductsByUserIdQuery } from './products';
import { getStoreDataQuery } from './store';
import { checkIfSubdomainIsAvailableQuery, getMeQuery } from './user';

export const Query = {
  getMe: getMeQuery,
  getProductsByUserId: getProductsByUserIdQuery,
  getInvoicesByStoreId: getInvoicesByStoreIdQuery,
  getStoreData: getStoreDataQuery,
  getInvoiceById: getInvoiceByIdQuery,
  checkIfSubdomainIsAvailable: checkIfSubdomainIsAvailableQuery,
  findNftByAddress: findNftByAddressQuery,
  findNftsByStoreId: findNftsByStoreIdQuery,
};
