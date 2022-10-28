import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

import { emailTemplate } from '../auth-email-template';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?? '';

sgMail.setApiKey(SENDGRID_API_KEY);

export const APP_EMAIL_ADDRESS = 'hello@chairleader.xyz';

/** Generating the JWT token and format the email message  */
export const formatAuthEmailMsg = ({ email, authLink, validationCode }) => {
  // Formatting the JWT magic link
  const content = emailTemplate({ link: authLink, validationCode });
  // return the format object to send to sendgrig
  return {
    from: {
      email: APP_EMAIL_ADDRESS,
      name: 'Chairleader',
    },
    html: content,
    subject: `Your validation code is ${validationCode} 🔐`,
    text: content,
    to: email,
  };
};
