import { ApolloError } from '@apollo/client';

export interface IAuthContext {
  isLoading: boolean;
  user: any; // TODO: Type it
  isAuthenticated: () => boolean;
  refetchMe: () => void;
  error?: ApolloError;
  logoutLoading: boolean;
  logoutUser: () => void;
  updateUser: any;
  updateUserIsLoading: boolean;
  currencyDecimals: number;
}
