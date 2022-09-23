import { getUserBySubdomain } from '../../../controllers/users/get-user-by-subdomain';
import { NftModel } from '../../../models/nft';
import { Logger } from '../../../utils';

export const findNftByAddressQuery = async (
  _source: any,
  { nftAddress },
  context
) => {
  const storeId = context?.user?._id;

  try {
    const nft = await NftModel.findOne({
      storeId,
      nftAddress,
    });

    return nft;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};

export const findNftsByStoreIdQuery = async (_source: any, args, context) => {
  let storeId = context?.user?._id;

  const subdomain = context?.subdomain;
  console.log('subdomain =>>>>', subdomain);
  // Using the subdomain on the e-commerce app to retrieve the store ID
  if (subdomain) {
    const store = await getUserBySubdomain({ subdomain });
    storeId = store?._id;
  }

  try {
    const nfts = await NftModel.find({
      storeId,
    });

    return nfts;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};
