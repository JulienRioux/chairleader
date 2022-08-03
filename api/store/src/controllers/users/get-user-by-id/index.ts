import { UserModel } from '../../../models/user';
import { Logger } from '../../../utils';

/**
 * This function find a user with an ID.
 */
export const getUserById = async (id: string) => {
  try {
    // Return the user or null
    const user = await UserModel.findById(id);
    return user;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};
