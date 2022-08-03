export const schemaTypes = `
  type Store {
    email: String!
    _id: ID
    storeName: String
    walletAddress: String
    subDomain: String
    currency: String
    image: String
    saleTax: Float
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
  }

  type CartItem {
    _id: String
    qty: Int
    description: String
    image: String
    price: Float
    title: String
    totalSupply: Int
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
  }

  type StoreData {
    store: Store
    products: [Product]
  }

    scalar Upload
`;
