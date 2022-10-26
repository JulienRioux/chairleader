import { getUserBySubdomain } from '../../../controllers/users/get-user-by-subdomain';
import { sendEmail } from '../../../utils';
import { templateWrapper } from '../../../utils/email/template-components';

export const contactStoreMutation = async (
  _source: any,
  { name, email, subject, message },
  context
) => {
  const content = `
      <p>Please respond to the customer email directly.</p>
      <div style="border-bottom: 1px solid #eee;"> </div>
      <p>Message from: ${name}</p>
      <div style="border-bottom: 1px solid #eee;"> </div>
      <p>Customer email: ${email}</p>
      <div style="border-bottom: 1px solid #eee;"> </div>
      <p>Subject: ${subject}</p>
      <div style="border-bottom: 1px solid #eee;"> </div>
      <p>Message:</p>
      <div style="padding: 16px; background: #00000007; border-radius: 12px; border: 1px solid #eeeeee;">${message}</div>
    `;

  const emailContent = templateWrapper({
    headTitle: 'Chairleader | New message from customer',
    buttonText: 'Open Chairleader',
    link: 'https://chairleader.xyz/',
    header: 'New message from customers',
    content,
  });

  const store = await getUserBySubdomain({ subdomain: context.subdomain });
  const storeEmail = store;

  return sendEmail({
    toEmail: storeEmail?.email,
    subject: 'Chairleader | New message from customer',
    content: emailContent,
  });
};
