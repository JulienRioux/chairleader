import { gql } from 'apollo-server-lambda';

export const schemaTypes = gql`
  type Store {
    email: String!
    _id: ID
    storeName: String
    walletAddress: String
    subDomain: String
    currency: String
    image: String
    saleTax: Float
    shippingFee: Float
  }

  type AuthenticateResponse {
    status: Int
    message: String
  }

  type ValidateOtpResponse {
    status: Int
    message: String
    token: String
  }

  type Product {
    _id: String
    title: String!
    storeId: String!
    image: String
    description: String
    price: Float
    totalSupply: Int
    status: String
    productType: String
    variantNames: [String]
    variantsValues: [[String]]
    allPossibleVariantsObject: Object
  }

  type CartItem {
    _id: String
    qty: Int
    description: String
    image: String
    price: Float
    title: String
    totalSupply: Int
    status: String
    productType: String
  }

  type Invoice {
    _id: String
    cartItems: [CartItem]
    signature: String
    totalPrice: Float
    totalSaleTax: Float
    totalWithSaleTax: Float
    createdAt: String
    customerWalletAddress: String
    currency: String
    network: String
    serviceFees: Float
    shippingFee: Float
    email: String
    name: String
    country: String
    address: String
    city: String
    state: String
    postalCode: String
    fulfillmentStatus: String
  }

  type StoreData {
    store: Store
    products: [Product]
  }

  type Nft {
    _id: String
    storeId: String
    nftAddress: String
    productsUnlocked: [String]
    isArchived: Boolean
  }

  scalar Upload

  scalar Object
`;
