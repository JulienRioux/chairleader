import { PublicKey } from '@solana/web3.js';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useStore } from 'hooks/store';
import React, { FC, ReactNode } from 'react';
import { Logger } from 'utils';
import { ConfigContext } from '../../hooks/config';
import { Digits } from '../../types';

export interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: FC<ConfigProviderProps> = ({ children }) => {
  const { symbol, icon, splToken, decimals, minDecimals } = useCurrency();
  const { cartItemsNumber } = useCart();

  const baseURL = `https://${window.location.host}`;

  const { store } = useStore();

  const link = new URL(
    'https://79ex4zrxy9.execute-api.us-east-1.amazonaws.com'
  );

  const recipientParam = store?.walletAddress ?? 'NO_STORE_WALLET';
  const label = store?.storeName;

  let recipient = new PublicKey(recipientParam);

  const message = `${cartItemsNumber} items`;

  if (recipientParam && label) {
    try {
      recipient = new PublicKey(recipientParam);
    } catch (error) {
      Logger.error(error);
    }
  }

  return (
    <ConfigContext.Provider
      value={{
        baseURL,
        link,
        recipient,
        label,
        message,
        splToken,
        symbol,
        icon,
        decimals: decimals as Digits,
        minDecimals: minDecimals as Digits,
        requiredConfirmations: 1,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
