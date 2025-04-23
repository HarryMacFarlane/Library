import { DataSource } from 'typeorm';
import { Book } from '../entities/Book';

const mockBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    checkedOut: false,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    checkedOut: true,
  },
  {
    title: '1984',
    author: 'George Orwell',
    checkedOut: false,
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    checkedOut: true,
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    checkedOut: false,
  },
];

export const seedDatabase = async (appDataSource: DataSource) => {
  try {
    const bookRepository = appDataSource.getRepository(Book);

    // Clear existing books
    await bookRepository.clear();

    // Insert mock books
    for (const bookData of mockBooks) {
      const book = bookRepository.create(bookData);
      await bookRepository.save(book);
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};