export const mutations = `
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
      updateUser(storeName: String, walletAddress: String, subDomain: String, currency: String, image: Upload, saleTax: Float): Store

      """
      Add Product
      """
      addProduct(title: String!, image: Upload, description: String, price: String!, totalSupply: String!): Product

      """
      Delete product by ID
      """
      deleteProductById(id: String!): Product


      """
      Edit Product by ID
      """
      editProduct(title: String, image: Upload, description: String, price: String, totalSupply: String, productId: String!): Product

      """
      Save transaction invoice
      """
      saveTransactionInvoice(cartItems: String!, signature: String!, totalPrice: Float!, totalSaleTax: Float!, totalWithSaleTax: Float!, customerWalletAddress: String!, storeId: String!, currency: String!, network: String!): Invoice
  }
`;
