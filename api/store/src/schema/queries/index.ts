import { gql } from 'apollo-server-lambda';

export const queries = gql`
  type Query {
    getMe: Store

    getProductsByUserId: [CartItem]

    getInvoicesByStoreId: [Invoice]

    getStoreData: StoreData

    getInvoiceById(id: String!): Invoice

    checkIfSubdomainIsAvailable(subdomain: String!): Boolean

    """
    Find Nfts by store ID
    """
    findNftsByStoreId: [Nft]

    """
    Find Nft by address
    """
    findNftByAddress(nftAddress: String!): Nft
  }
`;
