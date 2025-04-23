import { ApolloProvider } from '@apollo/client';
import { Container, Navbar, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { BookList } from './components/books/BookList';
import { AuthModal } from './components/auth/AuthModal';
import { client } from './graphql/client';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <ApolloProvider client={client}>
      <div className="min-vh-100 bg-light">
        <Navbar bg="dark" variant="dark" className="mb-4">
          <Container>
            <Navbar.Brand>Library Management System</Navbar.Brand>
            <div>
              {isAuthenticated ? (
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button variant="outline-light" onClick={() => setShowAuthModal(true)}>
                  Login/Register
                </Button>
              )}
            </div>
          </Container>
        </Navbar>

        <Container className="py-4">
          {isAuthenticated ? (
            <div className="bg-white rounded shadow-sm">
              <BookList />
            </div>
          ) : (
            <div className="text-center">
              <h2>Please login to access the library</h2>
            </div>
          )}
        </Container>

        <AuthModal
          show={showAuthModal}
          onHide={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </ApolloProvider>
  );
}

export default App; 