import { useQuery } from '@apollo/client';
import { useAuth } from 'hooks/auth';
import { ICartItem, IInventoryItem } from 'hooks/cart';
import { GET_PRODUCTS_BY_USER_ID } from 'queries';
import * as React from 'react';
import {
  createContext,
  useCallback,
  ReactNode,
  FC,
  useEffect,
  useContext,
} from 'react';

interface IInventoryContext {
  inventory: IInventoryItem[];
  isLoading: boolean;
  getItemById: (id: string) => void;
}

export const InventoryContext = createContext<IInventoryContext>(
  {} as IInventoryContext
);

const pollInterval = Number(process.env.REACT_APP_POLL_INTERVAL) ?? 0;

export const InventoryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    loading: isLoading,
    data: inventory,
    refetch,
  } = useQuery(GET_PRODUCTS_BY_USER_ID, {
    pollInterval,
  });

  const { user } = useAuth();

  const getItemById = useCallback(
    (id: string) => {
      const currentItem = inventory?.find((item: ICartItem) => item._id === id);
      return currentItem;
    },
    [inventory]
  );

  useEffect(() => {
    refetch();
  }, [refetch, user]);

  const getCtx = useCallback(() => {
    return {
      inventory: inventory?.getProductsByUserId ?? [],
      isLoading,
      getItemById,
    };
  }, [inventory?.getProductsByUserId, isLoading, getItemById]);

  return (
    <InventoryContext.Provider value={getCtx()}>
      {children}
    </InventoryContext.Provider>
  );
};

export default InventoryContext.Consumer;

export const useInventory = () => {
  return useContext(InventoryContext);
};
