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
    });

    // Updating the product quantity
    cartItems.forEach(async ({ _id, qty }: { _id: string; qty: number }) => {
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
