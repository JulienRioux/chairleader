import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Logger } from '../../utils';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? '',
  },
});
const Bucket = process.env.AWS_S3_BUCKET_NAME ?? '';

/** This function upload images to AWS S3 */
export const uploadImageToCloud = async ({
  file,
  bucketFolderName,
  userId,
}) => {
  const { createReadStream, mimetype, encoding, filename } = await file;

  const stream = createReadStream();

  const extension = mimetype.replace('image/', '');

  const params = {
    Body: stream,
    Bucket,
    ContentType: mimetype,
    Key: `${bucketFolderName}/${userId}-${uuid()}.${extension}`,
  };

  try {
    const stored = await s3.upload(params).promise();

    const { Location } = stored;
    return {
      encoding,
      filename,
      location: Location,
      message: 'Uploaded',
      mimetype,
      success: true,
    };
  } catch (err) {
    Logger.error(err);
    throw new Error(err);
  }
};

/** Takes a S3 URL and delete it from S3 */
export const deleteImagesFromCloud = async (Keys: string[]) => {
  // Creating the object to delete
  const Objects = Keys.map((src) => ({
    // Getting the key from the img src
    Key: src.split(`.amazonaws.com/`)[1],
  }));
  try {
    // Try deleting only if there are some images to delete.
    if (Objects.length !== 0) {
      const Delete = { Objects };
      // Delete object request
      const response = await s3.deleteObjects({ Bucket, Delete }).promise();

      return response;
    }
  } catch (err) {
    // Do not throw error here since we don't want to block the user when this happens. It'll only stays in the bucket without being referenced.
    Logger.error(err);
  }
};
