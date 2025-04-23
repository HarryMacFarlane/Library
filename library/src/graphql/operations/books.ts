import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      checkedOut
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      id
      title
      author
      checkedOut
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($input: UpdateBookInput!) {
    updateBook(input: $input) {
      id
      title
      author
      checkedOut
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($deleteBookId: ID!) {
    deleteBook(id: $deleteBookId)
  }
`;

export const TOGGLE_BOOK_STATUS = gql`
  mutation ToggleBookStatus($id: ID!) {
    toggleBookStatus(id: $id) {
      id
      checkedOut
    }
  }
`; 