import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';

import ConversationsList from '@components/chat/ConversationsList';
import ChatWindow from '@components/chat/ChatWindow';
import ConversationInfo from '@components/chat/ConversationInfo';

const ChatPage = () => {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  
  const [showInfo, setShowInfo] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);

  // Cargar conversaciones desde localStorage al montar el componente
  useEffect(() => {
    const loadConversations = () => {
      const storedConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      setConversations(storedConversations);
      
      // Si hay un parámetro de conversación en la URL, seleccionarla
      const conversationFromUrl = searchParams.get('conversation') || conversationId;
      if (conversationFromUrl) {
        const conversation = storedConversations.find(conv => conv.id === conversationFromUrl);
        if (conversation) {
          setSelectedConversation(conversation);
        }
      }
    };

    loadConversations();
  }, [searchParams, conversationId]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowInfo(false);
  };

  return (
    <div>
      {/* Header con navegación */}
      <Container fluid className="bg-light border-bottom py-2">
        <Row>
          <Col>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              ← Volver al Dashboard
            </Button>
          </Col>
        </Row>
      </Container>
      
      <Container fluid className="px-0" style={{ height: 'calc(100vh - 112px)' }}>
        <Row className="g-0 h-100">
          {/* Lista de conversaciones */}
          <Col md={4} lg={3} className="border-end bg-white">
            <div className="h-100 d-flex flex-column">
              <div className="p-3 border-bottom bg-light">
                <h5 className="mb-0">💬 Conversaciones</h5>
                <small className="text-muted">Chat inmobiliario</small>
              </div>
              <div className="flex-grow-1 overflow-auto">
                <ConversationsList 
                  conversations={conversations}
                  selectedConversationId={selectedConversation?.id}
                  onSelectConversation={handleSelectConversation}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </Col>

          {/* Ventana de chat principal */}
          <Col md={showInfo && selectedConversation ? 5 : 8} lg={showInfo && selectedConversation ? 6 : 9} className="d-flex flex-column">
            {selectedConversation ? (
              <ChatWindow 
                conversation={selectedConversation}
                onToggleInfo={() => setShowInfo(!showInfo)}
                showInfoButton={true}
              />
            ) : (
              <div className="h-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h4>Selecciona una conversación</h4>
                  <p>Elige una conversación para comenzar a chatear</p>
                </div>
              </div>
            )}
          </Col>

          {/* Panel de información */}
          {showInfo && conversationId && (
            <Col md={3} lg={3} className="border-start bg-light">
              <ConversationInfo 
                conversation={{
                  id: conversationId,
                  property: { title: 'Apartamento Zona Norte' },
                  participants: [
                    { id: 1, name: 'Usuario Actual', role: 'buyer' },
                    { id: 2, name: 'Carlos Rodríguez', role: 'seller' }
                  ]
                }}
                onClose={() => setShowInfo(false)}
              />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default ChatPage;