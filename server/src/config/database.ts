import { DataSource } from 'typeorm';
import { Book } from '../entities/Book';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'library.db',
  entities: [Book, User],
  synchronize: true, // Be careful with this in production
  logging: true,
  extra: {
    // SQLite specific options to handle concurrent access
    busyTimeout: 5000, // Wait up to 5 seconds for the database to be available
    journalMode: 'WAL', // Use Write-Ahead Logging for better concurrency
  }
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection established');
    }
    return AppDataSource;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}; 