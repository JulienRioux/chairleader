import { UserModel } from '../../../models/user';
import { Logger } from '../../../utils';

/**
 * This function find a user with an subdomain.
 */
export const getUserBySubdomain = async ({
  subdomain,
}: {
  subdomain: string;
}) => {
  if (!subdomain) {
    return null;
  }
  try {
    // Return the user or null
    const user = await UserModel.findOne({ subDomain: subdomain });
    return user;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};
