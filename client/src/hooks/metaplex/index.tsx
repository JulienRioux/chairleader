import {
  Metaplex,
  walletAdapterIdentity,
  bundlrStorage,
} from '@metaplex-foundation/js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ReactNode, useMemo, createContext, useContext } from 'react';

export const MetaplexContext = createContext({});

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
          .use(bundlrStorage({ address: 'https://devnet.bundlr.network' }));
  }, [connection, wallet]);

  return (
    <MetaplexContext.Provider value={{ metaplex }}>
      {children}
    </MetaplexContext.Provider>
  );
};
