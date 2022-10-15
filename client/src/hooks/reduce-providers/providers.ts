import { ApolloProviderWrapper } from '../apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import { InventoryProvider } from 'hooks/inventory';
import { AuthProvider } from 'hooks/auth';
import { AuthRequired } from 'components/auth-required';
import { StoreProvider } from 'hooks/store';
import { ThemeProvider } from 'hooks/theme';
import { ConnectWalletProvider } from 'hooks/wallet';
import { MetaplexProvider } from 'hooks/metaplex';
import { WalletModalProvider } from 'hooks/wallet-modal';
import { NftProvider } from 'hooks/nft';

export const getProviders = () => {
  return [
    Router,
    ApolloProviderWrapper,
    AuthProvider,
    InventoryProvider,
    AuthRequired, // Not a provider but kinda act the same...
    StoreProvider,
    ThemeProvider,
    ConnectWalletProvider,
    WalletModalProvider,
    MetaplexProvider,
    NftProvider,
  ];
};
