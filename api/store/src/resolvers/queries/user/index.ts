import { getUserBySubdomain } from '../../../controllers/users/get-user-by-subdomain';
import { Logger } from '../../../utils';

export const getMeQuery = async (_parent: any, args: null, context) => {
  // Maybe we should fetch the user from the DB here if we want less stuff in the context
  return context.user;
};

export const checkIfSubdomainIsAvailableQuery = async (
  _source: any,
  { subdomain },
  context
) => {
  try {
    const user = await getUserBySubdomain({ subdomain });
    if (user) {
      return false;
    }
    return true;
  } catch (err) {
    Logger.error(err);
    return false;
  }
};
