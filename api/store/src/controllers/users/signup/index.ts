import { UserModel } from '../../../models/user';
import {
  generateOpt,
  get20MinutesFromNow,
  Logger,
  sendLoginEmail,
} from '../../../utils';
import { v4 as uuid } from 'uuid';

/**
 * This function takes an email and creates the user if it did not exist
 */
export const signup = async ({
  email,
  hostname,
}: {
  email: string;
  hostname: string;
}) => {
  try {
    const validationCode = generateOpt();

    // When creating an user, the user has not accepted the T&C yet (on the signup part)
    const doc = new UserModel({
      auth: { code: validationCode, expiration: get20MinutesFromNow() },
      email,
      subDomain: uuid(), // Generating random subdomain
    });
    try {
      await doc.save();
      // Send the login email to the user
      return sendLoginEmail({ email, hostname, validationCode });
    } catch (err) {
      Logger.error(err);
    }
    return { message: 'Something went wrong...', status: 500 };
  } catch (err) {
    Logger.error(err);
    return { message: 'Something went wrong...', status: 500 };
  }
};
