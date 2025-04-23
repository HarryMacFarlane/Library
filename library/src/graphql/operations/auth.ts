import { gql } from '@apollo/client';

export const LOGIN = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      id
      email
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      email
    }
  }
`; 