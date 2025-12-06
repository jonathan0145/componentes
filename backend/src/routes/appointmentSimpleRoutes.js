const express = require('express');
const { body, validationResult } = require('express-validator');
const { generalLimiter } = require('../middlewares/rateLimiters');
const appointmentSimpleController = require('../controllers/appointmentSimpleController');
const router = express.Router();

// POST /api/appointments/simple
router.post('/simple',
  generalLimiter,
  [
    body('userId').isInt(),
    body('propertyId').isInt(),
    body('date').isISO8601()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  appointmentSimpleController.createSimpleAppointment
);

module.exports = router;
