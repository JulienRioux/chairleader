const SEARCH_PARAM = 'override-hide-app';

/** This function simply check if we should override witht he url params. */
export const overrideHideAppFromUrlParams = () => {
  const searchParams = new URLSearchParams(window?.location?.search);
  return searchParams.get(SEARCH_PARAM) === 'true';
};
