import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Table, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { GET_BOOKS, DELETE_BOOK, TOGGLE_BOOK_STATUS } from '../../graphql/operations/books';
import { Book } from '../../types/book';
import { CreateBookModal } from './CreateBookModal';
import { EditBookModal } from './EditBookModal';

export const BookList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  const { data, loading, error, refetch } = useQuery(GET_BOOKS, {
    fetchPolicy: 'network-only', // Always fetch fresh data
  });

  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const [toggleBookStatus] = useMutation(TOGGLE_BOOK_STATUS, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const books = data?.books || [];

  const filteredBooks = books.filter((book: Book) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      (searchLower === 'checked out' && book.checkedOut) ||
      (searchLower === 'available' && !book.checkedOut)
    );
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteBook({ variables: { deleteBookId: id } });
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleBookStatus({ variables: { id } });
    } catch (error) {
      console.error('Error toggling book status:', error);
    }
  };

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Add New Book
        </Button>
        <InputGroup style={{ width: '300px' }}>
          <Form.Control
            placeholder="Search by title, author, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book: Book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <Badge bg={book.checkedOut ? 'danger' : 'success'}>
                    {book.checkedOut ? 'Checked Out' : 'Available'}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick(book)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="me-2"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant={book.checkedOut ? 'outline-success' : 'outline-warning'}
                    size="sm"
                    onClick={() => handleToggleStatus(book.id)}
                  >
                    {book.checkedOut ? 'Return' : 'Checkout'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <CreateBookModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onBookCreated={async () => {
          await refetch();
          setShowCreateModal(false);
        }}
      />

      <EditBookModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setSelectedBook(null);
        }}
        onBookUpdated={async () => {
          await refetch();
          setShowEditModal(false);
          setSelectedBook(null);
        }}
        book={selectedBook}
      />
    </div>
  );
}; 