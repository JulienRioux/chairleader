import { InvoiceModel } from '../../../models/invoice';

export const getInvoiceByStoreId = async (storeId: string) => {
  const invoices = await InvoiceModel.find({ storeId }).sort({ createdAt: -1 });
  return invoices;
};
