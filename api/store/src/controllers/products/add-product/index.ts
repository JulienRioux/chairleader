import { ProductModel } from '../../../models/product';
import { Logger, uploadImageToCloud } from '../../../utils';

export enum BUCKET_FOLDER_NAME {
  PRODUCTS = 'products',
}

export const addProduct = async ({
  title,
  storeId,
  image,
  description,
  price,
  totalSupply,
}: {
  title: string;
  storeId: string;
  image: File;
  description: string;
  price: number;
  totalSupply: number;
}) => {
  try {
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

    const doc = new ProductModel({
      title,
      storeId,
      image: imgSrc,
      description,
      price,
      totalSupply,
    });
    try {
      await doc.save();
      // Send the login email to the user
      return doc;
    } catch (err) {
      Logger.error(err);
    }
    return null;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};
