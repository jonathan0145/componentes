import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FaBell, FaComment, FaDollarSign, FaTimes } from 'react-icons/fa';

const NotificationToast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Escuchar eventos de notificación personalizados
    const handleNewMessage = (event) => {
      const { message, conversation } = event.detail;
      addToast({
        id: Date.now(),
        type: 'message',
        title: `Nuevo mensaje de ${message.sender.name}`,
        body: message.type === 'file' ? `📎 ${message.file.name}` : message.text,
        time: new Date(),
        conversation: conversation,
        icon: <FaComment />
      });
    };

    const handleNewOffer = (event) => {
      const { offer, property } = event.detail;
      addToast({
        id: Date.now(),
        type: 'offer',
        title: offer.type === 'received' ? 'Nueva oferta recibida' : 'Respuesta a tu oferta',
        body: `${property.title} - $${formatPrice(offer.amount)}`,
        time: new Date(),
        offer: offer,
        property: property,
        icon: <FaDollarSign />
      });
    };

    const handleGeneral = (event) => {
      const { title, body, type = 'info' } = event.detail;
      addToast({
        id: Date.now(),
        type: type,
        title: title,
        body: body,
        time: new Date(),
        icon: <FaBell />
      });
    };

    // Registrar event listeners
    window.addEventListener('new-message-notification', handleNewMessage);
    window.addEventListener('new-offer-notification', handleNewOffer);
    window.addEventListener('general-notification', handleGeneral);

    return () => {
      window.removeEventListener('new-message-notification', handleNewMessage);
      window.removeEventListener('new-offer-notification', handleNewOffer);
      window.removeEventListener('general-notification', handleGeneral);
    };
  }, []);

  const addToast = (toast) => {
    setToasts(prev => {
      // Limitar a máximo 5 toasts
      const newToasts = [toast, ...prev.slice(0, 4)];
      return newToasts;
    });

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleToastClick = (toast) => {
    if (toast.type === 'message' && toast.conversation) {
      // Navegar al chat
      window.location.href = `/chat?conversation=${toast.conversation.id}`;
    } else if (toast.type === 'offer' && toast.property) {
      // Navegar a la propiedad
      window.location.href = `/properties/${toast.property.id}`;
    }
    removeToast(toast.id);
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getToastBg = (type) => {
    switch (type) {
      case 'message': return 'primary';
      case 'offer': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'info';
    }
  };

  return (
    <ToastContainer 
      position="top-end" 
      className="p-3"
      style={{ 
        position: 'fixed', 
        top: '70px', 
        right: '10px', 
        zIndex: 9999 
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          bg={getToastBg(toast.type)}
          className="mb-2"
          style={{ 
            minWidth: '300px',
            cursor: toast.conversation || toast.property ? 'pointer' : 'default'
          }}
          onClick={() => handleToastClick(toast)}
        >
          <Toast.Header closeButton onClose={() => removeToast(toast.id)}>
            <div className="me-2 text-primary">
              {toast.icon}
            </div>
            <strong className="me-auto">{toast.title}</strong>
            <small className="text-muted">{formatTime(toast.time)}</small>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toast.body}
            {(toast.conversation || toast.property) && (
              <div className="mt-2">
                <small className="opacity-75">
                  Click para {toast.type === 'message' ? 'ver conversación' : 'ver propiedad'}
                </small>
              </div>
            )}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationToast;