import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { IS_PROD } from 'configs';

const USE_QUICKNODE = {
  DEV: false,
  PROD: true,
};

export const CLUSTER_ENV = IS_PROD
  ? WalletAdapterNetwork.Mainnet
  : WalletAdapterNetwork.Devnet;

const QUICKNODE_PROD_URI =
  'https://distinguished-burned-violet.solana-devnet.discover.quiknode.pro/ecf3048415984c2959793a08516f0231ce193da2/';
const DEV_URI = 'https://api.devnet.solana.com';

const DEVNET_URI = USE_QUICKNODE.DEV ? QUICKNODE_PROD_URI : DEV_URI;

const QUICKNODE_MAINNET_URI =
  'https://aged-evocative-tab.solana-mainnet.discover.quiknode.pro/86ab79a94c3c70dee87b6e622f2a60d826324e9a/';
const MAINNET_URI = 'https://api.mainnet-beta.solana.com';

const PROD_URI = USE_QUICKNODE.PROD ? QUICKNODE_MAINNET_URI : MAINNET_URI;

export const CLUSTER_ENDPOINT = IS_PROD ? PROD_URI : DEVNET_URI;
