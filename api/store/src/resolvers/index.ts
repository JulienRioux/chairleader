import { Mutation } from './mutations';
import { Query } from './queries';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { ObjectScalarType } from './scalars';

export const resolvers = {
  Mutation,
  Query,
  Upload: GraphQLUpload,
  Object: ObjectScalarType,
};
