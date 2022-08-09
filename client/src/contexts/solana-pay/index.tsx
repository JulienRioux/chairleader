import { ConfigProvider } from 'contexts/config';
import { PaymentProvider } from 'contexts/payment';
import { TransactionsProvider } from 'contexts/transactions';
import { ReactNode } from 'react';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { useCurrency } from 'hooks/currency';

export const SolanaPayProviders = ({ children }: { children: ReactNode }) => {
  const { networkEndpoint } = useCurrency();

  return (
    <ConnectionProvider endpoint={networkEndpoint}>
      <ConfigProvider>
        <TransactionsProvider>
          <PaymentProvider>{children}</PaymentProvider>
        </TransactionsProvider>
      </ConfigProvider>
    </ConnectionProvider>
  );
};
