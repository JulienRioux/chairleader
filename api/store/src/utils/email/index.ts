import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { Logger } from '../logger';

import { formatAuthEmailMsg } from './format-auth-email';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');

export const sendLoginEmail = async ({ email, hostname, validationCode }) => {
  // Generate the auth link
  const authLink = `${hostname}/magic-link/${email}/?validationCode=${validationCode}`;

  // Generating the email
  const msg = formatAuthEmailMsg({ authLink, email, validationCode });

  // Trying to send the email with sendgrid
  try {
    const res = await sgMail.send(msg);
    return {
      message: 'Email sent!',
      status: res[0]?.statusCode,
    };
  } catch (err) {
    Logger.error(err);
    // Do something with the err (Datadog log?)
    return {
      message: 'Cannot send email!',
      status: err?.code,
    };
  }
};

export const sendEmail = async ({ fromEmail, toEmail, subject, content }) => {
  const emailObject = {
    from: fromEmail,
    html: content,
    subject,
    text: content,
    to: toEmail,
  };

  // Trying to send the email with sendgrid
  try {
    const res = await sgMail.send(emailObject);
    return {
      message: 'Email sent!',
      status: res[0]?.statusCode,
    };
  } catch (err) {
    Logger.error(err);
    return {
      message: 'Cannot send email!',
      status: err?.code,
    };
  }
};

export const sendEmailTemplate = async ({
  fromEmail,
  toEmail,
  subject,
  templateId,
  dynamicTemplateData,
}) => {
  const emailObject = {
    dynamicTemplateData,
    from: fromEmail,
    subject,
    templateId,
    to: toEmail,
  };

  // Trying to send the email with sendgrid
  try {
    const res = await sgMail.send(emailObject);
    return {
      message: 'Email sent!',
      status: res[0]?.statusCode,
    };
  } catch (err) {
    Logger.error(err);
    return {
      message: 'Cannot send email!',
      status: err?.code,
    };
  }
};
