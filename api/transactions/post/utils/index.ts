import { PublicKey } from '@solana/web3.js';
import * as idl from '../idl/split_payment_sol.json';

export const programId = new PublicKey(idl.metadata.address);
export const SERVICE_FEES = 0.005;
export const opts = {
  preflightCommitment: 'processed',
};

// Mint DUMMY tokens on devnet @ https://spl-token-faucet.com
export const DEVNET_DUMMY_MINT = new PublicKey(
  'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
);

export const MAINNET_USDC_MINT = new PublicKey(
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
);
