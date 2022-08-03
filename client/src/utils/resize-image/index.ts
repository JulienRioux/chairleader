import { Logger } from 'utils';

interface IResizeImageOptions {
  maxSize: number;
  file: File;
}
/**
 * Takes File and reduce it to the maxSize (first of width or height).
 */
export const resizeFileImage = (settings: IResizeImageOptions) => {
  const { file } = settings;
  const { maxSize } = settings;
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement('canvas');
  const dataURItoBlob = (dataURI: string) => {
    const bytes =
      dataURI.split(',')[0].indexOf('base64') >= 0
        ? atob(dataURI.split(',')[1])
        : unescape(dataURI.split(',')[1]);
    const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
  };
  const resize = () => {
    let { width } = image;
    let { height } = image;

    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }

    canvas.width = width;
    canvas.height = height;
    // eslint-disable-next-line no-unused-expressions
    canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    return dataURItoBlob(dataUrl);
  };

  return new Promise((ok, no) => {
    if (!file.type.match(/image.*/)) {
      no(new Error('Not an image'));
      return;
    }

    reader.onload = (readerEvent: any) => {
      image.onload = () => ok(resize());
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const MAX_IMG_SIZE = 1200;
/** This function resize the image file to a maxSize (max width or length) */
export const resizeFileImg = async (imgFile: File, maxSize = MAX_IMG_SIZE) => {
  const config = {
    file: imgFile,
    maxSize,
  };
  try {
    const resizedImage = (await resizeFileImage(config)) as File;
    const { name: imgFileName, type: imgFileType } = imgFile;
    const resizedImageFile = new File([resizedImage as Blob], imgFileName, {
      type: imgFileType,
    });
    return resizedImageFile;
  } catch (err) {
    Logger.error(
      `Something went wrong while adding/resizing an image ${err} for ${JSON.stringify(
        imgFile
      )}`
    );
  }
};
