import { PRODUCT_TYPE } from 'pages/admin-pages/product-form';

export const getProductVariantsLowestPrice = ({
  allPossibleVariantsObject,
  price,
  productType,
}: {
  allPossibleVariantsObject: any;
  price: string;
  productType: string;
}) => {
  if (productType === PRODUCT_TYPE.SIMPLE_PRODUCT) {
    return { productPrice: price, hasMultiplePrice: false };
  }
  let lowestPrice;
  let higherPrice;
  for (const key in allPossibleVariantsObject) {
    const variantPrice = Number(allPossibleVariantsObject[key].price);
    if (!lowestPrice || !higherPrice) {
      lowestPrice = variantPrice;
      higherPrice = variantPrice;
    }
    if (lowestPrice > variantPrice) {
      lowestPrice = variantPrice;
    }
    if (higherPrice < variantPrice) {
      higherPrice = variantPrice;
    }
  }
  const hasMultiplePrice = lowestPrice !== higherPrice;
  return { productPrice: lowestPrice, hasMultiplePrice };
};
