import { getInvoiceById } from '../../../controllers/invoices/get-invoices-by-id';
import { getInvoiceByStoreId } from '../../../controllers/invoices/get-invoices-by-store-id';
import { getInvoicesByWalletAddress } from '../../../controllers/invoices/get-invoices-by-wallet-address';

export const getInvoicesByStoreIdQuery = async (
  _parent: any,
  args: null,
  context
) => {
  return getInvoiceByStoreId(context.user?._id);
};

export const getInvoiceByIdQuery = async (_parent: any, { id }, { user }) => {
  return getInvoiceById({ id, storeId: user?._id });
};

export const getInvoicesByWalletAddressQuery = async (
  _parent: any,
  { walletAddress },
  context
) => {
  return getInvoicesByWalletAddress(walletAddress, context?.subdomain);
};
