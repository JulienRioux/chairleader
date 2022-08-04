enum PLATFORM {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  WEB = 'WEB',
}

export const determinePlatform = () => {
  const patterns = {
    androidRegex: /.*?Android.*?/i,
    iOSRegex: /^iP.*$/i,
  };
  const androidMatch = patterns.androidRegex.test(navigator.userAgent);
  const iOSMAtch = patterns.iOSRegex.test(navigator.platform);

  if (androidMatch) {
    return PLATFORM.ANDROID;
  } else if (iOSMAtch) {
    return PLATFORM.IOS;
  }
  return PLATFORM.WEB;
};

export const isMobileDevice = () => determinePlatform() !== PLATFORM.WEB;
