import { Connection } from '@solana/web3.js';

const USE_QUICKNODE = true;

const DEVNET_URI = USE_QUICKNODE
  ? 'https://distinguished-burned-violet.solana-devnet.discover.quiknode.pro/ecf3048415984c2959793a08516f0231ce193da2/'
  : 'https://api.devnet.solana.com';

const MAINNET_URI = 'https://api.mainnet-beta.solana.com';

export const CLUSTER_ENDPOINT = process.env.CLUSTER_ENDPOINT || DEVNET_URI;

export const connection = new Connection(
  CLUSTER_ENDPOINT || 'https://api.devnet.solana.com',
  'confirmed'
);
