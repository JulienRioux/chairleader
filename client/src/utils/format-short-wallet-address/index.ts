export const formatShortAddress = (userAddress?: string) => {
  if (!userAddress) {
    return '-';
  }
  if (userAddress?.length <= 15) {
    return userAddress;
  }
  return userAddress
    ? userAddress?.slice(0, 6) + '...' + userAddress?.slice(-6)
    : '';
};
