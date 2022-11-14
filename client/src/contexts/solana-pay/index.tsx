import { ConfigProvider } from 'contexts/config';
import { PaymentProvider } from 'contexts/payment';
import { TransactionsProvider } from 'contexts/transactions';
import { ReactNode } from 'react';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { CLUSTER_ENDPOINT } from 'utils';

export const SolanaPayProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ConnectionProvider endpoint={CLUSTER_ENDPOINT}>
      <ConfigProvider>
        <TransactionsProvider>
          <PaymentProvider>{children}</PaymentProvider>
        </TransactionsProvider>
      </ConfigProvider>
    </ConnectionProvider>
  );
};
