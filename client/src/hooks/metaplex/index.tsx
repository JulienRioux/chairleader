import {
  Metaplex,
  walletAdapterIdentity,
  bundlrStorage,
} from '@metaplex-foundation/js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { IS_DEV } from 'configs';
import { ReactNode, useMemo, createContext, useContext } from 'react';
import { CLUSTER_ENDPOINT } from 'utils';

interface IMetaplexContext {
  metaplex: Metaplex | null;
}

export const MetaplexContext = createContext<IMetaplexContext>(
  {} as IMetaplexContext
);

export function useMetaplex() {
  return useContext(MetaplexContext);
}

export const MetaplexProvider = ({ children }: { children: ReactNode }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const metaplex = useMemo(() => {
    const BUNDLR_STORAGE = IS_DEV
      ? bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: CLUSTER_ENDPOINT,
          timeout: 60000,
        })
      : bundlrStorage();
    return !wallet.connected
      ? null
      : Metaplex.make(connection)
          .use(walletAdapterIdentity(wallet))
          .use(BUNDLR_STORAGE);
  }, [connection, wallet]);

  return (
    <MetaplexContext.Provider value={{ metaplex }}>
      {children}
    </MetaplexContext.Provider>
  );
};
