import { ProductModel } from '../../../models/product';

export const getProductById = async (id: string) => {
  return await ProductModel.findById(id);
};
