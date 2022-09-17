import {
  Metaplex,
  walletAdapterIdentity,
  bundlrStorage,
} from '@metaplex-foundation/js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
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
    return !wallet.connected
      ? null
      : Metaplex.make(connection)
          .use(walletAdapterIdentity(wallet))
          .use(
            bundlrStorage({
              address: 'https://devnet.bundlr.network',
              providerUrl: CLUSTER_ENDPOINT,
              timeout: 60000,
            })
          );
  }, [connection, wallet]);

  return (
    <MetaplexContext.Provider value={{ metaplex }}>
      {children}
    </MetaplexContext.Provider>
  );
};
