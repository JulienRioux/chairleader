import { NftModel } from '../../../models/nft';
import { Logger } from '../../../utils';

export const addNftMutation = async (_source: any, { nftAddress }, context) => {
  const storeId = context?.user?._id;

  try {
    // 1) Create a NFT object and store it in our DB
    // The object should store the store ID and the nft address
    // Do not use the address as the ID in our DB since we could use these NFTs with different store.
    const doc = new NftModel({
      storeId,
      nftAddress,
    });

    await doc.save();

    return doc;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};

export const updateNftMutation = async (
  _source: any,
  { productsUnlocked, id, isArchived },
  context
) => {
  try {
    const nft = await NftModel.findByIdAndUpdate(id, {
      productsUnlocked,
      isArchived,
      updatedAt: new Date(),
    });

    return nft;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};
