import { Connection } from '@solana/web3.js';

export const CLUSTER_ENDPOINT =
  process.env.CLUSTER_ENDPOINT || 'https://api.devnet.solana.com';

export const connection = new Connection(
  CLUSTER_ENDPOINT || 'https://api.devnet.solana.com',
  'confirmed'
);
