export interface Book {
  id: string;
  title: string;
  author: string;
  checkedOut: boolean;
}

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    checkedOut: false,
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    checkedOut: true,
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    checkedOut: false,
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    checkedOut: true,
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    checkedOut: false,
  },
]; 