import React from 'react';
import { ReduceProviders } from 'hooks/reduce-providers';
import { getProviders } from 'hooks/reduce-providers/providers';
import { GlobalStyles } from 'styles/global-styles';
import { AppRouter } from 'app-router';
import ReactGA from 'react-ga';
import { welcomeLog } from 'welcome-log';

ReactGA.initialize('UA-243959863-1');
ReactGA.pageview(window.location.pathname + window.location.search);
welcomeLog();

function App() {
  return (
    <ReduceProviders providers={getProviders()}>
      <GlobalStyles />
      <AppRouter />
    </ReduceProviders>
  );
}

export default App;
