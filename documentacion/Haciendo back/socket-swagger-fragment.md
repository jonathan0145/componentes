# Swagger WebSocket (Socket.io) - InmoChat

Este fragmento describe los eventos WebSocket documentados para la API de InmoChat, siguiendo el estándar de Swagger/OpenAPI para eventos en tiempo real.

---

## WebSocket Events (Socket.io)

### Cliente → Servidor

#### authenticate
- **Descripción:** Autentica la conexión con JWT.
- **Payload:**
```json
{
  "token": "string"
}
```

#### join_conversation
- **Descripción:** Unirse a la sala de una conversación.
- **Payload:**
```json
{
  "conversationId": "string"
}
```

#### leave_conversation
- **Descripción:** Salir de la sala de una conversación.
- **Payload:**
```json
{
  "conversationId": "string"
}
```

#### send_message
- **Descripción:** Enviar mensaje en tiempo real.
- **Payload:**
```json
{
  "conversationId": "string",
  "content": "string",
  "type": "text|file|offer",
  "meta": { }
}
```

#### typing_start / typing_stop
- **Descripción:** Indicadores de escritura.
- **Payload:**
```json
{
  "conversationId": "string"
}
```

#### mark_read
- **Descripción:** Marcar mensajes como leídos.
- **Payload:**
```json
{
  "conversationId": "string",
  "messageIds": ["string"]
}
```

#### send_offer
- **Descripción:** Enviar oferta desde cliente.
- **Payload:**
```json
{
  "conversationId": "string",
  "amount": 1000,
  "paymentTerms": "string",
  "validUntil": "string",
  "notes": "string"
}
```

#### schedule_appointment
- **Descripción:** Solicitar creación de cita desde cliente.
- **Payload:**
```json
{
  "conversationId": "string",
  "scheduledFor": "string",
  "duration": 30,
  "type": "string",
  "notes": "string",
  "location": "string"
}
```

---

### Servidor → Cliente

#### authenticated
- **Descripción:** Confirmación de autenticación.
- **Payload:**
```json
{
  "userId": "string",
  "role": "string"
}
```

#### authentication_error
- **Descripción:** Error de autenticación en el socket.
- **Payload:**
```json
{
  "code": "string",
  "message": "string"
}
```

#### joined_conversation
- **Descripción:** Confirmación de unión a sala.
- **Payload:**
```json
{
  "conversationId": "string"
}
```

#### new_message
- **Descripción:** Nuevo mensaje en la conversación.
- **Payload:**
```json
{
  "id": "string",
  "conversationId": "string",
  "content": "string",
  "senderId": "string",
  "type": "text|file|offer",
  "isRead": false,
  "createdAt": "string"
}
```

#### user_typing / user_stop_typing
- **Descripción:** Indicadores de escritura.
- **Payload:**
```json
{
  "userId": "string",
  "conversationId": "string"
}
```

#### user_online / user_offline
- **Descripción:** Estado de presencia.
- **Payload:**
```json
{
  "userId": "string",
  "lastSeen": "string"
}
```

#### new_offer
- **Descripción:** Notificar nueva oferta.
- **Payload:**
```json
{
  "id": "string",
  "conversationId": "string",
  "buyerId": "string",
  "amount": 1000,
  "status": "pending",
  "createdAt": "string"
}
```

#### offer_response
- **Descripción:** Notificar respuesta a oferta.
- **Payload:**
```json
{
  "id": "string",
  "conversationId": "string",
  "status": "accepted|rejected|pending",
  "response": "string"
}
```

#### appointment_scheduled
- **Descripción:** Notificar nueva cita.
- **Payload:**
```json
{
  "id": "string",
  "conversationId": "string",
  "userId": "string",
  "date": "string",
  "notes": "string",
  "status": "pending|confirmed|cancelled",
  "createdAt": "string"
}
```

---

> Este fragmento puede ser referenciado desde la documentación principal o integrado en Swagger UI como sección de eventos WebSocket.
