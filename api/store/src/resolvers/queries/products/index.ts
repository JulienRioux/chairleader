import { ProductModel } from '../../../models/product';

export const getProductsByUserIdQuery = async (
  _parent: any,
  args: null,
  { user }
) => {
  // Get the user ID from the header and retrieve the inventory
  const products = await ProductModel.find({ storeId: user._id });
  return products;
};
