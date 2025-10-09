import React from 'react';
import { useSelector } from 'react-redux';
import { Alert, Container } from 'react-bootstrap';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Debes iniciar sesión para acceder a esta página.
        </Alert>
      </Container>
    );
  }

  if (!allowedRoles.includes(user?.role)) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          No tienes permisos para acceder a esta página.
        </Alert>
      </Container>
    );
  }

  return children;
};

export default RoleBasedRoute;