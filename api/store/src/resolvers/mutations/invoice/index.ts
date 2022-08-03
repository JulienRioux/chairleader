import { addInvoice } from '../../../controllers/invoices/add-invoice';

export const saveTransactionInvoiceMutation = async (
  _source: any,
  {
    signature,
    totalPrice,
    totalSaleTax,
    totalWithSaleTax,
    cartItems,
    customerWalletAddress,
    storeId,
    currency,
    network,
  },
  context
) => {
  return addInvoice({
    signature,
    totalPrice,
    totalSaleTax,
    totalWithSaleTax,
    cartItems: JSON.parse(cartItems),
    storeId,
    customerWalletAddress,
    currency,
    network,
  });
};
