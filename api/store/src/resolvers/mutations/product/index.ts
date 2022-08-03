import { addProduct } from '../../../controllers/products/add-product';
import { deleteProductById } from '../../../controllers/products/delete-product';
import { editProduct } from '../../../controllers/products/edit-product';

export const addProductMutation = async (
  _source: any,
  { title, image, description, price, totalSupply },
  context
) => {
  return await addProduct({
    title,
    image,
    description,
    price,
    totalSupply,
    storeId: context.user._id,
  });
};

export const deleteProductByIdMutation = async (
  _source: any,
  { id },
  { user }
) => {
  return await deleteProductById(id);
};

export const editProductMutation = async (
  _source: any,
  { title, image, description, price, totalSupply, productId },
  context
) => {
  return await editProduct({
    title,
    image,
    description,
    price,
    totalSupply,
    storeId: context.user._id,
    productId,
  });
};
