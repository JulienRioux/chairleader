import { useAuth } from 'hooks/auth';
import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { routes } from 'utils';

const guardedRoutes = [routes.completeSignup, routes.admin.base];
const nonAuthOnlyRoutes = [routes.auth, routes.magicLink];

/**
 * AuthRequired description:
 * This is a wrapper that make sure the user is auth and redirect to the auth page if not.
 */
export const AuthRequired = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading: userIsLoading, user } = useAuth();

  // Wait for the user to be loaded before redirecting the user
  if (!userIsLoading) {
    if (
      user &&
      !user.storeName &&
      !user.walletAddress &&
      pathname !== routes.completeSignup
    ) {
      return <Navigate to={routes.completeSignup} />;
    }

    // If the user is on a guarded route and is not auth, send a message and redirect to auth
    const basePath = `/${pathname.split('/')[1]}`;
    const needToBeAuth = guardedRoutes.includes(basePath);
    if (needToBeAuth && !isAuthenticated()) {
      return <Navigate to={routes.base} />;
    }

    const needToBeUnauth = nonAuthOnlyRoutes.includes(basePath);
    if (needToBeUnauth && isAuthenticated()) {
      return <Navigate to={routes.admin.inventory} />;
    }
  }

  return children;
};
