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
    shippingFee,
    email,
    name,
    country,
    address,
    city,
    state,
    postalCode,
    isNft,
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
    shippingFee,
    email,
    name,
    country,
    address,
    city,
    state,
    postalCode,
    isNft,
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
