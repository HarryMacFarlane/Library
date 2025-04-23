import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN, REGISTER } from '../../graphql/operations/auth';

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ show, onHide, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { refetch: login } = useQuery(LOGIN, {
    variables: {
      input: {
        email,
        password
      }
    },
    skip: true
  });

  const [register] = useMutation(REGISTER);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await login();
      if (data?.login) {
        sessionStorage.setItem('userID', data.login.id);
        onAuthSuccess();
        onHide();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await register({
        variables: {
          input: {
            email,
            password
          }
        }
      });
      if (data?.register) {
        sessionStorage.setItem('userID', data.register.id);
        onAuthSuccess();
        onHide();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Authentication</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <div className="text-danger mb-3">{error}</div>}
          <div className="d-grid gap-2">
            <Button onClick={handleLogin} variant="primary">
              Login
            </Button>
            <Button onClick={handleRegister} variant="secondary">
              Register
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}; 