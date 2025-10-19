# Especificación WebSocket (Socket.io) - InmoChat

Este archivo documenta el contrato, eventos, mensajes y la implementación mínima de WebSocket (Socket.io) que vamos a implementar en el backend para cumplir con la documentación y el frontend.

## Objetivo
- Añadir soporte real-time compatible con el frontend (cliente Socket.io) y la documentación actual.
- Definir eventos cliente/servidor, payloads, códigos de error y ejemplos.
- Incluir pasos de implementación en `backend/src` y notas para pruebas locales.

---

## 1. Resumen de eventos (cliente -> servidor)
- `authenticate` : Autentica la conexión con JWT.
  - Payload: { token: string }
- `join_conversation` : Unirse a la sala de una conversación.
  - Payload: { conversationId: string }
- `leave_conversation` : Salir de la sala.
  - Payload: { conversationId: string }
- `send_message` : Enviar mensaje en tiempo real.
  - Payload: { conversationId: string, content: string, type: 'text'|'file'|'offer', meta?: {...} }
- `typing_start` / `typing_stop` : Indicadores de escritura.
  - Payload: { conversationId: string }
- `mark_read` : Marcar mensajes como leídos.
  - Payload: { conversationId: string, messageIds: [string] }
- `send_offer` : Enviar oferta desde cliente (opcional si se envía por REST).
  - Payload: { conversationId: string, amount: number, paymentTerms?: string, validUntil?: string, notes?: string }
- `schedule_appointment` : Solicitar creación de cita desde cliente.
  - Payload: { conversationId: string, scheduledFor: string, duration?: number, type?: string, notes?: string, location?: string }

## 2. Resumen de eventos (servidor -> cliente)
- `authenticated` : Confirmación de autenticación.
  - Payload: { userId: string, role?: string }
- `authentication_error` : Error de autenticación en el socket.
  - Payload: { code: string, message: string }
- `joined_conversation` : Confirmación de unión a sala.
  - Payload: { conversationId: string }
- `new_message` : Nuevo mensaje en la conversación.
  - Payload: objeto `message` con estructura estándar usada por la API.
- `user_typing` / `user_stop_typing` : Indicadores de escritura.
  - Payload: { userId: string, conversationId: string }
- `user_online` / `user_offline` : Estado de presencia.
  - Payload: { userId: string, lastSeen?: string }
- `new_offer` : Notificar nueva oferta.
  - Payload: objeto `offer` según API.
- `offer_response` : Notificar respuesta a oferta.
  - Payload: objeto con estado/response de la oferta.
- `appointment_scheduled` : Notificar nueva cita.
  - Payload: objeto `appointment`.

## 3. Contratos de payloads (ejemplos)
- Ejemplo `new_message`:
```json
{
  "id": "uuid",
  "conversationId": "uuid",
  "content": "Hola",
  "senderId": "uuid",
  "type": "text",
  "isRead": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

- Ejemplo `new_offer`:
```json
{
  "id": "uuid",
  "conversationId": "uuid",
  "buyerId": "uuid",
  "amount": 240000,
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 4. Autenticación en Socket.io
- Usar JWT en handshake o evento `authenticate`.
- Validar token con la misma lógica que `authMiddleware.verifyToken`.
- Si es válido, marcar socket como autenticado y emitir `authenticated`.
- Si es inválido, emitir `authentication_error` y desconectar opcionalmente.

## 5. Implementación mínima (pasos)
1. Añadir dependencia `socket.io` al `package.json` del backend.
2. Modificar `src/index.js`:
   - Crear `http.Server` a partir de `app` y levantar `io = new Server(httpServer, { cors: {...} })`.
   - Iniciar `httpServer.listen(PORT)` en lugar de `app.listen`.
   - Exponer `io` a través de un módulo `src/services/socketProvider.js` o adaptarlo a `app.locals.io`.
3. Crear `src/services/socketProvider.js` que exporte `init(io)` y `getIo()`.
4. Implementar handlers de eventos en `src/sockets/index.js` (organizar):
   - `connection` -> validar token -> `socket.on` para cada evento.
   - Unirse a salas: `socket.join('conversation:${id}')`.
   - Emitir eventos con `io.to('conversation:${id}').emit('new_message', message)`.
5. Actualizar controladores HTTP para usar `getIo()` y emitir eventos al crear mensajes/ofertas/citas.

## 6. Notas de pruebas locales
- En `frontend/.env` tienes `REACT_APP_SOCKET_URL=http://localhost:3000`.
- Comandos para probar manualmente:
```bash
# Iniciar backend (con Socket.io)
cd backend
npm install socket.io
npm run dev

# Iniciar frontend
cd frontend
npm start
```
- Usar la interfaz de chat en el frontend para verificar `new_message`, `typing` y `offer` events.

## 7. Casos de error y edge-cases
- Tokens inválidos/expirados: emitir `authentication_error` y no permitir acciones.
- Usuarios que intentan unirse a una conversación sin permiso: emitir error y/o devolver 403 por REST.
- Archivos grandes: controlar tamaño en `multer` y rechazar en el socket si es necesario.

## 8. Checklist de implementación

### Pendientes / mejoras (no implementadas completamente)

 - ✅ Persistencia completa de ofertas desde `createOfferInConversation` (ahora creada y persistida en el modelo `Offer`, vinculada a `Chat.propertyId`).
- [ ] Tests de integración (HTTP + Socket.io) para validar: autenticación socket, envío/recepción de `new_message`, `new_offer`, `appointment_scheduled`.
- [ ] Reforzar validaciones/permisos en handlers y controladores (verificar que el usuario pertenece a la conversación antes de emitir o unirse).
- [ ] Documentación adicional automatizada / fragmentos Swagger para los eventos WebSocket (opcional).

> Nota: las entradas principales de la checklist de la sección 5 (instalación de `socket.io`, inicialización en `src/index.js`, handlers y conexiones desde controladores) ya fueron implementadas en el código del backend.

---

Si quieres, procedo a implementar la integración mínima en el backend ahora (crear `socketProvider`, modificar `src/index.js`, crear `src/sockets/index.js` y conectar `conversationController`/`messageController` para emitir eventos). ¿Procedo?

---

Siguientes pasos que puedo ejecutar ahora (elige uno o varios):

Completar persistencia consistente: convertir la creación de oferta en conversación (createOfferInConversation) para guardarla en la tabla Offer (actualmente crea un objeto JS). También enlazar el offer -> conversations/chats si quieres que exista relación directa (por ejemplo, buscar chat por propertyId y guardar offer.propertyId).
Añadir validaciones más estrictas y permisos (verificar que el usuario que crea oferta/cita pertenece a la conversación).
Añadir tests unitarios rápidos (supertest) para los endpoints y para la conexión socket (puedo agregar tests que inicien el servidor y validen eventos básicos).
Actualizar Swagger docs o añadir comentarios adicionales en 05-api-documentacion.md o generar un fragmento socket.md dentro de la carpeta documentacion (ya está creado).
Ejecutar el backend localmente aquí en el entorno y hacer pruebas de socket con un cliente de prueba (haré npm install y npm run dev y luego una prueba rápida con un script Node que use socket.io-client para autenticar y enviar/recibir eventos). Nota: puedo ejecutar comandos en la terminal; dime si quieres que los ejecute.
Decide cómo quieres que proceda. Si me das luz verde, completaré la persistencia de ofertas y agregaré tests básicos de integración (HTTP + Socket.io) que verifiquen que la implementación cumple punto por punto con 05-api-documentacion.md y Haciendo/socket.md.