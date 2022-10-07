import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import * as React from 'react';
import { StorageKeys } from 'utils';

const STORE_API_URL = 'https://6ithbfrif8.execute-api.us-east-1.amazonaws.com';

const uri = `${
  process.env.REACT_APP_USE_LOCAL_STORE_API === 'true'
    ? 'http://localhost:9900'
    : STORE_API_URL
}/dev/graphql`;

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
