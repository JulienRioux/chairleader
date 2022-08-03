import { getUserBySubdomain } from '../../../controllers/users/get-user-by-subdomain';
import { ProductModel } from '../../../models/product';

export const getStoreDataQuery = async (_source: any, args, { subdomain }) => {
  const store = await getUserBySubdomain({ subdomain });

  let products;

  if (store?._id) {
    products = await ProductModel.find({ storeId: store._id.toString() });
  }

  return {
    store,
    products,
  };
};
