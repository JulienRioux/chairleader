import { useMutation, useQuery } from '@apollo/client';
import { message } from 'components-library';
import { GET_ME, UPDATE_USER } from 'queries';
import { createContext, useCallback, useContext, useState } from 'react';
import * as React from 'react';
import { IBaseProps } from 'types';
import { StorageKeys } from 'utils/local-storage';

import { IAuthContext } from './types';
import { CURRENCY } from 'hooks/currency';

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<IBaseProps> = ({ children }) => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const {
    loading: isLoadingUser,
    error,
    data: UserData,
    refetch: refetchMe,
    client,
  } = useQuery(GET_ME);
  const user = UserData?.getMe ?? null;

  const [updateUser, { loading: updateUserIsLoading }] =
    useMutation(UPDATE_USER);

  // TODO: Make a guard to check if the user is loading, if redirect certain routes if the user is not auth (or create an hook)
  const authenticatedUser = !!user;
  /** Simple function to check if the user is authenticated */
  const isAuthenticated = useCallback(() => {
    return authenticatedUser;
  }, [authenticatedUser]);

  const updateUserAndRefetch = useCallback(
    async ({
      storeName,
      walletAddress,
      subDomain,
      currency,
      saleTax,
      image,
      shippingFee,
      theme,
      homepage,
      heroImage,
      social,
    }: {
      storeName: string;
      walletAddress: string;
      subDomain: string;
      currency: CURRENCY;
      saleTax: number;
      image: File;
      shippingFee: number;
      theme: any;
      homepage: any;
      heroImage: File;
      social: any;
    }) => {
      await updateUser({
        variables: {
          storeName,
          walletAddress,
          subDomain,
          currency,
          saleTax,
          image,
          shippingFee,
          theme,
          homepage,
          heroImage,
          social,
        },
      });
      await refetchMe();
    },
    [refetchMe, updateUser]
  );

  /** Logout the user */
  const logoutUser = useCallback(async () => {
    setLogoutLoading(true);
    localStorage.removeItem(StorageKeys.TOKEN);
    localStorage.removeItem(StorageKeys.USER_ID);
    localStorage.removeItem(StorageKeys.USER_EMAIL);
    await client.resetStore();
    setLogoutLoading(false);
    message.customIcon('See you later!', 3.5, '👋');
  }, [client]);

  const getCtx = useCallback(() => {
    return {
      error,
      isAuthenticated,
      isLoading: isLoadingUser,
      logoutLoading,
      logoutUser,
      refetchMe,
      updateUser: updateUserAndRefetch,
      updateUserIsLoading,
      user,
      currencyDecimals: user?.currency === CURRENCY.SOL ? 9 : 6,
    };
  }, [
    error,
    isAuthenticated,
    isLoadingUser,
    logoutLoading,
    logoutUser,
    refetchMe,
    updateUserAndRefetch,
    updateUserIsLoading,
    user,
  ]);

  return (
    <AuthContext.Provider value={getCtx()}>{children}</AuthContext.Provider>
  );
};

export default AuthContext.Consumer;

export const useAuth = () => {
  return useContext(AuthContext);
};
