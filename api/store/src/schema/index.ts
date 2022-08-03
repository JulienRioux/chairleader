import { gql } from 'apollo-server-lambda';

import { mutations } from './mutations';
import { queries } from './queries';
import { schemaTypes } from './schema-types';

export const typeDefs = gql`
   """ Types """
  ${schemaTypes}

  """ Queries """
  ${queries}

  """ mutations """
  ${mutations}
`;
