import { uploadImageToCloud, deleteImagesFromCloud } from '..';
import { USER_ID, BUCKET_FOLDER_NAME, S3_IMG_URL } from '../../../__fixtures__';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'unique-id'),
}));

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      upload: jest.fn(() => ({
        promise: jest.fn(() => ({ Location: 'aws-s3-url' })),
      })),

      deleteObjects: jest.fn(() => ({
        promise: jest.fn(() => ({
          Deleted: [
            {
              Key: 'artist-profile-image-id',
            },
          ],
        })),
      })),
    })),
  };
});

const MOCKED_FILE = {
  createReadStream: jest.fn(),
  mimetype: 'image/jpeg',
  encoding: 'utf-8',
  filename: 'file-name',
};

describe('AWS S3', () => {
  it('uploadImageToCloud', async () => {
    const result = await uploadImageToCloud({
      file: MOCKED_FILE,
      bucketFolderName: BUCKET_FOLDER_NAME,
      userId: USER_ID,
    });

    expect(result).toStrictEqual({
      encoding: 'utf-8',
      filename: 'file-name',
      location: 'aws-s3-url',
      message: 'Uploaded',
      mimetype: 'image/jpeg',
      success: true,
    });
  });

  it('deleteImagesFromCloud', async () => {
    const result = await deleteImagesFromCloud([S3_IMG_URL]);

    expect(result).toStrictEqual({
      Deleted: [
        {
          Key: 'artist-profile-image-id',
        },
      ],
    });
  });
});
