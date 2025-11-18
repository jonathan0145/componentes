const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// Middleware para formato de error según documentación
function rateLimitErrorHandler(req, res) {
  return res.status(429).json({
    success: false,
    error: {
      code: 'RATE_001',
      message: 'Límite de peticiones excedido',
      details: {
        endpoint: req.originalUrl,
  user: req.user ? req.user.id : ipKeyGenerator(req)
      }
    },
    timestamp: new Date().toISOString()
  });
}

// Límite general: 1000 requests/hora por usuario
const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 1000,
  keyGenerator: (req) => req.user ? req.user.id : ipKeyGenerator(req),
  handler: rateLimitErrorHandler
});

module.exports = {
  generalLimiter
};
