export const formatShortAddress = (userAddress?: string) => {
  if (!userAddress) {
    return '-';
  }
  if (userAddress?.length <= 15) {
    return userAddress;
  }
  return userAddress
    ? userAddress?.slice(0, 4) + '...' + userAddress?.slice(-4)
    : '';
};
