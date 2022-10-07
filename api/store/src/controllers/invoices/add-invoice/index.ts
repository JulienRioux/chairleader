import { InvoiceModel } from '../../../models/invoice';
import { ProductModel } from '../../../models/product';
import { Logger } from '../../../utils';

export const addInvoice = async ({
  signature,
  totalPrice,
  totalSaleTax,
  totalWithSaleTax,
  cartItems,
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
}: {
  signature: string;
  totalPrice: number;
  totalSaleTax: number;
  totalWithSaleTax: number;
  cartItems: any;
  storeId: string;
  customerWalletAddress: string;
  currency: string;
  network: string;
  serviceFees: number;
  shippingFee: number;
  email: string;
  name: string;
  country: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
}) => {
  try {
    const doc = new InvoiceModel({
      signature,
      totalPrice,
      totalSaleTax,
      totalWithSaleTax,
      cartItems,
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
    });

    // Updating the product quantity
    cartItems.forEach(async ({ _id, qty }: { _id: string; qty: number }) => {
      // Do not change the qty for custom items
      if (_id.startsWith('CUSTOM_ITEM_')) {
        return;
      }
      await ProductModel.findByIdAndUpdate(
        { _id },
        { $inc: { totalSupply: -qty } }
      );
    });

    await doc.save();

    return doc;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};

export const updateInvoice = async ({
  fulfillmentStatus,
  invoiceId,
}: {
  fulfillmentStatus: string;
  invoiceId: string;
}) => {
  try {
    const undatedInvoice = await InvoiceModel.findByIdAndUpdate(invoiceId, {
      fulfillmentStatus,
    });
    return undatedInvoice;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};
