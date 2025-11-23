const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Inmotech FS',
      version: '1.0.0',
      description: 'Documentación de la API según 05-api-documentacion.md'
    },
    servers: [
  { url: 'http://192.168.20.82:3000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'], // Documentar rutas
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
