import { UserModel } from '../../../models/user';
import {
  deleteImagesFromCloud,
  Logger,
  uploadImageToCloud,
} from '../../../utils';
import { BUCKET_FOLDER_NAME } from '../../products/add-product';

export const updateUser = async ({
  id,
  storeName,
  walletAddress,
  subDomain,
  currency,
  saleTax,
  image,
  nfts,
}) => {
  let imgSrc = '';

  // First update the image
  if (image) {
    try {
      // Make sure to remove the image
      const notUpdatedUser = await UserModel.findById(id);

      //  Save the image to S3 cloud storage
      const uploadedImage = await uploadImageToCloud({
        bucketFolderName: BUCKET_FOLDER_NAME.STORE,
        file: image,
        userId: id.toString(),
      });

      imgSrc = uploadedImage.location;

      // Delete the previous image
      if (notUpdatedUser?.image) {
        deleteImagesFromCloud([notUpdatedUser.image]);
      }
    } catch (err) {
      Logger.error(err);
    }
  }

  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      ...(storeName && { storeName }),
      ...(walletAddress && { walletAddress }),
      ...(subDomain && { subDomain }),
      ...(currency && { currency }),
      ...(!isNaN(saleTax) && { saleTax }),
      ...(imgSrc && { image: imgSrc }),
      ...(nfts && { nfts }),
      updatedAt: new Date(),
    },
    { upsert: true }
  );
  return user;
};
