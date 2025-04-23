import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { CREATE_BOOK } from '../../graphql/operations/books';

interface CreateBookModalProps {
  show: boolean;
  onHide: () => void;
  onBookCreated: () => void;
}

export const CreateBookModal: React.FC<CreateBookModalProps> = ({ show, onHide, onBookCreated }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const [createBook] = useMutation(CREATE_BOOK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await createBook({
        variables: {
          input: {
            title,
            author
          }
        }
      });

      if (data?.createBook) {
        onBookCreated();
        onHide();
        // Reset form
        setTitle('');
        setAuthor('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the book');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Book</Modal.Title>
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
              Add Book
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
