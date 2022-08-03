import { ProductModel } from '../../../models/product';
import { Logger, deleteImagesFromCloud } from '../../../utils';

export const deleteProductById = async (id: string) => {
  let deletedProduct;
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
