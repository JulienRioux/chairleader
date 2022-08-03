import { Mutation } from './mutations';
import { Query } from './queries';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

export const resolvers = { Mutation, Query, Upload: GraphQLUpload };
