import { ProductModel } from '../../../models/product';
import {
  deleteImagesFromCloud,
  Logger,
  uploadImageToCloud,
} from '../../../utils';
import { BUCKET_FOLDER_NAME } from '../add-product';
import { getProductById } from '../get-product-by-id';

export const editProduct = async ({
  title,
  storeId,
  productId,
  image,
  description,
  price,
  totalSupply,
}: {
  title: string;
  storeId: string;
  productId: string;
  image: File;
  description: string;
  price: number;
  totalSupply: number;
}) => {
  try {
    // Find the product to check if we need to delete the image in S3
    const productToEdit = await getProductById(productId);

    let imgSrc = '';

    if (image) {
      //  Save the image to S3 cloud storage
      const uploadedImage = await uploadImageToCloud({
        bucketFolderName: BUCKET_FOLDER_NAME.PRODUCTS,
        file: image,
        userId: storeId.toString(),
      });

      imgSrc = uploadedImage.location;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(productId, {
      ...(title && { title }),
      ...(imgSrc && { image: imgSrc }),
      ...(description && { description }),
      ...(price && { price }),
      ...(totalSupply && { totalSupply }),
    });

    // Delete the image from S3 if there was one before and we're replacing it
    if (image && productToEdit?.image) {
      try {
        deleteImagesFromCloud([productToEdit.image]);
      } catch (err) {
        Logger.error(err);
      }
    }

    return updatedProduct;
  } catch (err) {
    Logger.error(err);
  }
};
