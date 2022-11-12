import { useQuery } from '@apollo/client';
import { message } from 'components-library';
import { IInventoryItem } from 'hooks/cart';
import { GET_STORE_DATA } from 'queries';
import * as React from 'react';
import {
  createContext,
  useCallback,
  ReactNode,
  FC,
  useEffect,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from 'utils';

const subDomain = window.location.hostname.split('.')[0];

const hasSubdomain =
  window.location.hostname.replace('.xyz', '').split('.').length === 2;

console.log('hasSubdomain', hasSubdomain);

interface IStoreContext {
  store: any;
  inventory: IInventoryItem[];
  isLoading: boolean;
  refetchInventory: () => void;
}

export const StoreContext = createContext<IStoreContext>({} as IStoreContext);

const pollInterval = Number(process.env.REACT_APP_POLL_INTERVAL) ?? 0;

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const {
    data,
    loading: isLoading,
    refetch: refetchInventory,
  } = useQuery(GET_STORE_DATA, {
    skip: !hasSubdomain,
    pollInterval,
    fetchPolicy: 'cache-and-network',
  });

  const store = data?.getStoreData?.store;
  const products = data?.getStoreData?.products;

  const navigate = useNavigate();

  useEffect(() => {
    // Make sure the app has a subdomain to check for
    if (hasSubdomain && !isLoading && !store) {
      message.error('The store did not exits.');
      window.location.href =
        window.location.origin.replace(`${subDomain}.`, '') +
        routes.storeNotFound;
    }
  }, [navigate, isLoading, store]);

  const getCtx = useCallback(() => {
    return {
      store,
      inventory: products,
      isLoading,
      refetchInventory,
    };
  }, [store, products, isLoading, refetchInventory]);

  return (
    <StoreContext.Provider value={getCtx()}>{children}</StoreContext.Provider>
  );
};

export default StoreContext.Consumer;

export const useStore = () => {
  return useContext(StoreContext);
};
