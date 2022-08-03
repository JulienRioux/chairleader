import { PublicKey } from '@solana/web3.js';

export const validateSolanaAddress = async (address: string) => {
  try {
    const pubKey = new PublicKey(address);
    return PublicKey.isOnCurve(pubKey);
  } catch (err) {
    return false;
  }
};
