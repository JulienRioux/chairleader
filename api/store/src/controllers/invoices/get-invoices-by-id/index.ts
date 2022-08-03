import { InvoiceModel } from '../../../models/invoice';

export const getInvoiceById = async ({
  storeId,
  id,
}: {
  storeId: string;
  id: string;
}) => {
  const invoices = await InvoiceModel.findById(id);
  // Make sure that the store own the invoice
  return invoices;
};
