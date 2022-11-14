import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { IS_PROD } from 'configs';
import * as React from 'react';
import { StorageKeys } from 'utils';

const PROD_URL =
  'https://ke7vg704pg.execute-api.us-east-1.amazonaws.com/prod/graphql';

const DEV_URL =
  'https://3ucdwail7f.execute-api.us-east-1.amazonaws.com/dev/graphql';

const STORE_API_URL = IS_PROD ? PROD_URL : DEV_URL;

const LOCAL_DEV_URL = 'http://localhost:9900/dev/graphql';
const LOCAL_PROD_URL = 'http://localhost:9900/prod/graphql';

const LOCAL_STORE_API_URL = IS_PROD ? LOCAL_PROD_URL : LOCAL_DEV_URL;

const USE_LOCAL_STORE_API =
  process.env.REACT_APP_USE_LOCAL_STORE_API === 'true';

const uri = `${USE_LOCAL_STORE_API ? LOCAL_STORE_API_URL : STORE_API_URL}`;

const httpLink = createUploadLink({ uri });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(StorageKeys.TOKEN) ?? null;

  // return the headers to the context so httpLink can read them
  return {
    headers: { ...headers, Authorization: token ? `Bearer ${token}` : '' },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link: authLink.concat(httpLink),
});

// eslint-disable-next-line react/prop-types
export const ApolloProviderWrapper = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
