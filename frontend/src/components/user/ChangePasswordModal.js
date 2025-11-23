import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ChangePasswordModal = ({ show, onClose, onSubmit, loading }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!currentPassword || !newPassword) {
      setError('Completa ambos campos.');
      return;
    }
    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    onSubmit({ currentPassword, newPassword });
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setError('');
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña actual</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nueva contraseña</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <div className="text-danger mb-2">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
