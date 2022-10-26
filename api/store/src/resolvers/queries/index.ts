import {
  getInvoiceByIdQuery,
  getInvoicesByStoreIdQuery,
  getInvoicesByWalletAddressQuery,
} from './invoices';
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
  getInvoicesByWalletAddress: getInvoicesByWalletAddressQuery,
  checkIfSubdomainIsAvailable: checkIfSubdomainIsAvailableQuery,
  findNftByAddress: findNftByAddressQuery,
  findNftsByStoreId: findNftsByStoreIdQuery,
};
