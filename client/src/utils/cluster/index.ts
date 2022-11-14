import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { IS_PROD } from 'configs';

const USE_QUICKNODE = false;

export const CLUSTER_ENV = WalletAdapterNetwork.Devnet;

const DEVNET_URI = USE_QUICKNODE
  ? 'https://distinguished-burned-violet.solana-devnet.discover.quiknode.pro/ecf3048415984c2959793a08516f0231ce193da2/'
  : 'https://api.devnet.solana.com';

const QUICKNODE_MAINNET_URI =
  'https://aged-evocative-tab.solana-mainnet.discover.quiknode.pro/86ab79a94c3c70dee87b6e622f2a60d826324e9a/';
const MAINNET_URI = 'https://api.mainnet-beta.solana.com';

export const CLUSTER_ENDPOINT = IS_PROD ? QUICKNODE_MAINNET_URI : DEVNET_URI;
