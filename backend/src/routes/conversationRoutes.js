const express = require('express');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination: 'uploads/',
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const basename = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, basename + ext);
	}
});
const upload = multer({ storage });
const { verifyToken } = require('../middlewares/authMiddleware');
const { generalLimiter } = require('../middlewares/rateLimiters');
const conversationController = require('../controllers/conversationController');
const router = express.Router();

// GET /conversations/:id/messages
router.get('/:id/messages', verifyToken, generalLimiter, conversationController.getConversationMessages);
// GET /conversations
router.get('/', verifyToken, generalLimiter, conversationController.getUserConversations);
// POST /conversations
router.post('/', verifyToken, generalLimiter, conversationController.createConversation);
// GET /conversations/:id/offers
router.get('/:id/offers', verifyToken, generalLimiter, conversationController.getConversationOffers);
// POST /conversations/:id/appointments
router.post('/:id/appointments', verifyToken, generalLimiter, conversationController.createAppointment);
// POST /conversations/:id/messages (mensaje de texto)
router.post('/:id/messages', verifyToken, generalLimiter, conversationController.createMessageInConversation);
// POST /conversations/:id/messages/file
router.post('/:id/messages/file', verifyToken, upload.single('file'), generalLimiter, conversationController.sendFileMessage);
// PUT /conversations/:id/messages/read
router.put('/:id/messages/read', verifyToken, generalLimiter, conversationController.markMessagesAsRead);
// POST /conversations/:id/offers
router.post('/:id/offers', verifyToken, generalLimiter, conversationController.createOfferInConversation);

module.exports = router;
