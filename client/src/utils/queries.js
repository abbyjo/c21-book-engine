import { gql } from '@apollo/client';

export const QUERY_GET_ME = gql`
  query me( _id: ID!) {
    me( _id: ID!) {
      _id
      username
      email
      bookCount
      savedBooks
    }
  }
`;