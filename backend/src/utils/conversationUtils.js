// utils/conversationUtils.js
// Función para validar si un usuario pertenece a una conversación
const { Chat } = require('../models');

/**
 * Verifica si el usuario pertenece a la conversación indicada
 * @param {string} userId
 * @param {string} conversationId
 * @returns {Promise<boolean>}
 */
async function userBelongsToConversation(userId, conversationId) {
  // Buscar la conversación por ID usando Chat
  const chat = await Chat.findByPk(conversationId);
  if (!chat) return false;

  // Si la conversación tiene participantes explícitos
  if (chat.participants && Array.isArray(chat.participants)) {
    // Convertir ids a número para comparación estricta
    return chat.participants.map(Number).includes(Number(userId));
  }

  // Si no hay campo participants, intentar con buyerId/sellerId/intermediaryId
  if (chat.buyerId && chat.sellerId) {
    return (
      Number(chat.buyerId) === Number(userId) ||
      Number(chat.sellerId) === Number(userId) ||
      (chat.intermediaryId && Number(chat.intermediaryId) === Number(userId))
    ) ? true : false;
  }

  // Si no se puede determinar, denegar
  return false;
}

/**
 * Crea una nueva conversación
 * @param {Object} property
 * @param {Object} registerRes
 * @returns {Promise<Object>}
 */
async function createConversation(property, registerRes) {
  // Crear una nueva conversación en la base de datos
  const chat = await Chat.create({
    propertyId: property ? property.id : null,
    buyerId: registerRes.body.user.id, // o el id del usuario creado
    sellerId: registerRes.body.user.id // o el id de otro usuario si lo deseas
  });

  return chat;
}

module.exports = { userBelongsToConversation, createConversation };