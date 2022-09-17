import { ApolloProviderWrapper } from '../apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import { InventoryProvider } from 'hooks/inventory';
import { AuthProvider } from 'hooks/auth';
import { AuthRequired } from 'components/auth-required';
import { StoreProvider } from 'hooks/store';
import { ThemeProvider } from 'hooks/theme';
import { ConnectWalletProvider } from 'hooks/wallet';
import { MetaplexProvider } from 'hooks/metaplex';

export const getProviders = () => {
  return [
    ThemeProvider,
    ApolloProviderWrapper,
    Router,
    AuthProvider,
    InventoryProvider,
    AuthRequired, // Not a provider but kinda act the same...
    StoreProvider,
    ConnectWalletProvider,
    MetaplexProvider,
  ];
};
