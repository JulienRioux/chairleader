import {
  addProductMutation,
  deleteProductByIdMutation,
  editProductMutation,
} from './product';
import {
  authenticateMutation,
  validateOtpMutation,
  updateUserMutation,
} from './user';
import {
  saveTransactionInvoiceMutation,
  updateInvoiceMutation,
} from './invoice';
import { addNftMutation, updateNftMutation } from './nft';
import { contactStoreMutation } from './contact';

export const Mutation = {
  authenticate: authenticateMutation,
  validateOtp: validateOtpMutation,
  updateUser: updateUserMutation,
  addProduct: addProductMutation,
  deleteProductById: deleteProductByIdMutation,
  editProduct: editProductMutation,
  saveTransactionInvoice: saveTransactionInvoiceMutation,
  addNft: addNftMutation,
  updateNft: updateNftMutation,
  updateInvoice: updateInvoiceMutation,
  contactStore: contactStoreMutation,
};
