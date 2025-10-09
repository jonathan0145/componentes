import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

import ConversationsList from '@components/chat/ConversationsList';
import ChatWindow from '@components/chat/ChatWindow';
import ConversationInfo from '@components/chat/ConversationInfo';

import { fetchConversations, clearCurrentConversation } from '@store/slices/chatSlice';
import socketService from '@services/socketService';

const ChatPage = () => {
  const { conversationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const { conversations, currentConversation, isConnected } = useSelector(state => state.chat);
  
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // Conectar socket si hay token
    if (token && !socketService.getConnectionStatus()) {
      socketService.connect(token);
    }

    // Cargar conversaciones
    dispatch(fetchConversations());

    return () => {
      // Limpiar conversación actual al salir
      dispatch(clearCurrentConversation());
    };
  }, [dispatch, token]);

  useEffect(() => {
    // Limpiar conversación actual cuando cambia la URL
    if (!conversationId) {
      dispatch(clearCurrentConversation());
    }
  }, [conversationId, dispatch]);

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
              <h5 className="mb-0">Conversaciones</h5>
              {!isConnected && (
                <small className="text-danger">Desconectado</small>
              )}
            </div>
            <div className="flex-grow-1 overflow-auto">
              <ConversationsList 
                conversations={conversations}
                selectedConversationId={conversationId}
              />
            </div>
          </div>
        </Col>

        {/* Ventana de chat */}
        <Col md={showInfo ? 5 : 8} lg={showInfo ? 6 : 9}>
          {conversationId ? (
            <ChatWindow 
              conversationId={conversationId}
              onToggleInfo={() => setShowInfo(!showInfo)}
              showInfoButton={true}
            />
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center bg-light">
              <div className="text-center text-muted">
                <div className="mb-3">
                  <i className="bi bi-chat-dots" style={{ fontSize: '4rem' }}></i>
                </div>
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
              conversation={currentConversation}
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