const { ApolloServer } = require('apollo-server-lambda');
const express = require('express');
import jwt from 'jsonwebtoken';
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');
import { connectDB } from './utils';
import dotenv from 'dotenv';
import { getUserById } from './controllers/users/get-user-by-id';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';

dotenv.config();

const NO_USER = { user: null };

interface IDecodedToken {
  userId: string;
  expiration: string;
  iat: number;
}

const server = new ApolloServer({
  context: async ({ event }) => {
    // Get the user token from the headers.
    const token = (
      event.headers.authorization ??
      event.headers.Authorization ??
      ''
    ).split('Bearer ')[1];

    // Get the JWT token from the env variable.
    const JWT_SECRET = process.env.AUTH_JWT_SECRET ?? '';

    // Get subdomain from the origin url
    const subdomain = (event.headers.origin ?? event.headers.Origin ?? '')
      ?.replace('http://', '')
      ?.replace('https://', '')
      ?.split('.')[0];

    // Try to decode the JWT
    let decodedToken: IDecodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as IDecodedToken;
    } catch (err) {
      // Return null as user if there is an error
      return { ...NO_USER, subdomain };
    }
    //  Return null as user if there is no decodeToken
    if (!decodedToken) return { ...NO_USER, subdomain };

    let currentUser: any = null;
    // Try to retrieve a user with the email
    if (decodedToken?.userId) {
      const userId = decodedToken?.userId;
      currentUser = await getUserById(userId);
    }

    return { user: currentUser, subdomain };
  },
  resolvers,
  typeDefs,
});

// Adding an express middleware to upload files
const serverHandler = server.createHandler({
  expressAppFromMiddleware(middleware) {
    const app = express();
    app.use(graphqlUploadExpress());
    app.use(middleware);
    return app;
  },
  cors: {
    origin: '*',
  },
});

export const graphqlHandler = (event, context, callback) => {
  // Connecting the DB
  connectDB();

  return serverHandler(
    {
      ...event,
      requestContext: event.requestContext || {},
    },
    context,
    callback
  );
};
