# Documentación de Notificaciones: Backend y Frontend

## Backend

- El backend expone los siguientes endpoints:
  - `POST /api/push/send`: Envía una notificación push a un token FCM válido. Requiere autenticación (Bearer token). Body: `{ token, title, body }`.
  - `POST /api/email/send`: Envía un email simple. Requiere autenticación (Bearer token). Body: `{ to, subject, text }`.
- El backend **no** gestiona suscripciones, claves públicas ni almacena tokens. Solo recibe la petición y la envía usando Firebase Admin SDK (push) o Nodemailer (email).
- No existen endpoints como `/api/push/public-key`, `/api/push/subscribe` ni `/api/email/send-notification`.

## Frontend

### Notificaciones Push
1. El frontend obtiene el token FCM del usuario usando la función `getFcmToken` de `utils/pushNotifications.js`.
2. El usuario debe aceptar los permisos de notificación y el navegador debe registrar correctamente el service worker (`/service-worker.js`).
3. Para enviar una notificación push, el frontend llama a `sendPush({ token, title, body })` desde `services/pushService.js`.
4. El formulario de notificaciones debe pedir título y mensaje, y usar el token FCM obtenido.

### Notificaciones Email
1. El frontend usa la función `sendEmail({ to, subject, text })` de `services/emailService.js` para enviar emails.
2. El formulario debe pedir destinatario, asunto y mensaje.

### Consideraciones técnicas
- El frontend **no** debe intentar suscribirse ni obtener la clave pública desde el backend. La VAPID_KEY se configura directamente en el frontend.
- El archivo `public/service-worker.js` debe estar accesible desde la raíz del frontend y correctamente servido por Webpack.
- El frontend y el backend deben correr en puertos diferentes, pero el registro del service worker y la obtención del token FCM deben hacerse desde el mismo origen donde se sirve el frontend (ejemplo: http://localhost:3001).

## Flujo esperado

### Push
1. Usuario acepta notificaciones push → se obtiene el token FCM.
2. El usuario (o un admin) puede enviar una notificación usando el token, título y mensaje.
3. El backend recibe la petición y la envía a FCM.
4. El usuario recibe la notificación en su navegador si está activo.

### Email
1. Usuario llena destinatario, asunto y mensaje.
2. El frontend llama a `sendEmail`.
3. El backend envía el email usando Nodemailer.

## Troubleshooting
- Si ves un error 404 al registrar el service worker, asegúrate de acceder al frontend desde el puerto correcto y que el archivo esté en `public/service-worker.js`.
- Si el token FCM es null, revisa permisos de notificación, VAPID_KEY y configuración de Firebase.
- Si recibes un error con `<!DOCTYPE ...`, revisa que el endpoint y el body sean correctos.

---

**Resumen:**
- El backend solo envía notificaciones y emails, no gestiona claves ni suscripciones.
- El frontend obtiene el token FCM, registra el service worker y llama a los endpoints correctos.
- Consulta este archivo antes de implementar o depurar notificaciones.
# Configuración de Notificaciones - Instrucciones de Integración

## 1. Backend

- **Endpoints disponibles:**
  - `POST /api/push/send`  
    - Body: `{ token, title, body }`
    - Requiere autenticación (Bearer token)
  - `POST /api/email/send`  
    - Body: `{ to, subject, text }`
    - Requiere autenticación (Bearer token)

- **No existen** los endpoints `/api/push/public-key`, `/api/push/subscribe`, `/api/email/send-notification`.

- **Push:** El backend solo envía notificaciones a un token FCM válido. No gestiona suscripciones ni claves públicas.
- **Email:** El backend solo envía emails simples, no "notificaciones" personalizadas.

## 2. Frontend

### Notificaciones Push
1. Obtén el token FCM del usuario usando `subscribeUserToPush` (ya implementado en `utils/pushNotifications.js`).
2. Para enviar una notificación push, usa el servicio:
   ```js
   import { sendPush } from '../services/pushService';
   sendPush({ token, title, body });
   ```
3. El formulario debe pedir título y mensaje, y enviar el token FCM del usuario.

### Notificaciones Email
1. Para enviar un email, usa el servicio:
   ```js
   import { sendEmail } from '../services/emailService';
   sendEmail({ to, subject, text });
   ```
2. El formulario debe pedir destinatario, asunto y mensaje.

### Cambios necesarios
- No uses `/api/push/public-key`, `/api/push/subscribe` ni `/api/email/send-notification`.
- Usa los servicios `pushService.js` y `emailService.js` que ya están configurados para los endpoints correctos.

## 3. Ejemplo de flujo correcto

### Push
1. Usuario acepta notificaciones push → obtienes el token FCM.
2. Llamas a `sendPush({ token, title, body })` para enviar una notificación de prueba.

### Email
1. Usuario llena destinatario, asunto y mensaje.
2. Llamas a `sendEmail({ to, subject, text })`.

## 4. Troubleshooting
- Si recibes un error con `<!DOCTYPE ...` es porque llamaste un endpoint que no existe.
- Verifica que el endpoint y el body coincidan exactamente con la documentación.

---

**Resumen:**
- Usa solo `/api/push/send` y `/api/email/send`.
- Ajusta el frontend para enviar los datos correctos.
- Consulta este archivo antes de implementar nuevas notificaciones.
