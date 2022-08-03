import { model, Schema } from 'mongoose';

import { BASE_SHCHEMA } from '../base';

export interface IInvoice {
  signature: string;
  totalPrice: number;
  totalSaleTax: number;
  totalWithSaleTax: number;
  cartItems: string;
  storeId: string;
  customerWalletAddress: string;
  currency: string;
  network: string;
}

const InvoiceSchema = new Schema<IInvoice>({
  ...BASE_SHCHEMA,
  signature: String,
  storeId: String,
  totalPrice: Number,
  totalSaleTax: Number,
  totalWithSaleTax: Number,
  cartItems: Object,
  customerWalletAddress: String,
  currency: String,
  network: String,
});

export const InvoiceModel = model<IInvoice>('Invoice', InvoiceSchema);
