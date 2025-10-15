const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { verifyToken } = require('../middlewares/authMiddleware');
const { generalLimiter } = require('../middlewares/rateLimiters');
const conversationController = require('../controllers/conversationController');
const router = express.Router();

// GET /conversations/:id/offers
router.get('/:id/offers', verifyToken, generalLimiter, conversationController.getConversationOffers);

// POST /conversations/:id/appointments
router.post('/:id/appointments', verifyToken, generalLimiter, conversationController.createAppointment);

// POST /conversations/:id/messages/file
router.post('/:id/messages/file', verifyToken, upload.single('file'), generalLimiter, conversationController.sendFileMessage);

// PUT /conversations/:id/messages/read
router.put('/:id/messages/read', verifyToken, generalLimiter, conversationController.markMessagesAsRead);

// POST /conversations/:id/offers
router.post('/:id/offers', verifyToken, generalLimiter, (req, res) => {
  // Aquí iría la lógica real para crear una oferta en una conversación
  res.status(201).json({
    success: true,
    data: null,
    message: 'Oferta creada correctamente (stub)',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
