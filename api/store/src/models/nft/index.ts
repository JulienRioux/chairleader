import { model, Schema } from 'mongoose';

import { BASE_SHCHEMA } from '../base';

interface IRewardsUnlocked {
  type: string;
  value: number;
}

export interface INft {
  storeId: string;
  nftAddress: string;
  productsUnlocked: string[];
  rewardsUnlocked: IRewardsUnlocked[];
  isArchived: boolean;
}

const NftSchema = new Schema<INft>({
  ...BASE_SHCHEMA,
  storeId: String,
  nftAddress: String,
  productsUnlocked: [String],
  rewardsUnlocked: [Object],
  isArchived: {
    type: Boolean,
    default: false,
  },
});

export const NftModel = model<INft>('Nft', NftSchema);
