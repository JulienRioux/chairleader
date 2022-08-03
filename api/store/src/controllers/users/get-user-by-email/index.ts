import { UserModel } from '../../../models/user';
import { Logger } from '../../../utils';

/**
 * This function find a user with an email.
 */
export const getUserByEmail = async ({ email }: { email: string }) => {
  try {
    // Return the user or null
    const user = await UserModel.findOne({ email });
    return user;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};
