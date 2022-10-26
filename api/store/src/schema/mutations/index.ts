import { gql } from 'apollo-server-lambda';

export const mutations = gql`
  type Mutation {
    """
    Authenticate mutation
    """
    authenticate(email: String, hostname: String): AuthenticateResponse

    """
    Validate OTP
    """
    validateOtp(email: String, validationCode: String): ValidateOtpResponse

    """
    Update user
    """
    updateUser(
      storeName: String
      walletAddress: String
      subDomain: String
      currency: String
      image: Upload
      saleTax: Float
      shippingFee: String
      theme: Object
      homepage: Object
      heroImage: Upload
    ): Store

    """
    Add Product
    """
    addProduct(
      title: String!
      image: Upload
      description: String
      price: String!
      totalSupply: String!
      status: String!
      productType: String!
      variantNames: [String]
      variantsValues: [[String]]
      allPossibleVariantsObject: Object
    ): Product

    """
    Delete product by ID
    """
    deleteProductById(id: String!): Product

    """
    Edit Product by ID
    """
    editProduct(
      title: String
      image: Upload
      description: String
      price: String
      totalSupply: String
      productId: String!
      status: String!
      productType: String!
      variantNames: [String]
      variantsValues: [[String]]
      allPossibleVariantsObject: Object
    ): Product

    """
    Save transaction invoice
    """
    saveTransactionInvoice(
      cartItems: String!
      signature: String!
      totalPrice: Float!
      totalSaleTax: Float!
      totalWithSaleTax: Float!
      customerWalletAddress: String!
      storeId: String!
      currency: String!
      network: String!
      serviceFees: Float!
      shippingFee: Float
      email: String!
      name: String!
      country: String!
      address: String!
      city: String!
      state: String
      postalCode: String!
    ): Invoice

    """
    Add Nft by address
    """
    addNft(nftAddress: String!): Nft

    """
    Update Nft by ID
    """
    updateNft(id: String!, productsUnlocked: [String], isArchived: Boolean): Nft

    """
    Update Invoice by ID
    """
    updateInvoice(fulfillmentStatus: String!, invoiceId: String!): Invoice

    """
    Contact Store
    """
    contactStore(
      name: String!
      email: String!
      subject: String!
      message: String!
    ): ContactStoreResponse
  }
`;
