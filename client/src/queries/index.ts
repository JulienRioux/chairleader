import { gql } from '@apollo/client';

// ============
//    Users
// ============

export const GET_ME = gql`
  query GetMe {
    getMe {
      email
      _id
      storeName
      walletAddress
      subDomain
      currency
      saleTax
      image
    }
  }
`;

export const AUTHENTICATE = gql`
  mutation Authenticate($email: String!, $hostname: String!) {
    authenticate(email: $email, hostname: $hostname) {
      status
      message
    }
  }
`;

export const VALIDATE_OTP = gql`
  mutation ValidateOtp($email: String!, $validationCode: String!) {
    validateOtp(email: $email, validationCode: $validationCode) {
      status
      message
      token
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $storeName: String
    $walletAddress: String
    $subDomain: String
    $currency: String
    $saleTax: Float
    $image: Upload
  ) {
    updateUser(
      storeName: $storeName
      walletAddress: $walletAddress
      subDomain: $subDomain
      currency: $currency
      saleTax: $saleTax
      image: $image
    ) {
      storeName
      walletAddress
      subDomain
      currency
      saleTax
      image
    }
  }
`;

// ============
//   Products
// ============

export const GET_PRODUCTS_BY_USER_ID = gql`
  query GetProductsByUserId {
    getProductsByUserId {
      _id
      image
      title
      price
      description
      totalSupply
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct(
    $title: String!
    $image: Upload
    $description: String
    $price: String!
    $totalSupply: String!
  ) {
    addProduct(
      title: $title
      image: $image
      description: $description
      price: $price
      totalSupply: $totalSupply
    ) {
      title
      storeId
      image
      description
      price
      totalSupply
    }
  }
`;

export const DELETE_PRODUCT_BY_ID = gql`
  mutation DeleteProductById($id: String!) {
    deleteProductById(id: $id) {
      _id
      title
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation EditProduct(
    $title: String
    $image: Upload
    $description: String
    $price: String
    $totalSupply: String
    $productId: String!
  ) {
    editProduct(
      title: $title
      image: $image
      description: $description
      price: $price
      totalSupply: $totalSupply
      productId: $productId
    ) {
      title
      storeId
      image
      description
      price
      totalSupply
    }
  }
`;

export const SAVE_TRANSACTION_INVOICE = gql`
  mutation SaveTransactionInvoice(
    $cartItems: String!
    $signature: String!
    $totalPrice: Float!
    $totalSaleTax: Float!
    $totalWithSaleTax: Float!
    $customerWalletAddress: String!
    $storeId: String!
    $currency: String!
    $network: String!
    $serviceFees: Float!
  ) {
    saveTransactionInvoice(
      cartItems: $cartItems
      signature: $signature
      totalPrice: $totalPrice
      totalSaleTax: $totalSaleTax
      totalWithSaleTax: $totalWithSaleTax
      customerWalletAddress: $customerWalletAddress
      storeId: $storeId
      currency: $currency
      network: $network
      serviceFees: $serviceFees
    ) {
      _id
      signature
    }
  }
`;

// ============
//   Invoices
// ============

export const GET_INVOICES_BY_STORE_ID = gql`
  query GetInvoicesByStoreId {
    getInvoicesByStoreId {
      createdAt
      _id
      signature
      totalPrice
      totalSaleTax
      totalWithSaleTax
      customerWalletAddress
      currency
      network
      serviceFees
      cartItems {
        title
        _id
        image
        title
        price
        description
        totalSupply
        qty
      }
    }
  }
`;

// ============
//   Store
// ============
export const GET_STORE_DATA = gql`
  query GetStoreData {
    getStoreData {
      store {
        email
        _id
        storeName
        walletAddress
        subDomain
        currency
        saleTax
        image
      }
      products {
        _id
        image
        title
        price
        description
        totalSupply
      }
    }
  }
`;

export const GET_INVOICE_BY_ID = gql`
  query GetInvoiceById($id: String!) {
    getInvoiceById(id: $id) {
      createdAt
      _id
      signature
      totalPrice
      totalSaleTax
      totalWithSaleTax
      customerWalletAddress
      currency
      network
      serviceFees
      cartItems {
        title
        _id
        image
        title
        price
        description
        totalSupply
        qty
      }
    }
  }
`;

export const CHECK_IF_SUBODMAIN_IS_AVAILABLE = gql`
  query CheckIfSubdomainIsAvailable($subdomain: String!) {
    checkIfSubdomainIsAvailable(subdomain: $subdomain)
  }
`;

const NFT = gql`
  {
    storeId
    nftAddress
    productsUnlocked
    _id
  }
`;

export const ADD_NFT = gql`
  mutation AddNft($nftAddress: String!) {
    addNft(nftAddress: $nftAddress) ${NFT}
  }
`;

export const FIND_NFT_BY_ADDRESS = gql`
  query FindNftByAddress($nftAddress: String!) {
    findNftByAddress(nftAddress: $nftAddress) ${NFT}
  }
`;

export const FIND_NFT_BY_STORE_ID = gql`
  query FindNftsByStoreId {
    findNftsByStoreId ${NFT}
  }
`;

export const UPDATE_NFT = gql`
  mutation UpdateNft($id: String!, $productsUnlocked: [String]) {
    updateNft(id: $id, productsUnlocked: $productsUnlocked) ${NFT}
  }
`;
