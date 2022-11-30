const SEARCH_PARAM = 'override-hide-app';

/** This function simply check if we should override witht he url params. */
export const overrideHideAppFromUrlParams = () => {
  const searchParams = new URLSearchParams(window?.location?.search);
  return searchParams.get(SEARCH_PARAM) === 'true';
};

export const SHOW_PRODUCT_HUNT_BTN = false;
export const APP_NAME = 'Chairleader';
export const USE_CATEGORY = false;
export const IS_POINT_OF_SALE = false;
export const HIDE_APP =
  process.env.REACT_APP_HIDE_APP === 'true' && !overrideHideAppFromUrlParams();
export const PAYMENT_SERVICE_FEE =
  (Number(process.env.REACT_APP_PAYMENT_SERVICE_FEE) ?? 0) * 100;
export const SELLING_NFT_SERVICE_FEE =
  Number(process.env.REACT_APP_SELLING_NFT_SERVICE_FEE) ?? 0;
export const NFT_ROYALTY = Number(process.env.REACT_APP_NFT_ROYALTY);
export const IS_PROD = process.env.REACT_APP_ENVIRONMENT === 'production';
export const IS_DEV = !IS_PROD;
export const SHOW_MULTIPLE_CURRENCY = false;
export const USE_PAYMENT_LINK = false;
export const MAX_PRODUCTS = 50;
