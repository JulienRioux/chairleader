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
      shippingFee
      theme {
        primaryColor
      }
      homepage {
        heroTitle
        heroSubTitle
      }
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
    $shippingFee: String
    $theme: Object
    $homepage: Object
  ) {
    updateUser(
      storeName: $storeName
      walletAddress: $walletAddress
      subDomain: $subDomain
      currency: $currency
      saleTax: $saleTax
      image: $image
      shippingFee: $shippingFee
      theme: $theme
      homepage: $homepage
    ) {
      storeName
      walletAddress
      subDomain
      currency
      saleTax
      image
      shippingFee
      theme {
        primaryColor
      }
      homepage {
        heroTitle
        heroSubTitle
        heroImage
      }
    }
  }
`;

// ============
//   Products
// ============

const PRODUCT = gql`
  {
    _id
    image
    title
    price
    description
    totalSupply
    status
    productType
    variantNames
    variantsValues
    allPossibleVariantsObject
  }
`;

export const GET_PRODUCTS_BY_USER_ID = gql`
  query GetProductsByUserId {
    getProductsByUserId ${PRODUCT}
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct(
    $title: String!
    $image: Upload
    $description: String
    $price: String!
    $totalSupply: String!
    $status: String!
    $productType: String!
    $variantNames: [String]
    $variantsValues: [[String]]
    $allPossibleVariantsObject: Object
  ) {
    addProduct(
      title: $title
      image: $image
      description: $description
      price: $price
      totalSupply: $totalSupply
      status: $status
      productType: $productType
      variantNames: $variantNames
      variantsValues: $variantsValues
      allPossibleVariantsObject: $allPossibleVariantsObject
    ) ${PRODUCT}
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
    $status: String!
    $productType: String!
    $variantNames: [String]
    $variantsValues: [[String]]
    $allPossibleVariantsObject: Object
  ) {
    editProduct(
      title: $title
      image: $image
      description: $description
      price: $price
      totalSupply: $totalSupply
      productId: $productId
      status: $status
      productType: $productType
      variantNames: $variantNames
      variantsValues: $variantsValues
      allPossibleVariantsObject: $allPossibleVariantsObject
    ) ${PRODUCT}
  }
`;

export const SAVE_TRANSACTION_INVOICE = gql`
  mutation SaveTransactionInvoice(
    $cartItems: String!
    $signature: String!
    $totalPrice: Float!
    $shippingFee: Float!
    $totalSaleTax: Float!
    $totalWithSaleTax: Float!
    $customerWalletAddress: String!
    $storeId: String!
    $currency: String!
    $network: String!
    $serviceFees: Float!
    $email: String!
    $name: String!
    $country: String!
    $address: String!
    $city: String!
    $state: String
    $postalCode: String!
  ) {
    saveTransactionInvoice(
      cartItems: $cartItems
      signature: $signature
      totalPrice: $totalPrice
      shippingFee: $shippingFee
      totalSaleTax: $totalSaleTax
      totalWithSaleTax: $totalWithSaleTax
      customerWalletAddress: $customerWalletAddress
      storeId: $storeId
      currency: $currency
      network: $network
      serviceFees: $serviceFees
      email: $email
      name: $name
      country: $country
      address: $address
      city: $city
      state: $state
      postalCode: $postalCode
    ) {
      _id
      signature
    }
  }
`;

// ============
//   Invoices
// ============

const INVOICE = gql`
  {
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
      productType
      productVariants
      variantNames
    }
    shippingFee
    email
    name
    country
    address
    city
    state
    postalCode
    fulfillmentStatus
  }
`;

export const GET_INVOICES_BY_STORE_ID = gql`
  query GetInvoicesByStoreId {
    getInvoicesByStoreId  ${INVOICE}
  }
`;

export const GET_INVOICES_BY_WALLET_ADDRESS = gql`
  query GetInvoicesByWalletAddress($walletAddress: String!) {
    getInvoicesByWalletAddress(walletAddress: $walletAddress)  ${INVOICE}
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
        shippingFee
        theme {
          primaryColor
        }
        homepage {
          heroTitle
          heroSubTitle
        }
      }
      products ${PRODUCT}
    }
  }
`;

export const GET_INVOICE_BY_ID = gql`
  query GetInvoiceById($id: String!) {
    getInvoiceById(id: $id) ${INVOICE}
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
    isArchived
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
  mutation UpdateNft($id: String!, $productsUnlocked: [String], $isArchived: Boolean) {
    updateNft(id: $id, productsUnlocked: $productsUnlocked, isArchived: $isArchived) ${NFT}
  }
`;

export const UPDATE_INVOICE = gql`
  mutation UpdateInvoice($fulfillmentStatus: String!, $invoiceId: String!) {
    updateInvoice(fulfillmentStatus: $fulfillmentStatus, invoiceId: $invoiceId) ${INVOICE}
  }
`;

export const CONTACT_STORE = gql`
  mutation ContactStore(
    $name: String!
    $email: String!
    $subject: String!
    $message: String!
  ) {
    contactStore(
      name: $name
      email: $email
      subject: $subject
      message: $message
    ) {
      status
    }
  }
`;
