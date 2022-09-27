import { model, Schema } from 'mongoose';

import { BASE_SHCHEMA } from '../base';

export interface INft {
  storeId: string;
  nftAddress: string;
  productsUnlocked: string[];
  isArchived: boolean;
}

const NftSchema = new Schema<INft>({
  ...BASE_SHCHEMA,
  storeId: String,
  nftAddress: String,
  productsUnlocked: [String],
  isArchived: {
    type: Boolean,
    default: false,
  },
});

export const NftModel = model<INft>('Nft', NftSchema);
