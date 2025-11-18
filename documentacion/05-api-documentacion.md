# Documentación de API - Sistema de Chat Inmobiliario

## 1. Información General de la API

### 1.1 Base URL
```
Desarrollo: http://localhost:3000/api/v1
Producción: https://api.inmochat.com/api/v1
```

### 1.2 Autenticación
Todas las rutas protegidas requieren JWT token en el header:
```
Authorization: Bearer <jwt_token>
```

### 1.3 Formato de Respuestas
```json
{
  "success": true,
  "data": {...},
  "message": "Descripción de la operación",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 1.4 Manejo de Errores
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": {...}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 2. Endpoints de Autenticación

### 2.1 Registro de Usuario

**POST** `/auth/register`

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña_segura",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "role": "buyer|seller|agent",
  "phone": "+1234567890"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@email.com",
      "firstName": "Nombre",
      "lastName": "Apellido",
      "role": "buyer",
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  },
  "message": "Usuario registrado exitosamente"
}
```

### 2.2 Inicio de Sesión

**POST** `/auth/login`

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@email.com",
      "firstName": "Nombre",
      "lastName": "Apellido",
      "role": "buyer",
      "isVerified": true
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### 2.3 Renovar Token

**POST** `/auth/refresh`

**Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

## 3. Endpoints de Usuarios

### 3.1 Obtener Perfil de Usuario

**GET** `/users/profile`

**Headers:** `Authorization: Bearer <token>`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@email.com",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "role": "buyer",
    "phone": "+1234567890",
    "avatarUrl": "https://...",
    "isVerified": true,
    "preferences": {
      "notifications": {
        "email": true,
        "push": true
      },
      "privacy": {
        "showPhone": false,
        "showEmail": true
      }
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.2 Actualizar Perfil

**PUT** `/users/profile`

**Body:**
```json
{
  "firstName": "Nuevo Nombre",
  "lastName": "Nuevo Apellido",
  "phone": "+0987654321",
  "preferences": {
    "notifications": {
      "email": false,
      "push": true
    }
  }
}
```

### 3.3 Subir Avatar

**POST** `/users/avatar`

**Content-Type:** `multipart/form-data`

**Body:** Archivo de imagen (max 5MB)

## 4. Endpoints de Propiedades

### 4.1 Listar Propiedades

**GET** `/properties`

**Query Parameters:**
- `page` (number): Página (default: 1)
- `limit` (number): Elementos por página (default: 20, max: 100)
- `city` (string): Filtrar por ciudad
- `minPrice` (number): Precio mínimo
- `maxPrice` (number): Precio máximo
- `propertyType` (string): Tipo de propiedad
- `status` (string): Estado de la propiedad

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "uuid",
        "title": "Casa en el centro",
        "description": "Hermosa casa...",
        "price": 250000,
        "address": "Calle 123",
        "city": "Ciudad",
        "state": "Estado",
        "propertyType": "house",
        "status": "active",
        "images": ["url1", "url2"],
        "seller": {
          "id": "uuid",
          "firstName": "Vendedor",
          "lastName": "Apellido"
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 4.2 Obtener Propiedad por ID

**GET** `/properties/:id`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Casa en el centro",
    "description": "Descripción detallada...",
    "price": 250000,
    "address": "Calle 123",
    "city": "Ciudad",
    "state": "Estado",
    "postalCode": "12345",
    "propertyType": "house",
    "status": "active",
    "features": {
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 150,
      "parking": true,
      "garden": true
    },
    "images": [
      {
        "url": "https://...",
        "caption": "Sala principal",
        "isPrimary": true
      }
    ],
    "seller": {
      "id": "uuid",
      "firstName": "Vendedor",
      "lastName": "Apellido",
      "phone": "+1234567890",
      "isVerified": true
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

## 5. Endpoints de Conversaciones

### 5.1 Listar Conversaciones del Usuario

**GET** `/conversations`

**Query Parameters:**
- `page` (number): Página
- `limit` (number): Elementos por página
- `status` (string): Estado de conversación

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "property": {
          "id": "uuid",
          "title": "Casa en el centro",
          "price": 250000,
          "images": ["url"]
        },
        "participants": [
          {
            "id": "uuid",
            "firstName": "Juan",
            "lastName": "Pérez",
            "role": "buyer",
            "avatarUrl": "https://...",
            "isOnline": true,
            "lastSeen": "2024-01-01T00:00:00Z"
          }
        ],
        "lastMessage": {
          "id": "uuid",
          "content": "¿Podemos programar una visita?",
          "senderId": "uuid",
          "type": "text",
          "createdAt": "2024-01-01T00:00:00Z"
        },
        "unreadCount": 2,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### 5.2 Crear Nueva Conversación

**POST** `/conversations`

**Body:**
```json
{
  "propertyId": "uuid",
  "participantId": "uuid",
  "initialMessage": "Estoy interesado en esta propiedad"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "uuid",
      "propertyId": "uuid",
      "participants": [...],
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "message": {
      "id": "uuid",
      "content": "Estoy interesado en esta propiedad",
      "senderId": "uuid",
      "type": "text",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 5.3 Obtener Conversación por ID

**GET** `/conversations/:id`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "property": {...},
    "participants": [...],
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 5.4 Agregar Participante (Solo Intermediarios)

**POST** `/conversations/:id/participants`

**Body:**
```json
{
  "userId": "uuid"
}
```

## 6. Endpoints de Mensajes

### 6.1 Obtener Mensajes de Conversación

**GET** `/conversations/:id/messages`

**Query Parameters:**
- `page` (number): Página
- `limit` (number): Mensajes por página (default: 50)
- `before` (string): ID del mensaje para paginación cursor

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "content": "Mensaje de texto",
        "senderId": "uuid",
        "sender": {
          "id": "uuid",
          "firstName": "Juan",
          "lastName": "Pérez",
          "avatarUrl": "https://..."
        },
        "type": "text",
        "isRead": true,
        "readBy": [
          {
            "userId": "uuid",
            "readAt": "2024-01-01T00:00:00Z"
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": "uuid",
        "content": null,
        "senderId": "uuid",
        "type": "file",
        "file": {
          "url": "https://...",
          "name": "plano.pdf",
          "size": 1024000,
          "mimeType": "application/pdf"
        },
        "isRead": false,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "hasMore": true,
      "nextCursor": "uuid"
    }
  }
}
```

### 6.2 Enviar Mensaje de Texto

**POST** `/conversations/:id/messages`

**Body:**
```json
{
  "content": "Contenido del mensaje",
  "type": "text"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Contenido del mensaje",
    "senderId": "uuid",
    "type": "text",
    "isRead": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 6.3 Enviar Archivo

**POST** `/conversations/:id/messages/file`

**Content-Type:** `multipart/form-data`

**Body:**
- `file`: Archivo (max 10MB)
- `caption` (opcional): Descripción del archivo

### 6.4 Marcar Mensajes como Leídos

**PUT** `/conversations/:id/messages/read`

**Body:**
```json
{
  "messageIds": ["uuid1", "uuid2"]
}
```

## 7. Endpoints de Ofertas

### 7.1 Crear Oferta Formal

**POST** `/conversations/:id/offers`

**Body:**
```json
{
  "amount": 240000,
  "paymentTerms": "Financiamiento bancario 80%",
  "closingDate": "2024-03-01",
  "conditions": "Sujeto a inspección técnica",
  "validUntil": "2024-02-01"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "conversationId": "uuid",
    "buyerId": "uuid",
    "amount": 240000,
    "paymentTerms": "Financiamiento bancario 80%",
    "closingDate": "2024-03-01",
    "conditions": "Sujeto a inspección técnica",
    "validUntil": "2024-02-01",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 7.2 Responder a Oferta

**PUT** `/offers/:id/respond`

**Body:**
```json
{
  "action": "accept|reject|counter",
  "response": "Razón del rechazo o términos de contraoferta",
  "counterOffer": {
    "amount": 245000,
    "paymentTerms": "Pago de contado",
    "closingDate": "2024-02-15"
  }
}
```

### 7.3 Obtener Ofertas de Conversación

**GET** `/conversations/:id/offers`

## 8. Endpoints de Citas

### 8.1 Programar Cita

**POST** `/conversations/:id/appointments`

**Body:**
```json
{
  "scheduledFor": "2024-01-15T10:00:00Z",
  "duration": 60,
  "type": "property_visit",
  "notes": "Visita para inspección general",
  "location": "En la propiedad"
}
```

### 8.2 Confirmar/Modificar Cita

**PUT** `/appointments/:id`

**Body:**
```json
{
  "status": "confirmed|cancelled|rescheduled",
  "scheduledFor": "2024-01-16T10:00:00Z",
  "notes": "Nuevas notas"
}
```

## 9. WebSocket Events

### 9.1 Eventos del Cliente

```javascript
// Conectar y autenticar
socket.emit('authenticate', { token: 'jwt_token' });

// Unirse a conversación
socket.emit('join_conversation', { conversationId: 'uuid' });

// Enviar mensaje en tiempo real
socket.emit('send_message', {
  conversationId: 'uuid',
  content: 'Mensaje',
  type: 'text'
});

// Indicar que está escribiendo
socket.emit('typing_start', { conversationId: 'uuid' });
socket.emit('typing_stop', { conversationId: 'uuid' });

// Marcar como leído
socket.emit('mark_read', { 
  conversationId: 'uuid',
  messageIds: ['uuid1', 'uuid2']
});
```

### 9.2 Eventos del Servidor

```javascript
// Confirmaciones
socket.on('authenticated', (data) => {
  // { userId: 'uuid', role: 'buyer' }
});

socket.on('joined_conversation', (data) => {
  // { conversationId: 'uuid' }
});

// Mensajes en tiempo real
socket.on('new_message', (data) => {
  // Estructura completa del mensaje
});

// Estados de usuarios
socket.on('user_typing', (data) => {
  // { userId: 'uuid', conversationId: 'uuid' }
});

socket.on('user_online', (data) => {
  // { userId: 'uuid' }
});

socket.on('user_offline', (data) => {
  // { userId: 'uuid', lastSeen: 'timestamp' }
});

// Eventos especiales
socket.on('new_offer', (data) => {
  // Notificación de nueva oferta
});

socket.on('offer_response', (data) => {
  // Respuesta a oferta
});

socket.on('appointment_scheduled', (data) => {
  // Nueva cita programada
});
```

## 10. Códigos de Error

| Código | Descripción |
|--------|-------------|
| `AUTH_001` | Token inválido o expirado |
| `AUTH_002` | Credenciales incorrectas |
| `AUTH_003` | Usuario no verificado |
| `USER_001` | Usuario no encontrado |
| `USER_002` | Email ya registrado |
| `CONV_001` | Conversación no encontrada |
| `CONV_002` | Sin permisos para acceder |
| `MSG_001` | Mensaje muy largo |
| `MSG_002` | Archivo muy grande |
| `MSG_003` | Tipo de archivo no permitido |
| `OFFER_001` | Oferta inválida |
| `OFFER_002` | Oferta ya respondida |
| `RATE_001` | Límite de requests excedido |
| `VALIDATION_001` | Datos de entrada inválidos |

## 11. Rate Limiting

| Endpoint | Límite |
|----------|--------|
| `/auth/login` | 5 requests/minuto por IP |
| `/auth/register` | 3 requests/minuto por IP |
| `/messages` | 60 requests/minuto por usuario |
| `/conversations` | 100 requests/minuto por usuario |
| General API | 1000 requests/hora por usuario |

## 12. Versionado de API

Todas las rutas REST están agrupadas bajo el prefijo `/api/v1`.

La API utiliza versionado semántico en la URL:
- `/api/v1` - Versión actual estable (todas las rutas documentadas usan este prefijo)
- `/api/v2` - Próxima versión (beta)

Los cambios breaking requieren nueva versión mayor.
Los cambios compatibles incrementan versión menor.
Las correcciones de bugs incrementan versión patch.