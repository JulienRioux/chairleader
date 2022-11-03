import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as React from 'react';
import { IBaseProps } from 'types';
import {
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { USDC_MINT } from 'utils';

export interface IBalanceContext {
  isLoading: boolean;
  userBalance: null | number;
}

export const BalanceContext = createContext<IBalanceContext>(
  {} as IBalanceContext
);

export const BalanceProvider: React.FC<IBaseProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<null | number>(null);

  const { connection } = useConnection();

  const { publicKey } = useWallet();

  const getTokenBalance = useCallback(async () => {
    setIsLoading(true);
    if (!publicKey) {
      setIsLoading(false);
      return;
    }
    const senderATA = await getAssociatedTokenAddress(USDC_MINT, publicKey);
    const senderAccount = await getAccount(connection, senderATA);

    const tokenMint = await getMint(connection, USDC_MINT);

    const balance = Number(senderAccount.amount) / 10 ** tokenMint.decimals;

    setUserBalance(balance);

    setIsLoading(false);
  }, [connection, publicKey]);

  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance]);

  const getCtx = useCallback(() => {
    return {
      isLoading,
      userBalance,
    };
  }, [isLoading, userBalance]);

  return (
    <BalanceContext.Provider value={getCtx()}>
      {children}
    </BalanceContext.Provider>
  );
};

export default BalanceContext.Consumer;

export const useBalance = () => {
  return useContext(BalanceContext);
};
