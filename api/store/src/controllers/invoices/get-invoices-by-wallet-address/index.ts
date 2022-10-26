import { InvoiceModel } from '../../../models/invoice';
import { Logger } from '../../../utils';
import { getUserBySubdomain } from '../../users/get-user-by-subdomain';

export const getInvoicesByWalletAddress = async (
  walletAddress: string,
  subdomain: string
) => {
  let invoices: any = [];
  try {
    const store = await getUserBySubdomain({ subdomain });
    const storeId = store?._id;

    invoices = await InvoiceModel.find({
      storeId,
      customerWalletAddress: walletAddress,
    }).sort({ createdAt: -1 });
  } catch (err) {
    Logger.error(err);
  }

  return invoices;
};
