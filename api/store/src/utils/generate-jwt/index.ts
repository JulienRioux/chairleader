import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Setup the time to login to 24 hours, after the link won't be valid
const TIME_TO_LOGIN = 24;

export const generateJwt = async (userId: string) => {
  const date = new Date();
  date.setHours(date.getHours() + TIME_TO_LOGIN);
  return jwt.sign({ userId }, process.env.AUTH_JWT_SECRET ?? '');
};
