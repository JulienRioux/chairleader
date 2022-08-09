import { PublicKey } from '@solana/web3.js';
import * as idl from '../idl/split_payment_sol.json';

export const programId = new PublicKey(idl.metadata.address);
export const SERVICE_FEES = 0.005;
export const opts = {
  preflightCommitment: 'processed',
};
