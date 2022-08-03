import { getUserByEmail } from '../../../controllers/users/get-user-by-email';
import { login } from '../../../controllers/users/login';
import { signup } from '../../../controllers/users/signup';
import { updateUser } from '../../../controllers/users/update-user';
import { Logger, generateJwt } from '../../../utils';

export const authenticateMutation = async (
  _source: any,
  { email, hostname }
) => {
  const user = await getUserByEmail({ email });

  if (user) {
    // Login the user if he exists
    try {
      return login({ email, hostname, user });
    } catch (err) {
      Logger.error(err);
      throw new Error('Something went wrong sending login email.');
    }
  }
  // Signup the user if it did not exists
  try {
    return signup({ email, hostname });
  } catch (err) {
    Logger.error(err);
    throw new Error('Something went wrong while signing up.');
  }
};

const checkIfExpired = (expiryDate) => {
  if (new Date().getTime() <= new Date(expiryDate).getTime()) {
    return false;
  }

  return true;
};

export const validateOtpMutation = async (
  _source: any,
  { email, validationCode }
) => {
  const user = await getUserByEmail({ email });

  if (user) {
    const { code, expiration } = user.auth;

    const isExpired = checkIfExpired(expiration);
    if (isExpired) {
      return { message: 'CODE_EXPIRED', status: 401, token: '' };
    }
    if (code === validationCode) {
      // Sending the user ID instead of the email so it's quicker to query (n)
      const userId = user?._id.toString();
      const jwtToken = generateJwt(userId);
      return { message: 'VALID_CODE', status: 200, token: jwtToken };
    }
    return { message: 'INVALID_CODE', status: 200, token: '' };
  }
  return { message: 'INVALID_EMAIL', status: 401, token: '' };
};

export const updateUserMutation = async (
  _source: any,
  { storeName, walletAddress, subDomain, currency, saleTax, image },
  context
) => {
  const id = context?.user?._id;

  try {
    const user = await updateUser({
      id,
      storeName,
      walletAddress,
      subDomain,
      currency,
      saleTax,
      image,
    });
    if (user) {
      return user;
    }
  } catch (err) {
    Logger.error(err);
    return null;
  }
  return null;
};
