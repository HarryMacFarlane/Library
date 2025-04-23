import { Book } from '../entities/Book';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Request, Response } from 'express';

interface Context {
  req: Request;
  res: Response;
  session: any;
}

export const resolvers = {
  Query: {
    login: async (_: any, { input }: { input: { email: string; password: string } }, context: Context) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ email: input.email, password: input.password });
      if (!user) throw new Error('Invalid credentials');
      
      // Set user ID in session
      context.session.userId = user.id;
      return user;
    },
    books: async (_: any, __: any, context: Context) => {
      // Check if user is authenticated
      if (!context.session.userId) {
        throw new Error('Not authenticated');
      }
      return await AppDataSource.getRepository(Book).find();
    },
    book: async (_: any, { id }: { id: string }, context: Context) => {
      // Check if user is authenticated
      if (!context.session.userId) {
        throw new Error('Not authenticated');
      }
      return await AppDataSource.getRepository(Book).findOneBy({ id });
    },
  },
  Mutation: {
    register: async (_: any, { input }: { input: { email: string; password: string } }, context: Context) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = userRepository.create(input);
      const savedUser = await userRepository.save(user);
      
      // Set user ID in session
      context.session.userId = savedUser.id;
      return savedUser;
    },
    createBook: async (_: any, { input }: { input: { title: string; author: string } }, context: Context) => {
      // Check if user is authenticated
      if (!context.session.userId) {
        throw new Error('Not authenticated');
      }
      const bookRepository = AppDataSource.getRepository(Book);
      const book = bookRepository.create(input);
      return await bookRepository.save(book);
    },
    updateBook: async (_: any, { input }: { input: { id: string; title?: string; author?: string } }, context: Context) => {
      // Check if user is authenticated
      if (!context.session.userId) {
        throw new Error('Not authenticated');
      }
      const bookRepository = AppDataSource.getRepository(Book);
      const book = await bookRepository.findOneBy({ id: input.id });
      if (!book) throw new Error('Book not found');
      
      if (input.title) book.title = input.title;
      if (input.author) book.author = input.author;
      
      return await bookRepository.save(book);
    },
    deleteBook: async (_: any, { id }: { id: string }, context: Context) => {
      // Check if user is authenticated
      if (!context.session.userId) {
        throw new Error('Not authenticated');
      }
      const bookRepository = AppDataSource.getRepository(Book);
      const book = await bookRepository.findOneBy({ id });
      if (!book) throw new Error('Book not found');
      
      await bookRepository.remove(book);
      return true;
    },
    toggleBookStatus: async (_: any, { id }: { id: string }, context: Context) => {
      // Check if user is authenticated
      if (!context.session.userId) {
        throw new Error('Not authenticated');
      }
      const bookRepository = AppDataSource.getRepository(Book);
      const book = await bookRepository.findOneBy({ id });
      if (!book) throw new Error('Book not found');
      
      book.checkedOut = !book.checkedOut;
      return await bookRepository.save(book);
    },
  },
}; 