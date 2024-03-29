import { model, Schema } from 'mongoose';

import { BASE_SHCHEMA } from '../base';

export interface IProduct {
  title: string;
  image: string;
  description: string;
  price: number;
  totalSupply: number;
  storeId: string;
  status: string;
  productType: string;
  variantNames: string[];
  variantsValues: [[string]];
  allPossibleVariantsObject: any;
}

const ProductSchema = new Schema<IProduct>({
  ...BASE_SHCHEMA,
  title: { required: true, type: String },
  image: String,
  description: String,
  price: Number,
  totalSupply: Number,
  storeId: String,
  status: { type: String, default: 'published' },
  productType: { type: String, default: 'simpleProduct' },
  variantNames: [String],
  variantsValues: [[String]],
  allPossibleVariantsObject: Object,
});

export const ProductModel = model<IProduct>('Product', ProductSchema);
