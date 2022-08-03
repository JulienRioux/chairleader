import React from 'react';
import { ReduceProviders } from 'hooks/reduce-providers';
import { getProviders } from 'hooks/reduce-providers/providers';
import { GlobalStyles } from 'styles/global-styles';
import { AppRouter } from 'app-router';

function App() {
  return (
    <ReduceProviders providers={getProviders()}>
      <GlobalStyles />
      <AppRouter />
    </ReduceProviders>
  );
}

export default App;
