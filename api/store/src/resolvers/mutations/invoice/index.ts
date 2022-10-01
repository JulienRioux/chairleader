import {
  addInvoice,
  updateInvoice,
} from '../../../controllers/invoices/add-invoice';

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
    serviceFees,
    shippingFees,
    email,
    name,
    country,
    address,
    city,
    state,
    postalCode,
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
    serviceFees,
    shippingFees,
    email,
    name,
    country,
    address,
    city,
    state,
    postalCode,
  });
};

export const updateInvoiceMutation = async (
  _source: any,
  { fulfillmentStatus, invoiceId },
  context
) => {
  return updateInvoice({
    fulfillmentStatus,
    invoiceId,
  });
};
