import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListGroup, Badge, Button, Form, InputGroup, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaCircle, FaHome, FaUser, FaSearch, FaComments, FaArchive, FaBell, FaBellSlash, FaEllipsisV, FaUndo } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ConversationsList = ({ conversations = [], selectedConversationId, onSelectConversation, currentUser }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [searchFilter, setSearchFilter] = useState('all'); // 'all', 'property', 'participants', 'messages'

  // Datos de ejemplo de conversaciones
  const defaultConversations = [
    {
      id: 1,
      property: {
        id: 1,
        title: 'Apartamento Moderno Zona Norte',
        image: 'https://via.placeholder.com/50x50?text=Apt1'
      },
      participants: [
        { id: 1, name: 'Carlos Rodríguez', role: 'seller' },
        { id: 2, name: 'Ana García', role: 'buyer' }
      ],
      lastMessage: {
        text: 'Me gustaría visitarla este fin de semana si es posible.',
        timestamp: new Date(Date.now() - 1800000),
        sender: { name: 'Ana García' }
      },
      unreadCount: 2,
      isActive: true,
      isArchived: false,
      isMuted: false,
      isTyping: false
    },
    {
      id: 2,
      property: {
        id: 2,
        title: 'Casa Familiar con Jardín',
        image: 'https://via.placeholder.com/50x50?text=Casa1'
      },
      participants: [
        { id: 3, name: 'María González', role: 'seller' },
        { id: 4, name: 'Roberto Silva', role: 'buyer' },
        { id: 5, name: 'Luis Martínez', role: 'agent' }
      ],
      lastMessage: {
        text: 'Perfecto, entonces nos vemos mañana a las 3 PM.',
        timestamp: new Date(Date.now() - 7200000),
        sender: { name: 'Luis Martínez' }
      },
      unreadCount: 0,
      isActive: true,
      isArchived: false,
      isMuted: true,
      isTyping: true,
      typingUsers: ['Roberto Silva']
    },
    {
      id: 3,
      property: {
        id: 3,
        title: 'Oficina Ejecutiva Centro',
        image: 'https://via.placeholder.com/50x50?text=Ofi1'
      },
      participants: [
        { id: 6, name: 'Ana Martínez', role: 'seller' },
        { id: 7, name: 'Pedro López', role: 'buyer' }
      ],
      lastMessage: {
        text: 'Los documentos están en orden. ¿Cuándo podemos cerrar?',
        timestamp: new Date(Date.now() - 86400000),
        sender: { name: 'Pedro López' }
      },
      unreadCount: 1,
      isActive: false,
      isArchived: true,
      isMuted: false,
      isTyping: false
    },
    {
      id: 4,
      property: {
        id: 4,
        title: 'Penthouse Vista al Mar',
        image: 'https://via.placeholder.com/50x50?text=Pen1'
      },
      participants: [
        { id: 8, name: 'Sofía Vargas', role: 'seller' },
        { id: 9, name: 'Diego Morales', role: 'buyer' }
      ],
      lastMessage: {
        text: 'Negociación finalizada exitosamente.',
        timestamp: new Date(Date.now() - 172800000),
        sender: { name: 'Sofía Vargas' }
      },
      unreadCount: 0,
      isActive: false,
      isArchived: true,
      isMuted: false,
      isTyping: false
    }
  ];

  const conversationsToShow = conversations.length > 0 ? conversations : defaultConversations;

  // Funciones para gestión de conversaciones
  const handleArchiveConversation = (conversationId, e) => {
    e.stopPropagation();
    // Aquí implementarías la lógica para archivar/desarchivar
    console.log('Archivando conversación:', conversationId);
    // En una implementación real, actualizarías el estado en Redux o llamarías a la API
  };

  const handleMuteConversation = (conversationId, e) => {
    e.stopPropagation();
    // Aquí implementarías la lógica para silenciar/activar notificaciones
    console.log('Silenciando conversación:', conversationId);
    // En una implementación real, actualizarías el estado en Redux o llamarías a la API
  };

  const handleConversationClick = (conversationId) => {
    if (onSelectConversation) {
      const conversation = conversationsToShow.find(conv => conv.id === conversationId);
      if (conversation) {
        onSelectConversation(conversation);
      }
    } else {
      navigate(`/chat/${conversationId}`);
    }
  };

  const filteredConversations = conversationsToShow.filter(conversation => {
    // Filtrar por archivadas/no archivadas
    if (showArchived !== conversation.isArchived) return false;
    
    // Filtrar por término de búsqueda
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (searchFilter) {
      case 'property':
        return conversation.property?.title.toLowerCase().includes(searchLower);
      case 'participants':
        return conversation.participants?.some(p => p.name.toLowerCase().includes(searchLower));
      case 'messages':
        return conversation.lastMessage?.text.toLowerCase().includes(searchLower);
      default: // 'all'
        return (
          conversation.property?.title.toLowerCase().includes(searchLower) ||
          conversation.participants?.some(p => p.name.toLowerCase().includes(searchLower)) ||
          conversation.lastMessage?.text.toLowerCase().includes(searchLower)
        );
    }
  });

  const getRoleColor = (role) => {
    const colors = {
      buyer: 'primary',
      seller: 'success',
      agent: 'warning'
    };
    return colors[role] || 'secondary';
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="h-100 d-flex flex-column">
      {/* Header con controles */}
      <div className="p-3 border-bottom">
        {/* Buscador mejorado */}
        <InputGroup size="sm" className="mb-2">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              {searchFilter === 'all' ? 'Todo' : 
               searchFilter === 'property' ? 'Propiedades' :
               searchFilter === 'participants' ? 'Personas' : 'Mensajes'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSearchFilter('all')}>
                🔍 Todo
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchFilter('property')}>
                🏠 Solo Propiedades
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchFilter('participants')}>
                👥 Solo Personas
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchFilter('messages')}>
                💬 Solo Mensajes
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup>

        {/* Toggle archivadas */}
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant={showArchived ? "primary" : "outline-secondary"}
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            <FaArchive className="me-1" />
            {showArchived ? 'Ver Activas' : 'Ver Archivadas'}
          </Button>
          <small className="text-muted">
            {filteredConversations.length} conversación{filteredConversations.length !== 1 ? 'es' : ''}
          </small>
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-grow-1 overflow-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted">
            {searchTerm ? (
              <>
                <FaSearch size={48} className="mb-3 opacity-50" />
                <h6>No se encontraron conversaciones</h6>
                <p className="small">Intenta con otros términos de búsqueda</p>
              </>
            ) : (
              <>
                <FaComments size={48} className="mb-3 opacity-50" />
                <h6>No tienes conversaciones</h6>
                <p className="small">Las conversaciones aparecerán aquí cuando inicies una consulta sobre una propiedad.</p>
                <Button variant="primary" size="sm" onClick={() => navigate('/properties')}>
                  Ver Propiedades
                </Button>
              </>
            )}
          </div>
        ) : (
          <ListGroup variant="flush">
            {filteredConversations.map((conversation) => {
              const isSelected = conversation.id === parseInt(selectedConversationId);
              const otherParticipants = conversation.participants?.filter(p => p.id !== currentUser?.id) || [];
              
              return (
                <ListGroup.Item
                  key={conversation.id}
                  action
                  active={isSelected}
                  onClick={() => handleConversationClick(conversation.id)}
                  className={`border-0 py-3 ${isSelected ? 'bg-primary bg-opacity-10' : ''} ${conversation.isArchived ? 'opacity-75' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-start">
                    {/* Avatar/Imagen de propiedad */}
                    <div className="me-3 position-relative">
                      <img
                        src={conversation.property?.image}
                        alt={conversation.property?.title}
                        className="rounded"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                      {conversation.unreadCount > 0 && !conversation.isMuted && (
                        <Badge 
                          bg="danger" 
                          pill 
                          className="position-absolute top-0 start-100 translate-middle"
                          style={{ fontSize: '0.6em' }}
                        >
                          {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                        </Badge>
                      )}
                      {conversation.isMuted && (
                        <div className="position-absolute bottom-0 end-0 bg-warning rounded-circle p-1">
                          <FaBellSlash size={8} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow-1 min-w-0">
                      {/* Título de la propiedad */}
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className={`mb-0 text-truncate ${conversation.isArchived ? 'text-muted' : ''}`} style={{ fontSize: '0.9em' }}>
                          <FaHome className="me-1 text-muted" size={12} />
                          {conversation.property?.title}
                          {conversation.isArchived && (
                            <FaArchive className="ms-2 text-muted" size={10} />
                          )}
                        </h6>
                        <div className="d-flex align-items-center">
                          <small className="text-muted flex-shrink-0 ms-2">
                            {conversation.lastMessage?.timestamp && 
                              formatDistanceToNow(conversation.lastMessage.timestamp, { 
                                addSuffix: true, 
                                locale: es 
                              })
                            }
                          </small>
                          {/* Menú de opciones */}
                          <Dropdown>
                            <Dropdown.Toggle 
                              variant="link" 
                              size="sm" 
                              className="p-1 text-muted border-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaEllipsisV size={12} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item 
                                onClick={(e) => handleArchiveConversation(conversation.id, e)}
                              >
                                {conversation.isArchived ? (
                                  <>
                                    <FaUndo className="me-2" />
                                    Desarchivar
                                  </>
                                ) : (
                                  <>
                                    <FaArchive className="me-2" />
                                    Archivar
                                  </>
                                )}
                              </Dropdown.Item>
                              <Dropdown.Item 
                                onClick={(e) => handleMuteConversation(conversation.id, e)}
                              >
                                {conversation.isMuted ? (
                                  <>
                                    <FaBell className="me-2" />
                                    Activar notificaciones
                                  </>
                                ) : (
                                  <>
                                    <FaBellSlash className="me-2" />
                                    Silenciar notificaciones
                                  </>
                                )}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      {/* Participantes */}
                      <div className="mb-2">
                        {otherParticipants.map((participant, index) => (
                          <Badge 
                            key={participant.id}
                            bg={getRoleColor(participant.role)}
                            className="me-1 text-white"
                            style={{ fontSize: '0.6em' }}
                          >
                            <FaUser size={8} className="me-1" />
                            {participant.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Último mensaje */}
                      <div className="d-flex justify-content-between align-items-center">
                        {conversation.isTyping && conversation.typingUsers?.length > 0 ? (
                          <p className="mb-0 text-success fst-italic" style={{ fontSize: '0.8em' }}>
                            <span className="typing-dots me-1">●●●</span>
                            {conversation.typingUsers.join(', ')} {conversation.typingUsers.length === 1 ? 'está' : 'están'} escribiendo...
                          </p>
                        ) : (
                          <p 
                            className={`mb-0 text-truncate ${
                              conversation.unreadCount > 0 && !conversation.isMuted ? 'fw-bold' : 'text-muted'
                            }`}
                            style={{ fontSize: '0.8em' }}
                          >
                            {conversation.lastMessage?.sender?.name && (
                              <span className="me-1">
                                {conversation.lastMessage.sender.name}:
                              </span>
                            )}
                            {truncateText(conversation.lastMessage?.text)}
                          </p>
                        )}
                        
                        <div className="d-flex align-items-center ms-2">
                          {conversation.isActive && (
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Conversación activa</Tooltip>}
                            >
                              <FaCircle 
                                size={8} 
                                className="text-success me-1"
                              />
                            </OverlayTrigger>
                          )}
                          {conversation.unreadCount > 0 && !conversation.isMuted && (
                            <Badge bg="primary" pill style={{ fontSize: '0.6em' }}>
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          {conversation.isMuted && conversation.unreadCount > 0 && (
                            <Badge bg="warning" pill style={{ fontSize: '0.6em' }}>
                              <FaBellSlash size={8} />
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;