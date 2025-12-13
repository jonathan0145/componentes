import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, InputGroup, Badge, Dropdown } from 'react-bootstrap';
import { FaPaperPlane, FaPaperclip, FaEllipsisV, FaCheck, FaCheckDouble, FaDownload, FaUserTie, FaStar, FaCertificate, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { selectConnectionStatus, selectMessages } from '@store/slices/chatSlice';
import { selectVerifications } from '@store/slices/verificationSlice';
import socketService from '@services/socketService';
import fileService from '@services/fileService';
import { toast } from 'react-toastify';
import FileUploadModal from './FileUploadModal';
import RequestAgentModal from '@components/agents/RequestAgentModal';
import MakeOfferModal from '@components/offers/MakeOfferModal';
import VerificationBadges from '@components/verification/VerificationBadges';

const ChatWindow = ({ conversation, onToggleInfo, showInfoButton }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isConnected = useSelector(selectConnectionStatus);
  const messagesFromStore = useSelector(state => selectMessages(state, conversation?.id));
  const verifications = useSelector(selectVerifications);
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]); // Nuevos usuarios escribiendo
  const [pendingAgentInvitations, setPendingAgentInvitations] = useState([]); // Invitaciones pendientes
  // Usar solo mensajes reales del store
  const messages = messagesFromStore || [];

  // Log para depuración de conversación y mensajes
  useEffect(() => {
    console.log('[ChatWindow] Conversación seleccionada:', conversation);
  }, [conversation]);

  useEffect(() => {
    console.log('[ChatWindow] Mensajes cargados para conversación', conversation?.id, messages);
  }, [messages, conversation?.id]);

  // Cargar mensajes reales del backend al cambiar la conversación
  useEffect(() => {
    if (conversation?.id) {
      // Importación dinámica para evitar problemas de dependencias circulares
      const { fetchMessages } = require('@store/slices/chatSlice');
      console.log('[ChatWindow] Disparando fetchMessages para conversación', conversation.id);
      dispatch(fetchMessages({ conversationId: conversation.id }));
    }
  }, [conversation?.id, dispatch]);

  // Efectos para Socket.io
  useEffect(() => {
    if (conversation?.id && isConnected && currentUser?.id) {
      // Unirse a la conversación cuando se monta el componente, enviando también el userId
      socketService.joinConversation(conversation.id, currentUser.id);
      return () => {
        // Salir de la conversación cuando se desmonta
        socketService.leaveConversation(conversation.id);
      };
    }
  }, [conversation?.id, isConnected, currentUser?.id]);

  // Eliminar efecto de sincronización local de mensajes, solo usar store

  // Simular usuarios escribiendo (para demostración)
  useEffect(() => {
    if (conversation?.id && conversation.id === 2) {
      // Simular que Roberto Silva está escribiendo en la conversación 2
      setTypingUsers(['Roberto Silva']);
      
      const timer = setTimeout(() => {
        setTypingUsers([]);
      }, 8000); // Detener después de 8 segundos
      
      return () => clearTimeout(timer);
    } else {
      setTypingUsers([]);
    }
  }, [conversation?.id]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && conversation?.id) {
      const messageData = {
        text: message,
        type: 'text',
      };
      // Enviar mensaje real usando Redux y backend
      // Usar el thunk real de Redux Toolkit
      dispatch(require('@store/slices/chatSlice').sendMessage({ conversationId: conversation.id, messageData }));
      setMessage('');
      // Detener typing si está activo
      if (isTyping) {
        socketService.stopTyping(conversation.id);
        setIsTyping(false);
      }
    }
  };

  // Manejar indicador de "escribiendo"
  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (conversation?.id && isConnected) {
      if (value.trim() && !isTyping) {
        socketService.startTyping(conversation.id);
        setIsTyping(true);
      }

      // Limpiar timeout anterior
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Detener typing después de 2 segundos de inactividad
      const timeout = setTimeout(() => {
        if (isTyping) {
          socketService.stopTyping(conversation.id);
          setIsTyping(false);
        }
      }, 2000);

      setTypingTimeout(timeout);
    }
  };

  const handleFileUpload = () => {
    setShowFileModal(true);
  };

  const handleFileUploaded = (fileData) => {
    if (conversation?.id && isConnected) {
      // Enviar mensaje de archivo a través de Socket.io
      socketService.sendMessage(conversation.id, {
        type: 'file',
        file: fileData,
        conversationId: conversation.id
      });
    } else {
      toast.error('No se pudo enviar el archivo. Conexión no disponible.');
    }
    setShowFileModal(false);
  };

  // Manejar respuesta del agente a la invitación
  const handleAgentResponse = (invitationId, response) => {
    const invitation = pendingAgentInvitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    // Actualizar estado de la invitación
    setPendingAgentInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: response }
          : inv
      )
    );

    if (response === 'accepted') {
      // Notificación especial cuando el agente acepta
      toast.success(
        <div className="d-flex align-items-center">
          <img
            src={invitation.agent.photo}
            alt={invitation.agent.name}
            className="rounded-circle me-2"
            style={{ width: '30px', height: '30px' }}
          />
          <div>
            <div className="fw-bold">¡Agente Unido!</div>
            <small>{invitation.agent.name} se unió como intermediario</small>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Mensaje del sistema cuando el agente acepta
      const systemMessage = {
        id: Date.now(),
        text: `🎉 ${invitation.agent.name} ha aceptado la invitación y se ha unido a la conversación como intermediario.`,
        type: 'agent-joined',
        agent: invitation.agent,
        sender: { id: 'system', name: 'Sistema', role: 'system' },
        timestamp: new Date(),
        read: false
      };
      setMessages(prev => [...prev, systemMessage]);

      // Mensaje de bienvenida del agente
      setTimeout(() => {
        const agentMessage = {
          id: Date.now() + 1,
          text: `Hola! Soy ${invitation.agent.name} de ${invitation.agent.company}. Estoy aquí para ayudarles con esta transacción inmobiliaria. ¿En qué puedo asistirles?`,
          sender: { 
            id: invitation.agent.id, 
            name: invitation.agent.name, 
            role: 'agent' 
          },
          timestamp: new Date(),
          read: false
        };
        setMessages(prev => [...prev, agentMessage]);
      }, 2000);

    } else if (response === 'rejected') {
      // Notificación cuando el agente rechaza
      toast.warning(
        <div className="d-flex align-items-center">
          <img
            src={invitation.agent.photo}
            alt={invitation.agent.name}
            className="rounded-circle me-2"
            style={{ width: '30px', height: '30px' }}
          />
          <div>
            <div className="fw-bold">Invitación Rechazada</div>
            <small>{invitation.agent.name} no puede atender ahora</small>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );

      // Mensaje del sistema cuando el agente rechaza
      const systemMessage = {
        id: Date.now(),
        text: `${invitation.agent.name} no pudo aceptar la invitación en este momento. Puedes solicitar otro agente.`,
        type: 'system',
        sender: { id: 'system', name: 'Sistema', role: 'system' },
        timestamp: new Date(),
        read: false
      };
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  // Manejar acciones de ofertas (aceptar, rechazar, contraoferta)
  const handleOfferAction = (messageId, action) => {
    const offerMessage = messages.find(msg => msg.id === messageId);
    if (!offerMessage) return;

    let updatedOffer = { ...offerMessage.offer };
    let notificationMessage = '';
    let systemMessage = '';

    switch (action) {
      case 'accept':
        updatedOffer.status = 'accepted';
        notificationMessage = '¡Oferta aceptada exitosamente!';
        systemMessage = `${currentUser?.name || 'El vendedor'} ha aceptado la oferta de $${updatedOffer.amount?.toLocaleString()}.`;
        break;
      case 'reject':
        updatedOffer.status = 'rejected';
        notificationMessage = 'Oferta rechazada';
        systemMessage = `${currentUser?.name || 'El vendedor'} ha rechazado la oferta de $${updatedOffer.amount?.toLocaleString()}.`;
        break;
      case 'counter':
        // Para contraoferta, primero mostraremos un prompt simple (luego se puede mejorar con un modal)
        const counterAmount = prompt('Ingresa el monto de la contraoferta:');
        if (!counterAmount || isNaN(counterAmount)) return;
        
        updatedOffer = {
          ...updatedOffer,
          status: 'counter',
          amount: parseFloat(counterAmount),
          notes: `Contraoferta de $${parseFloat(counterAmount).toLocaleString()}`
        };
        notificationMessage = 'Contraoferta enviada';
        systemMessage = `${currentUser?.name || 'El vendedor'} ha enviado una contraoferta de $${parseFloat(counterAmount).toLocaleString()}.`;
        break;
      default:
        return;
    }

    // Actualizar el mensaje original
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, offer: updatedOffer }
        : msg
    ));

    // Agregar mensaje del sistema sobre la acción
    const systemMsg = {
      id: Date.now(),
      text: systemMessage,
      type: 'system',
      sender: { id: 'system', name: 'Sistema', role: 'system' },
      timestamp: new Date(),
      read: false
    };
    setMessages(prev => [...prev, systemMsg]);

    // Notificación toast
    toast.success(notificationMessage, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const dateObj = new Date(timestamp);
    if (isNaN(dateObj.getTime())) return '';
    const today = new Date();
    if (dateObj.toDateString() === today.toDateString()) {
      return 'Hoy';
    }
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateObj.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short'
    }).format(dateObj);
  };

  const getRoleColor = (role) => {
    const colors = {
      buyer: 'primary',
      seller: 'success',
      agent: 'warning',
      system: 'secondary'
    };
    return colors[role] || 'secondary';
  };

  if (!conversation) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h5 className="text-muted">Selecciona una conversación</h5>
          <p className="text-muted">Elige una conversación para comenzar a chatear</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !currentUser.id) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h5 className="text-muted">Cargando usuario...</h5>
          <p className="text-muted">Por favor espera, estamos obteniendo tu información.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-100 d-flex flex-column">
      {/* Header del chat */}
      <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1 d-flex align-items-center">
            {conversation.property?.title || 'Conversación'}
            <span className={`ms-2 badge ${isConnected ? 'bg-success' : 'bg-warning'}`} style={{ fontSize: '0.6em' }}>
              {isConnected ? '● En línea' : '● Reconectando...'}
            </span>
            {/* Badge de mensajes no leídos */}
            {messages.filter(msg => !msg.read).length > 0 && (
              <Badge bg="danger" pill className="ms-2" style={{ fontSize: '0.7em' }}>
                {messages.filter(msg => !msg.read).length > 99 ? '99+' : messages.filter(msg => !msg.read).length} sin leer
              </Badge>
            )}
          </h6>
          <div className="d-flex flex-column gap-1">
            <div className="d-flex gap-2">
              {conversation.participants?.map((participant, index) => (
                <Badge 
                  key={index} 
                  bg={getRoleColor(participant.role)} 
                  className="text-white"
                >
                  {participant.name}
                </Badge>
              ))}
            </div>
            <VerificationBadges verifications={verifications} size="sm" maxBadges={3} />
            {/* Indicador de invitaciones pendientes */}
            {pendingAgentInvitations.filter(inv => inv.status === 'pending').length > 0 && (
              <div className="d-flex align-items-center">
                <Badge bg="warning" className="d-flex align-items-center gap-1">
                  <FaUserTie size={10} />
                  {pendingAgentInvitations.filter(inv => inv.status === 'pending').length} invitación(es) pendiente(s)
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex gap-2">
          {showInfoButton && (
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={onToggleInfo}
            >
              Info
            </Button>
          )}
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaEllipsisV />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowOfferModal(true)}>
                <FaDollarSign className="me-2" />
                Hacer Oferta
                <small className="d-block text-muted">
                  Envía una oferta formal por esta propiedad
                </small>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setShowAgentModal(true)}>
                <FaUserTie className="me-2" />
                Solicitar Intermediario
                <small className="d-block text-muted">
                  Invita un agente profesional a la conversación
                </small>
              </Dropdown.Item>
              {pendingAgentInvitations.length > 0 && (
                <>
                  <Dropdown.Divider />
                  <Dropdown.ItemText>
                    <small className="text-muted">
                      <strong>Invitaciones de Agentes:</strong>
                    </small>
                  </Dropdown.ItemText>
                  {pendingAgentInvitations.slice(-3).map(invitation => (
                    <Dropdown.Item key={invitation.id} disabled>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={invitation.agent.photo}
                          alt={invitation.agent.name}
                          className="rounded-circle"
                          style={{ width: '20px', height: '20px' }}
                        />
                        <div>
                          <small className="d-block">{invitation.agent.name}</small>
                          <small className={`d-block ${
                            invitation.status === 'pending' ? 'text-warning' :
                            invitation.status === 'accepted' ? 'text-success' : 'text-danger'
                          }`}>
                            {invitation.status === 'pending' ? '⏳ Pendiente' :
                             invitation.status === 'accepted' ? '✅ Aceptado' : '❌ Rechazado'}
                          </small>
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
                </>
              )}
              <Dropdown.Divider />
              <Dropdown.Item>Archivar conversación</Dropdown.Item>
              <Dropdown.Item>Silenciar notificaciones</Dropdown.Item>
              <Dropdown.Item>Reportar</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-grow-1 overflow-auto p-3" style={{ backgroundColor: '#f8f9fa', minHeight: 0, maxHeight: 'calc(100vh - 220px)' }}>
        {messages.map((msg, index) => {
          const showDate = index === 0 || 
            formatDate(messages[index - 1].timestamp) !== formatDate(msg.timestamp);
          const isCurrentUser = msg.sender && msg.sender.id === (currentUser?.id || 1);
          
          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center my-3">
                  <small className="bg-white px-2 py-1 rounded text-muted">
                    {formatDate(msg.timestamp)}
                  </small>
                </div>
              )}
              
              <div className={`d-flex mb-3 ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}>
                <div 
                  className={`max-w-75 ${isCurrentUser ? 'order-1' : ''}`}
                  style={{ maxWidth: '75%' }}
                >
                  {!isCurrentUser && msg.sender && (
                    <div className="mb-1">
                      <small className="text-muted fw-bold">{msg.sender.name}</small>
                      <Badge bg={getRoleColor(msg.sender.role)} className="ms-1" style={{ fontSize: '0.6em' }}>
                        {msg.sender.role}
                      </Badge>
                    </div>
                  )}
                  
                  <div 
                    className={`p-2 rounded ${
                      isCurrentUser 
                        ? 'bg-primary text-white' 
                        : 'bg-white border'
                    }`}
                  >
                    {/* Contenido del mensaje */}
                    {msg.type === 'file' ? (
                      // Renderizar archivo
                      <div>
                        {msg.file.type?.startsWith('image/') ? (
                          // Imagen con preview y descarga
                          <div className="mb-2">
                            <div className="position-relative">
                              <img 
                                src={msg.file.url || msg.file.preview} 
                                alt={msg.file.name}
                                className="rounded cursor-pointer"
                                style={{ 
                                  maxWidth: '250px', 
                                  maxHeight: '250px', 
                                  objectFit: 'cover',
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  if (msg.file.url) {
                                    window.open(msg.file.url, '_blank');
                                  }
                                }}
                              />
                              <Button
                                variant="dark"
                                size="sm"
                                className="position-absolute top-0 end-0 m-1 opacity-75"
                                style={{ fontSize: '0.7em' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (msg.file.url) {
                                    const link = document.createElement('a');
                                    link.href = msg.file.url;
                                    link.download = msg.file.name;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }
                                }}
                              >
                                <FaDownload />
                              </Button>
                            </div>
                            <div className="mt-1">
                              <small className={isCurrentUser ? 'text-white-50' : 'text-muted'}>
                                📷 {msg.file.name} • {fileService.formatFileSize(msg.file.size)}
                              </small>
                            </div>
                          </div>
                        ) : (
                          // Archivo no imagen con mejor diseño
                          <div className="d-flex align-items-center p-2 rounded" style={{
                            backgroundColor: isCurrentUser ? 'rgba(255,255,255,0.1)' : '#f8f9fa',
                            border: `1px solid ${isCurrentUser ? 'rgba(255,255,255,0.2)' : '#dee2e6'}`
                          }}>
                            <div className="me-3 d-flex align-items-center justify-content-center rounded-circle" 
                                 style={{ 
                                   width: '40px', 
                                   height: '40px', 
                                   backgroundColor: isCurrentUser ? 'rgba(255,255,255,0.2)' : '#e9ecef',
                                   fontSize: '1.2em'
                                 }}>
                              {fileService.getFileIcon(msg.file.type)}
                            </div>
                            <div className="flex-grow-1 me-2">
                              <div className={`fw-bold ${isCurrentUser ? 'text-white' : 'text-dark'}`} 
                                   style={{ fontSize: '0.9em' }}>
                                {msg.file.name}
                              </div>
                              <small className={isCurrentUser ? 'text-white-50' : 'text-muted'}>
                                {fileService.formatFileSize(msg.file.size)}
                              </small>
                            </div>
                            <Button
                              variant={isCurrentUser ? 'outline-light' : 'outline-primary'}
                              size="sm"
                              className="ms-auto"
                              title="Descargar archivo"
                              onClick={() => {
                                if (msg.file.url) {
                                  const link = document.createElement('a');
                                  link.href = msg.file.url;
                                  link.download = msg.file.name;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                } else {
                                  // Fallback para archivos sin URL
                                  alert('Archivo no disponible para descarga');
                                }
                              }}
                            >
                              <FaDownload />
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : msg.type === 'system' ? (
                      // Mensaje del sistema con estilo especial
                      <div className="text-center fst-italic">
                        <small className="text-muted">{msg.text}</small>
                      </div>
                    ) : msg.type === 'agent-joined' ? (
                      // Mensaje especial cuando un agente se une
                      <div className="text-center">
                        <div className="bg-success bg-opacity-10 border border-success rounded p-3 mb-2">
                          <div className="d-flex align-items-center justify-content-center mb-2">
                            <img
                              src={msg.agent?.photo || 'https://via.placeholder.com/40x40?text=AG'}
                              alt={msg.agent?.name}
                              className="rounded-circle me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold text-success">{msg.agent?.name}</div>
                              <small className="text-muted">{msg.agent?.company}</small>
                            </div>
                          </div>
                          <div className="text-success fw-bold mb-1">
                            <FaUserTie className="me-1" />
                            Agente Inmobiliario Unido
                          </div>
                          <small className="text-muted d-block">{msg.text}</small>
                          {msg.agent && (
                            <div className="mt-2">
                              <Badge bg="success" className="me-1">
                                <FaCertificate className="me-1" size={10} />
                                Lic. {msg.agent.license}
                              </Badge>
                              <Badge bg="warning" className="me-1">
                                <FaStar className="me-1" size={10} />
                                {msg.agent.rating}
                              </Badge>
                              <Badge bg="info">
                                {msg.agent.experience} exp.
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : msg.type === 'offer' ? (
                      // Mensaje especial de oferta
                      <div className="text-center">
                        <div className={`border rounded p-3 mb-2 ${
                          msg.offer?.status === 'pending' ? 'bg-warning bg-opacity-10 border-warning' :
                          msg.offer?.status === 'accepted' ? 'bg-success bg-opacity-10 border-success' :
                          msg.offer?.status === 'rejected' ? 'bg-danger bg-opacity-10 border-danger' :
                          msg.offer?.status === 'counter' ? 'bg-info bg-opacity-10 border-info' :
                          'bg-primary bg-opacity-10 border-primary'
                        }`}>
                          <div className="d-flex align-items-center justify-content-center mb-2">
                            <FaDollarSign 
                              className={`me-2 ${
                                msg.offer?.status === 'pending' ? 'text-warning' :
                                msg.offer?.status === 'accepted' ? 'text-success' :
                                msg.offer?.status === 'rejected' ? 'text-danger' :
                                msg.offer?.status === 'counter' ? 'text-info' :
                                'text-primary'
                              }`} 
                              size={24} 
                            />
                            <div>
                              <div className={`fw-bold ${
                                msg.offer?.status === 'pending' ? 'text-warning' :
                                msg.offer?.status === 'accepted' ? 'text-success' :
                                msg.offer?.status === 'rejected' ? 'text-danger' :
                                msg.offer?.status === 'counter' ? 'text-info' :
                                'text-primary'
                              }`}>
                                {msg.offer?.status === 'pending' ? 'Oferta Formal' :
                                 msg.offer?.status === 'accepted' ? 'Oferta Aceptada' :
                                 msg.offer?.status === 'rejected' ? 'Oferta Rechazada' :
                                 msg.offer?.status === 'counter' ? 'Contraoferta' :
                                 'Oferta Formal'}
                              </div>
                              <small className="text-muted">
                                Por {msg.sender?.name}
                              </small>
                            </div>
                          </div>
                          
                          {/* Detalles de la oferta */}
                          <div className="bg-white rounded p-3 mb-3">
                            <div className="row g-2">
                              <div className="col-6">
                                <strong>Monto:</strong>
                                <div className="fs-4 fw-bold text-success">
                                  ${msg.offer?.amount?.toLocaleString() || '0'}
                                </div>
                              </div>
                              <div className="col-6">
                                <strong>Estado:</strong>
                                <div>
                                  <Badge bg={
                                    msg.offer?.status === 'pending' ? 'warning' :
                                    msg.offer?.status === 'accepted' ? 'success' :
                                    msg.offer?.status === 'rejected' ? 'danger' :
                                    msg.offer?.status === 'counter' ? 'info' :
                                    'primary'
                                  }>
                                    {msg.offer?.status === 'pending' ? '⏳ Pendiente' :
                                     msg.offer?.status === 'accepted' ? '✅ Aceptada' :
                                     msg.offer?.status === 'rejected' ? '❌ Rechazada' :
                                     msg.offer?.status === 'counter' ? '🔄 Contraoferta' :
                                     '📋 Nueva'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            {msg.offer?.validUntil && (
                              <div className="mt-2">
                                <small className="text-muted">
                                  <FaCalendarAlt className="me-1" />
                                  Válida hasta: {new Date(msg.offer.validUntil).toLocaleDateString()}
                                </small>
                              </div>
                            )}
                            
                            {msg.offer?.notes && (
                              <div className="mt-2">
                                <small className="text-muted">
                                  💬 {msg.offer.notes}
                                </small>
                              </div>
                            )}
                          </div>

                          {/* Botones de acción */}
                          {msg.offer?.status === 'pending' && !isCurrentUser && (
                            <div className="d-flex gap-2 justify-content-center">
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleOfferAction(msg.id, 'accept')}
                              >
                                ✅ Aceptar
                              </Button>
                              <Button 
                                variant="info" 
                                size="sm"
                                onClick={() => handleOfferAction(msg.id, 'counter')}
                              >
                                🔄 Contraoferta
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => handleOfferAction(msg.id, 'reject')}
                              >
                                ❌ Rechazar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Mensaje de texto normal
                      <div>{msg.text || msg.content}</div>
                    )}
                    
                    <div className={`d-flex justify-content-end align-items-center mt-1 ${
                      isCurrentUser ? 'text-white-50' : 'text-muted'
                    }`}>
                      <small style={{ fontSize: '0.7em' }}>
                        {formatTime(msg.timestamp)}
                      </small>
                      {isCurrentUser && (
                        <span className="ms-1">
                          {msg.read ? <FaCheckDouble /> : <FaCheck />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Indicador de "escribiendo" */}
        {typingUsers.length > 0 && (
          <div className="d-flex justify-content-start mb-3">
            <div className="max-w-75" style={{ maxWidth: '75%' }}>
              <div className="p-2 rounded bg-light border">
                <div className="d-flex align-items-center">
                  <span className="typing-dots me-2">●●●</span>
                  <small className="text-muted fst-italic">
                    {typingUsers.length === 1 
                      ? `${typingUsers[0]} está escribiendo...`
                      : `${typingUsers.join(', ')} están escribiendo...`
                    }
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <div className="p-3 border-top bg-white">
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            <Button 
              variant="outline-secondary"
              onClick={handleFileUpload}
              type="button"
              title="Adjuntar archivo"
              disabled={!isConnected}
            >
              <FaPaperclip />
            </Button>
            <Form.Control
              type="text"
              placeholder={isConnected ? "Escribe tu mensaje..." : "Reconectando..."}
              value={message}
              onChange={handleMessageChange}
              disabled={!isConnected}
            />
            <Button 
              variant="primary" 
              type="submit"
              disabled={!message.trim() || !isConnected}
              title="Enviar mensaje"
            >
              <FaPaperPlane />
            </Button>
          </InputGroup>
        </Form>
      </div>

      {/* Modal de subida de archivos */}
      <FileUploadModal
        show={showFileModal}
        onHide={() => setShowFileModal(false)}
        onFileUploaded={handleFileUploaded}
        conversationId={conversation?.id}
      />

      {/* Modal de solicitar agente */}
      <RequestAgentModal
        show={showAgentModal}
        onHide={() => setShowAgentModal(false)}
        property={conversation?.property}
        onAgentRequested={(agent) => {
          // Notificación de solicitud enviada
          toast.success(
            <div className="d-flex align-items-center">
              <img
                src={agent.photo}
                alt={agent.name}
                className="rounded-circle me-2"
                style={{ width: '30px', height: '30px' }}
              />
              <div>
                <div className="fw-bold">Invitación enviada</div>
                <small>Se notificó a {agent.name}</small>
              </div>
            </div>,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );

          // Crear mensaje del sistema sobre el agente solicitado
          const systemMessage = {
            id: Date.now(),
            text: `Se ha enviado una invitación al agente ${agent.name} de ${agent.company}. Te notificaremos cuando responda.`,
            type: 'system',
            sender: { id: 'system', name: 'Sistema', role: 'system' },
            timestamp: new Date(),
            read: false
          };
          setMessages(prev => [...prev, systemMessage]);

          // Agregar invitación pendiente
          const invitation = {
            id: Date.now(),
            agent: agent,
            timestamp: new Date(),
            status: 'pending', // 'pending', 'accepted', 'rejected'
            conversationId: conversation?.id
          };
          setPendingAgentInvitations(prev => [...prev, invitation]);

          // Simular respuesta del agente después de 10 segundos (para demo)
          setTimeout(() => {
            handleAgentResponse(invitation.id, 'accepted');
          }, 10000);
        }}
      />

      {/* Modal de hacer oferta */}
      <MakeOfferModal
        show={showOfferModal}
        onHide={() => setShowOfferModal(false)}
        property={conversation?.property}
        onOfferSubmitted={(offerData) => {
          // Crear mensaje especial de oferta en el chat
          const offerMessage = {
            id: Date.now(),
            type: 'offer',
            offer: {
              amount: offerData?.amount || 150000,
              status: 'pending',
              timestamp: new Date(),
              validUntil: offerData?.validUntil,
              notes: offerData?.additionalNotes,
              paymentTerms: offerData?.paymentTerms,
              closingDate: offerData?.closingDate
            },
            sender: currentUser || { id: 1, name: 'Usuario Actual', role: 'buyer' },
            timestamp: new Date(),
            read: false
          };
          setMessages(prev => [...prev, offerMessage]);

          // Notificación de oferta enviada
          toast.success(
            <div className="d-flex align-items-center">
              <FaDollarSign className="me-2 text-success" size={24} />
              <div>
                <div className="fw-bold">Oferta enviada</div>
                <small>Se notificó al vendedor por $${offerData?.amount?.toLocaleString() || '150,000'}</small>
              </div>
            </div>,
            {
              position: "top-right",
              autoClose: 4000,
            }
          );

          // Cerrar modal
          setShowOfferModal(false);
        }}
      />
    </div>
  );
};

export default ChatWindow;