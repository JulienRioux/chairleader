import { NftModel } from '../../../models/nft';
import { ProductModel } from '../../../models/product';
import { Logger, deleteImagesFromCloud } from '../../../utils';

export const deleteProductById = async (id: string, storeId: string) => {
  let deletedProduct;

  // First, make sure to remove them from NFTs exclusivity array if present
  try {
    await NftModel.updateMany(
      { storeId, productsUnlocked: id },
      { $pullAll: { productsUnlocked: [id] } }
    );
  } catch (err) {
    Logger.error(err);
    return null;
  }

  try {
    deletedProduct = await ProductModel.findByIdAndDelete(id);
  } catch (err) {
    Logger.error(err);
    return null;
  }

  if (deletedProduct?.image) {
    try {
      deleteImagesFromCloud([deletedProduct.image]);
    } catch (err) {
      Logger.error(err);
    }
  }

  return deletedProduct;
};
