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
import { Logger, USDC_MINT } from 'utils';
import { message } from 'components-library';

export interface IBalanceContext {
  isLoading: boolean;
  userBalance: null | number;
  userSolBalance: null | number;
}

export const BalanceContext = createContext<IBalanceContext>(
  {} as IBalanceContext
);

export const BalanceProvider: React.FC<IBaseProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<null | number>(null);

  const [userSolBalance, setUserSolBalance] = useState<null | number>(null);

  const { connection } = useConnection();

  const { publicKey } = useWallet();

  const getSolBalance = useCallback(async () => {
    if (publicKey) {
      const solanaBalance = await connection.getBalance(publicKey);
      setUserSolBalance(solanaBalance);
    }
  }, [connection, publicKey]);

  const getTokenBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!publicKey) {
        setIsLoading(false);
        return;
      }
      const senderATA = await getAssociatedTokenAddress(USDC_MINT, publicKey);
      const senderAccount = await getAccount(connection, senderATA);

      const tokenMint = await getMint(connection, USDC_MINT);

      const balance = Number(senderAccount.amount) / 10 ** tokenMint.decimals;

      setUserBalance(balance ?? 0);

      setIsLoading(false);
    } catch (err: any) {
      if (err?.name === 'TokenAccountNotFoundError') {
        setUserBalance(0);
        setIsLoading(false);
        return;
      }
      message.error('Something went wrong when loading your balance...');
      setIsLoading(false);
      Logger.error(err);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance]);

  useEffect(() => {
    getSolBalance();
  }, [getSolBalance]);

  const getCtx = useCallback(() => {
    return {
      isLoading,
      userBalance,
      userSolBalance,
    };
  }, [isLoading, userBalance, userSolBalance]);

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
