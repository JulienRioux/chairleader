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
  serviceFees: number;
  shippingFees: number;
  email: string;
  name: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  fulfillmentStatus: string;
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
  serviceFees: Number,
  shippingFees: Number,
  email: String,
  name: String,
  country: String,
  address: String,
  city: String,
  state: String,
  postalCode: String,
  fulfillmentStatus: { default: 'unfulfilled', type: String },
});

export const InvoiceModel = model<IInvoice>('Invoice', InvoiceSchema);
