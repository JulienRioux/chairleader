import * as React from 'react';
import {
  createContext,
  useCallback,
  ReactNode,
  FC,
  useState,
  useContext,
  ReactElement,
  useEffect,
} from 'react';
import { SOLIcon } from 'pages/cart-page/SOLIcon';
import { USDCIcon } from 'pages/cart-page/USDCIcon';
import {
  DEVNET_ENDPOINT,
  DEVNET_DUMMY_MINT,
  MAINNET_USDC_MINT,
  MAINNET_ENDPOINT,
} from 'utils';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
import { useStore } from 'hooks/store';

export enum CURRENCY_AND_NETWORK {
  USDC_DEVNET = 'USDC_DEVNET',
  USDC_MAINNET = 'USDC_MAINNET',
  SOL_DEVNET = 'SOL_DEVNET',
  SOL_MAINNET = 'SOL_MAINNET',
}

export enum CURRENCY {
  SOL = 'SOL',
  USDC = 'USDC',
}

export enum NETWORK {
  DEVNET = 'DEVNET',
  MAINNET = 'MAINNET',
}

export const currencyMap = {
  [CURRENCY_AND_NETWORK.USDC_DEVNET]: {
    icon: <USDCIcon />,
    symbol: 'USDC',
    splToken: DEVNET_DUMMY_MINT,
    networkEndpoint: DEVNET_ENDPOINT,
    walletAdapterNetwork: WalletAdapterNetwork.Devnet,
    decimals: 6,
    minDecimals: 2,
  },
  [CURRENCY_AND_NETWORK.USDC_MAINNET]: {
    icon: <USDCIcon />,
    symbol: 'USDC',
    splToken: MAINNET_USDC_MINT,
    networkEndpoint: MAINNET_ENDPOINT,
    walletAdapterNetwork: WalletAdapterNetwork.Mainnet,
    decimals: 6,
    minDecimals: 2,
  },
  [CURRENCY_AND_NETWORK.SOL_DEVNET]: {
    icon: <SOLIcon />,
    symbol: 'SOL',
    splToken: undefined,
    networkEndpoint: DEVNET_ENDPOINT,
    walletAdapterNetwork: WalletAdapterNetwork.Devnet,
    decimals: 9,
    minDecimals: 1,
  },
  [CURRENCY_AND_NETWORK.SOL_MAINNET]: {
    icon: <SOLIcon />,
    symbol: 'SOL',
    splToken: undefined,
    networkEndpoint: MAINNET_ENDPOINT,
    walletAdapterNetwork: WalletAdapterNetwork.Mainnet,
    decimals: 9,
    minDecimals: 1,
  },
};

interface ICurrencyContext {
  currency: CURRENCY;
  network: NETWORK;
  symbol: string;
  walletAdapterNetwork: WalletAdapterNetwork;
  icon: ReactElement;
  networkEndpoint: string;
  splToken: PublicKey | undefined;
  decimals: number;
  minDecimals: number;
}

export const CurrencyContext = createContext<ICurrencyContext>(
  {} as ICurrencyContext
);

export const CurrencyProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { store } = useStore();

  const [currency, setCurrency] = useState(
    (store?.currency as CURRENCY) ?? CURRENCY.USDC
  );

  const [network, setNetwork] = useState(NETWORK.DEVNET);

  useEffect(() => {
    if (store?.currency) {
      setCurrency(store?.currency as CURRENCY);
    }
  }, [store?.currency]);

  const {
    symbol,
    walletAdapterNetwork,
    icon,
    networkEndpoint,
    splToken,
    decimals,
    minDecimals,
  } = currencyMap[CURRENCY_AND_NETWORK[`${currency}_${network}`]];

  const getCtx = useCallback(() => {
    return {
      currency,
      network,
      symbol,
      walletAdapterNetwork,
      icon,
      networkEndpoint,
      splToken,
      decimals,
      minDecimals,
    };
  }, [
    currency,
    network,
    symbol,
    walletAdapterNetwork,
    icon,
    networkEndpoint,
    splToken,
    decimals,
    minDecimals,
  ]);

  return (
    <CurrencyContext.Provider value={getCtx()}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext.Consumer;

export const useCurrency = () => {
  return useContext(CurrencyContext);
};
