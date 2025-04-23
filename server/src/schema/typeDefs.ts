import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    checkedOut: Boolean!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
  }

  input CreateBookInput {
    title: String!
    author: String!
  }

  input UpdateBookInput {
    id: ID!
    title: String
    author: String
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    login(input: LoginInput!): User
  }

  type Mutation {
    register(input: RegisterInput!): User!
    createBook(input: CreateBookInput!): Book!
    updateBook(input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!
    toggleBookStatus(id: ID!): Book!
  }
`; 