import { getInvoiceById } from '../../../controllers/invoices/get-invoices-by-id';
import { getInvoiceByStoreId } from '../../../controllers/invoices/get-invoices-by-store-id';

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
