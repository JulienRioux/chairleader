import { model, Schema } from 'mongoose';

import { BASE_SHCHEMA } from '../base';

export interface INft {
  storeId: string;
  nftAddress: string;
  productsUnlocked: string[];
}

const NftSchema = new Schema<INft>({
  ...BASE_SHCHEMA,
  storeId: String,
  nftAddress: String,
  productsUnlocked: [String],
});

export const NftModel = model<INft>('Nft', NftSchema);
