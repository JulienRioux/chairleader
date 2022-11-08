import { useCurrency } from 'hooks/currency';
import { useStore } from 'hooks/store';
import * as React from 'react';
import { useContext } from 'react';
import { Logger, routes, StorageKeys } from 'utils';
import {
  createContext,
  useCallback,
  useState,
  ReactNode,
  FC,
  useEffect,
  useMemo,
} from 'react';
import { message } from 'components-library';
import { useSearchParams } from 'react-router-dom';
import { USE_PAYMENT_LINK } from 'configs';
import { useNft } from 'hooks/nft';

export interface IInventoryItem {
  _id: string;
  qty: number;
  description: string;
  image: string;
  price: number;
  title: string;
  totalSupply: number;
  status: string;
  productType: string;
  variantNames?: string[];
  variantsValues?: [[string]];
  allPossibleVariantsObject?: any;
  productVariants?: string;
}

interface ICartContext {
  cartItems: IInventoryItem[];
  updateQuantity: (args: any) => void;
  removeItemFromCart: (args: any) => void;
  totalPrice: number;
  totalSaleTax: number;
  totalWithSaleTax: number;
  resetCart: () => void;
  getCartSummaryForInvoice: (
    storeNfts: any[],
    checkIfUserCanPurchaseTokenGatedProduct: any
  ) => any;
  cartItemsNumber: number;
  handleAddCustomItems: ({
    title,
    price,
  }: {
    title: string;
    price: number;
  }) => void;
  getPaymentLink: () => any;
  shippingFee: number;
  discount: number;
}

export interface ICartItem {
  _id: string;
  qty: number;
  productVariants?: string;
  price: number;
}

export const CartContext = createContext<ICartContext>({} as ICartContext);

/** Get the cart items stored as key in LocalStorage
 * In the future, we'll need to check if the stored items still available and remove it from the list if not
 */
const getLocalStorageCartItems = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(StorageKeys.CART_ITEMS) ?? '[]') ?? []
    );
  } catch (err) {
    Logger.error(err);
    return [];
  }
};

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>(
    getLocalStorageCartItems()
  );

  // Custom items
  const [customItems, setCustomItems] = useState<IInventoryItem[]>([]);

  const { decimals } = useCurrency();

  const { inventory, store } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const inventoryAndCustomItems = useMemo(
    () => [...customItems, ...inventory],
    [customItems, inventory]
  );

  const SALE_TAX_PERCENT = store?.saleTax / 100 ?? 0;

  const updateQuantity = useCallback(
    ({
      id,
      qty,
      productVariants,
      price,
    }: {
      id: string;
      qty: number;
      productVariants?: string;
      price: number;
    }) => {
      const itemIsInCart = cartItems.find(
        (item) => item._id === id && item.productVariants === productVariants
      );
      if (itemIsInCart) {
        // TODO: Make it work for the products with variants
        const updatedCartITems = cartItems.map((item) =>
          item._id === id && item.productVariants === productVariants
            ? { ...item, qty, productVariants, price }
            : item
        );
        setCartItems(updatedCartITems);
        return;
      }
      setCartItems([{ _id: id, qty, productVariants, price }, ...cartItems]);
    },
    [cartItems]
  );

  const handleAddCustomItems = useCallback(
    ({ title, price }: { title: string; price: number }) => {
      console.log('TODO');
      // TODO: Uncomment this and fix the type issues
      // const customItemId = `CUSTOM_ITEM_${uuid()}`;
      // const newCustomItem = {
      //   _id: customItemId,
      //   qty: 1,
      //   description: '',
      //   image: '',
      //   price,
      //   title,
      //   totalSupply: 1,
      //   status: 'published',
      // };
      // // Add the custom item to the custom item array
      // setCustomItems([...customItems, newCustomItem]);
      // // Add the item to the cart item
      // setCartItems([{ _id: customItemId, qty: 1 }, ...cartItems]);
    },
    []
  );

  const removeItemFromCart = useCallback(
    ({ id, productVariants }: { id: string; productVariants?: string }) => {
      // Make sure we're deleting the right product if it's a product with variant using productVariants field
      const updatedCartITems = cartItems.filter(
        (item) => item.productVariants !== productVariants || item._id !== id
      );

      setCartItems(updatedCartITems);
    },
    [cartItems]
  );

  useEffect(() => {
    // Update the local stored cart items whenever it is being changed
    localStorage.setItem(StorageKeys.CART_ITEMS, JSON.stringify(cartItems));
  }, [cartItems]);

  // // Make sure we're on a good quantity state (i.e. if unavailable, remove from cart)
  // useEffect(() => {
  //   // Don'T run this if we did not add the items from URL yet
  //   const gettingCartFromUrl =
  //     searchParams.get('payment_link_items') ||
  //     searchParams.get('custom_items');
  //   if (gettingCartFromUrl) {
  //     return;
  //   }
  //   // TODO: We'll need to make sure we're not changing the qty when someone is making a payment
  //   let cartItemsChanged = false;
  //   const itemRelativeToTotalSupply = cartItems.reduce(
  //     (acc: ICartItem[], currItem: ICartItem) => {
  //       const item = inventoryAndCustomItems?.find(
  //         (product) => currItem._id === product._id
  //       );

  //       // If the item did not exists anymore or has a supply of 0, remove it from the cart
  //       if (!item?.totalSupply) {
  //         message.info('Some of the items are not available anymore.');
  //         cartItemsChanged = true;
  //         return acc;
  //       }
  //       if (item?.totalSupply && item?.totalSupply < currItem.qty) {
  //         // otherwise, set the qty to the totalSypply
  //         currItem.qty = item.totalSupply;
  //         message.info('Item quantity changed due to remaining supply.');
  //         cartItemsChanged = true;
  //       }
  //       return [...acc, currItem] as ICartItem[];
  //     },
  //     []
  //   );

  //   if (cartItemsChanged) {
  //     setCartItems(itemRelativeToTotalSupply);
  //   }
  // }, [cartItems, inventoryAndCustomItems, searchParams]);

  const resetCart = useCallback(() => {
    setCartItems([]);
    localStorage.setItem(StorageKeys.CART_ITEMS, '[]');
  }, []);

  const populatedCartItems = cartItems.map((cartItem) => ({
    ...inventoryAndCustomItems?.find((product) => cartItem._id === product._id),
    qty: cartItem.qty,
    productVariants: cartItem.productVariants,
    price: cartItem.price,
  })) as IInventoryItem[];

  const totalPrice = Number(
    populatedCartItems
      .reduce((acc, curr) => curr.price * curr.qty + acc, 0)
      ?.toFixed(decimals)
  );

  const totalSaleTax = Number(
    (totalPrice * SALE_TAX_PERCENT)?.toFixed(decimals)
  );

  const shippingFee = store.shippingFee;

  const totalWithSaleTax = Number(
    (totalPrice + totalSaleTax + shippingFee)?.toFixed(decimals)
  );

  const cartItemsNumber = cartItems.reduce((acc, curr) => acc + curr.qty, 0);

  // Prepare the URL params for the payent link
  const getPaymentLink = useCallback(() => {
    const params = `?payment_link_items=${encodeURIComponent(
      JSON.stringify(cartItems)
    )}&custom_items=${encodeURIComponent(JSON.stringify(customItems))}`;

    const paymentLink = `${window.location.origin}${routes.store.cart}${params}`;

    navigator.clipboard.writeText(paymentLink);
    message.success(`The payment link has been copied to your clipboard.`);
  }, [cartItems, customItems]);

  useEffect(() => {
    if (!USE_PAYMENT_LINK) {
      return;
    }
    try {
      const customItemsFromUrl = searchParams.get('custom_items');
      // Get the custom items
      if (customItemsFromUrl) {
        const parsedCustomItemsFromUrl = JSON.parse(customItemsFromUrl);
        setCustomItems(parsedCustomItemsFromUrl);
      }
      // Get the cart items
      const paymentLinkItems = searchParams.get('payment_link_items');
      if (paymentLinkItems) {
        const parsedPaymentLinkItems = JSON.parse(paymentLinkItems);
        setCartItems(parsedPaymentLinkItems);
      }
    } catch (err) {
      Logger.error(err);
    }
    setSearchParams('');
    // Make sure we're only running this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Return the cartItems as an array of object in a JSON string, the total price before and after tax + the sale tax. */
  const getCartSummaryForInvoice = useCallback(
    (storeNfts: any[], checkIfUserCanPurchaseTokenGatedProduct: any) => {
      // Add the NFT exclusivity data to the cart items if the items have been bought with NFTs memberships
      const cartItemsWithNfts = populatedCartItems.map(
        (singleCartItem: any) => {
          // Check if the product is token gated
          const { isTokenGated, nftPrintedEdition, nftMasterEdition } =
            checkIfUserCanPurchaseTokenGatedProduct(singleCartItem?._id);

          return {
            ...singleCartItem,
            nftPrintedEdition,
            nftMasterEdition,
            isTokenGated,
          };
        }
      );

      return {
        cartItems: JSON.stringify(cartItemsWithNfts),
        totalPrice,
        totalSaleTax,
        totalWithSaleTax,
        shippingFee,
      };
    },
    [
      populatedCartItems,
      totalPrice,
      totalSaleTax,
      totalWithSaleTax,
      shippingFee,
    ]
  );

  const { nftDiscount } = useNft();

  const getCtx = useCallback(() => {
    return {
      cartItems: populatedCartItems,
      updateQuantity,
      removeItemFromCart,
      totalPrice,
      totalSaleTax,
      totalWithSaleTax,
      resetCart,
      getCartSummaryForInvoice,
      cartItemsNumber,
      handleAddCustomItems,
      getPaymentLink,
      shippingFee,
      discount: nftDiscount,
    };
  }, [
    populatedCartItems,
    updateQuantity,
    removeItemFromCart,
    totalPrice,
    totalSaleTax,
    totalWithSaleTax,
    resetCart,
    getCartSummaryForInvoice,
    cartItemsNumber,
    handleAddCustomItems,
    getPaymentLink,
    shippingFee,
    nftDiscount,
  ]);

  return (
    <CartContext.Provider value={getCtx()}>{children}</CartContext.Provider>
  );
};

export default CartContext.Consumer;

export const useCart = () => {
  return useContext(CartContext);
};
