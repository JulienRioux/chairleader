import { InvoiceModel } from '../../../models/invoice';
import { ProductModel } from '../../../models/product';
import { asyncForEach, Logger, sendEmail } from '../../../utils';
import { templateWrapper } from '../../../utils/email/template-components';
import { getUserById } from '../../users/get-user-by-id';

export const addInvoice = async ({
  signature,
  totalPrice,
  totalSaleTax,
  totalWithSaleTax,
  cartItems,
  storeId,
  customerWalletAddress,
  currency,
  network,
  serviceFees,
  shippingFee,
  email,
  name,
  country,
  address,
  city,
  state,
  postalCode,
  isNft,
}: {
  signature: string;
  totalPrice: number;
  totalSaleTax: number;
  totalWithSaleTax: number;
  cartItems: any;
  storeId: string;
  customerWalletAddress: string;
  currency: string;
  network: string;
  serviceFees: number;
  shippingFee: number;
  email: string;
  name: string;
  country: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  isNft: boolean;
}) => {
  try {
    const doc = new InvoiceModel({
      signature,
      totalPrice,
      totalSaleTax,
      totalWithSaleTax,
      cartItems,
      storeId,
      customerWalletAddress,
      currency,
      network,
      serviceFees,
      shippingFee,
      email,
      name,
      country,
      address,
      city,
      state,
      postalCode,
      fulfillmentStatus: isNft ? 'fulfilled' : 'unfulfilled',
      isNft,
    });

    // Updating the product quantity
    await asyncForEach(
      cartItems,
      async ({
        _id,
        qty,
        productType,
        productVariants,
      }: {
        _id: string;
        qty: number;
        productType: string;
        productVariants: string;
      }) => {
        // Do not change the qty for custom items
        if (_id.startsWith('CUSTOM_ITEM_')) {
          return;
        }
        // SIMPLE_PRODUCT inventory management
        if (productType === 'simpleProduct') {
          await ProductModel.findByIdAndUpdate(
            { _id },
            { $inc: { totalSupply: -qty } }
          );
        }
        // SIMPLE_PRODUCT inventory management
        if (productType === 'productWithVariants') {
          const productToUpdate = await ProductModel.findById(_id);
          const allPossibleVariantsObjectToUpdate = Object.assign(
            {},
            productToUpdate?.allPossibleVariantsObject
          );
          const updatedQuantity =
            Number(allPossibleVariantsObjectToUpdate[productVariants].qty) -
            qty;

          allPossibleVariantsObjectToUpdate[productVariants].qty =
            updatedQuantity.toString();

          // Update the product inventory
          await ProductModel.findByIdAndUpdate(
            { _id },
            { allPossibleVariantsObject: allPossibleVariantsObjectToUpdate }
          );
        }
      }
    );

    await doc.save();

    const currentStore = await getUserById(doc?.storeId);

    const baseContent = `
      <p>Order ID: ${doc?._id}</p>
      <div style="border-bottom: 1px solid #eee;"> </div>
      <p>Total: ${doc?.totalWithSaleTax} ${doc?.currency}</p>
      <div style="border-bottom: 1px solid #eee;"> </div>
    `;

    // =================================================
    //     Send a message to the store owner
    // =================================================
    const adminOrderPageLink = `https://chairleader.xyz/admin/payments/${doc?._id}`;

    const adminContent = `
      ${baseContent}
      <p>You can review details of this order in your shop admin at <a href="${adminOrderPageLink}">${adminOrderPageLink}</a></p>
      <div style="border-bottom: 1px solid #eee;"> </div>
    `;

    const adminEmailContent = templateWrapper({
      headTitle: 'Chairleader | New order 🎉',
      buttonText: 'Check my order',
      link: adminOrderPageLink,
      header: 'You have a new order 🎉',
      content: adminContent,
    });

    await sendEmail({
      toEmail: currentStore?.email,
      subject: 'Chairleader | New order 🎉',
      content: adminEmailContent,
    });

    // =================================================
    //   Send the confirmation email to the customer
    // =================================================

    const customerOrderPageLink = `https://${currentStore?.subDomain}.chairleader.xyz/confirmation/${doc?._id}`;

    const customerContent = `
      ${baseContent}
      <p>You can review details of this order here <a href="${customerOrderPageLink}">${customerOrderPageLink}</a></p>
      <div style="border-bottom: 1px solid #eee;"> </div>
    `;

    // TODO: Use the store image anmd the store name in the email template instead of the Chairleader one

    const customerEmailContent = templateWrapper({
      headTitle: `${currentStore?.storeName} | Order confirmation`,
      buttonText: 'Check my order',
      link: adminOrderPageLink,
      header: 'Order confirmation',
      content: customerContent,
      storeName: currentStore?.storeName,
      storeImg: currentStore?.image,
    });

    await sendEmail({
      toEmail: doc?.email,
      subject: `${currentStore?.storeName} | Order confirmation`,
      content: customerEmailContent,
    });

    return doc;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};

export const updateInvoice = async ({
  fulfillmentStatus,
  invoiceId,
}: {
  fulfillmentStatus: string;
  invoiceId: string;
}) => {
  try {
    const undatedInvoice = await InvoiceModel.findByIdAndUpdate(invoiceId, {
      fulfillmentStatus,
    });
    return undatedInvoice;
  } catch (err) {
    Logger.error(err);
    return null;
  }
};
