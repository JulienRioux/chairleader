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
  shippingFee,
  theme,
  homepage,
}: any) => {
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

  const primaryColor = theme?.primaryColor;
  const heroTitle = homepage?.heroTitle;
  const heroSubTitle = homepage?.heroSubTitle;
  const heroImage = homepage?.heroImage;

  let homepageHeroImgSrc = '';

  // Upload the hero image
  if (heroImage) {
    try {
      // Make sure to remove the image
      const notUpdatedUser = await UserModel.findById(id);

      //  Save the image to S3 cloud storage
      const uploadedImage = await uploadImageToCloud({
        bucketFolderName: BUCKET_FOLDER_NAME.STORE_HOMEPAGE,
        file: heroImage,
        userId: id.toString(),
      });

      homepageHeroImgSrc = uploadedImage.location;

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
      ...(shippingFee && { shippingFee }),
      ...(homepage && {
        homepage: {
          ...(heroTitle && { heroTitle }),
          ...(heroSubTitle && { heroSubTitle }),
          ...(homepageHeroImgSrc && { heroImage: homepageHeroImgSrc }),
        },
      }),
      ...(theme && {
        theme: {
          ...(primaryColor && { primaryColor }),
        },
      }),
      updatedAt: new Date(),
    },
    { upsert: true }
  );
  return user;
};
