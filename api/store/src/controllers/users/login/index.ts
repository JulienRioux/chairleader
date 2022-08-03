import { UserModel } from '../../../models/user';
import {
  generateOpt,
  get20MinutesFromNow,
  sendLoginEmail,
} from '../../../utils';

export const login = async ({ user, email, hostname }) => {
  const validationCode = generateOpt();
  await UserModel.findByIdAndUpdate(
    user._id,
    { auth: { code: validationCode, expiration: get20MinutesFromNow() } },
    { upsert: true }
  );
  // Send the login email to the user
  return sendLoginEmail({ email, hostname, validationCode });
};
