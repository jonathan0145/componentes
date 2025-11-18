// utils/conversationUtils.js
// Función para validar si un usuario pertenece a una conversación
const { Conversation, Chat } = require('../models');

/**
 * Verifica si el usuario pertenece a la conversación indicada
 * @param {string} userId
 * @param {string} conversationId
 * @returns {Promise<boolean>}
 */
async function userBelongsToConversation(userId, conversationId) {
  // Buscar la conversación por ID
  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) return false;

  // Si la conversación tiene participantes explícitos
  if (conversation.participants && Array.isArray(conversation.participants)) {
    return conversation.participants.includes(userId);
  }

  // Si se usa modelo Chat, buscar en Chat
  const chat = await Chat.findByPk(conversationId);
  if (chat && chat.participants && Array.isArray(chat.participants)) {
    return chat.participants.includes(userId);
  }

  // Si no hay campo participants, intentar con buyerId/sellerId
  if (conversation.buyerId && conversation.sellerId) {
    return (
      conversation.buyerId === userId || conversation.sellerId === userId
    );
  }

  // Si no se puede determinar, denegar
  return false;
}

module.exports = { userBelongsToConversation };