# Arquitectura Técnica - Sistema de Chat Inmobiliario

## 1. Visión General de la Arquitectura

### 1.1 Patrón Arquitectónico
- **Arquitectura de Microservicios**: Separación de responsabilidades en servicios independientes
- **Cliente-Servidor**: Frontend SPA + Backend API REST + WebSocket para tiempo real
- **Event-Driven**: Comunicación asíncrona entre servicios mediante eventos

### 1.2 Stack Tecnológico Recomendado

#### Frontend
- **Framework**: React.js o Vue.js
- **Estado**: Redux/Vuex para manejo de estado global
- **UI**: Material-UI o Tailwind CSS
- **WebSocket**: Socket.io-client para comunicación en tiempo real
- **Routing**: React Router o Vue Router

#### Backend
- **Runtime**: Node.js con Express.js
- **WebSocket**: Socket.io para comunicación en tiempo real
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Joi o Yup para validación de datos

#### Base de Datos
- **Principal**: PostgreSQL para datos relacionales
- **Cache**: Redis para sesiones y cache de mensajes frecuentes
- **Archivos**: AWS S3 o similar para almacenamiento de archivos

#### Infraestructura
- **Contenedores**: Docker para desarrollo y despliegue
- **Orquestación**: Docker Compose para desarrollo local
- **Proxy**: Nginx como reverse proxy
- **Monitoreo**: Winston para logs, Prometheus + Grafana para métricas

## 2. Diagrama de Componentes

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Mobile Client  │    │   Admin Panel   │
│   (React/Vue)   │    │  (React Native) │    │   (React/Vue)   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      Load Balancer      │
                    │        (Nginx)          │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      API Gateway        │
                    │    (Express.js)         │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
    ┌─────────▼─────────┐ ┌──────▼──────┐ ┌────────▼────────┐
    │   Auth Service    │ │ Chat Service│ │  User Service   │
    │   (Express.js)    │ │(Express.js) │ │  (Express.js)   │
    └─────────┬─────────┘ └──────┬──────┘ └────────┬────────┘
              │                  │                 │
              └──────────────────┼─────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Message Queue       │
                    │       (Redis)           │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
    ┌─────────▼─────────┐ ┌──────▼──────┐ ┌────────▼────────┐
    │   PostgreSQL      │ │    Redis    │ │   File Storage  │
    │   (Principal)     │ │   (Cache)   │ │     (AWS S3)    │
    └───────────────────┘ └─────────────┘ └─────────────────┘
```

## 3. Arquitectura de Base de Datos

### 3.1 Modelo de Datos Principal (PostgreSQL)

```sql
-- Tabla de usuarios
users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('buyer', 'seller', 'agent') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)

-- Tabla de propiedades
properties (
    id UUID PRIMARY KEY,
    seller_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    property_type ENUM('house', 'apartment', 'condo', 'land'),
    status ENUM('active', 'pending', 'sold', 'inactive'),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)

-- Tabla de conversaciones
conversations (
    id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    buyer_id UUID REFERENCES users(id),
    seller_id UUID REFERENCES users(id),
    agent_id UUID REFERENCES users(id) NULL,
    status ENUM('active', 'archived', 'closed'),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(property_id, buyer_id, seller_id)
)

-- Tabla de mensajes
messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    sender_id UUID REFERENCES users(id),
    content TEXT,
    message_type ENUM('text', 'file', 'system', 'offer'),
    file_url TEXT NULL,
    file_name VARCHAR(255) NULL,
    file_size INTEGER NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
)

-- Tabla de participantes en conversaciones
conversation_participants (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    user_id UUID REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT NOW(),
    last_read_at TIMESTAMP NULL,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    UNIQUE(conversation_id, user_id)
)
```

### 3.2 Estructura de Cache (Redis)

```
-- Sesiones de usuario
session:{user_id} -> {session_data}

-- Usuarios conectados
online_users -> Set{user_id1, user_id2, ...}

-- Rooms de Socket.io por conversación
room:{conversation_id} -> Set{socket_id1, socket_id2, ...}

-- Cache de mensajes recientes por conversación
messages:{conversation_id} -> List[message_objects] (últimos 50)

-- Contadores de mensajes no leídos
unread:{user_id} -> {conversation_id: count, ...}
```

## 4. Flujo de Comunicación WebSocket

### 4.1 Eventos del Cliente
```javascript
// Conexión y autenticación
client.emit('authenticate', { token: 'jwt_token' })
client.emit('join_conversation', { conversationId: 'uuid' })

// Envío de mensajes
client.emit('send_message', {
    conversationId: 'uuid',
    content: 'texto del mensaje',
    type: 'text'
})

// Indicadores de lectura
client.emit('mark_as_read', { 
    conversationId: 'uuid',
    messageId: 'uuid'
})
```

### 4.2 Eventos del Servidor
```javascript
// Confirmaciones
server.emit('authenticated', { userId, role })
server.emit('joined_conversation', { conversationId })

// Mensajes en tiempo real
server.emit('new_message', {
    id: 'uuid',
    conversationId: 'uuid',
    senderId: 'uuid',
    content: 'texto',
    type: 'text',
    timestamp: 'ISO_date'
})

// Estados de usuarios
server.emit('user_typing', { userId, conversationId })
server.emit('user_online', { userId })
server.emit('user_offline', { userId })
```

## 5. Seguridad

### 5.1 Autenticación y Autorización
- **JWT Tokens** con expiración de 24 horas
- **Refresh Tokens** para renovación automática
- **Rate Limiting** por IP y por usuario
- **Validación de roles** en cada endpoint

### 5.2 Comunicación Segura
- **HTTPS** obligatorio en producción
- **WSS** (WebSocket Secure) para comunicación en tiempo real
- **Validación de entrada** en todos los endpoints
- **Sanitización** de contenido de mensajes

### 5.3 Privacidad de Datos
- **Encriptación** de datos sensibles en base de datos
- **Logs sin información personal**
- **Retención de datos** según políticas de privacidad
- **Derecho al olvido** para eliminar datos de usuarios

## 6. Escalabilidad

### 6.1 Estrategias de Escalamiento
- **Escalamiento horizontal** de servicios con Docker
- **Load Balancing** con Nginx
- **Particionamiento** de base de datos por región
- **CDN** para archivos estáticos y multimedia

### 6.2 Optimizaciones
- **Paginación** en listados de mensajes y conversaciones
- **Lazy Loading** de archivos multimedia
- **Compresión** de respuestas HTTP
- **Índices** optimizados en base de datos

## 7. Monitoreo y Observabilidad

### 7.1 Métricas Clave
- Tiempo de respuesta de API
- Número de usuarios conectados simultáneamente
- Tasa de mensajes por segundo
- Uso de memoria y CPU
- Tasa de errores

### 7.2 Logs
- Eventos de autenticación
- Creación y envío de mensajes
- Errores de aplicación
- Eventos de conexión/desconexión WebSocket