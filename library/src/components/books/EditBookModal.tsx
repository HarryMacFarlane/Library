import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { UPDATE_BOOK } from '../../graphql/operations/books';
import { Book } from '../../types/book';

interface EditBookModalProps {
  show: boolean;
  onHide: () => void;
  onBookUpdated: () => void;
  book: Book | null;
}

export const EditBookModal: React.FC<EditBookModalProps> = ({ 
  show, 
  onHide, 
  onBookUpdated,
  book 
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const [updateBook] = useMutation(UPDATE_BOOK);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!book) return;

    try {
      const { data } = await updateBook({
        variables: {
          input: {
            id: book.id,
            title,
            author
          }
        }
      });

      if (data?.updateBook) {
        onBookUpdated();
        onHide();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the book');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter book title"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="Enter author name"
            />
          </Form.Group>
          {error && <div className="text-danger mb-3">{error}</div>}
          <div className="d-grid gap-2">
            <Button type="submit" variant="primary">
              Update Book
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
