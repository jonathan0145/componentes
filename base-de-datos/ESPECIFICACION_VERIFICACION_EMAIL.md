# Especificación Técnica: Verificación de Email

## Objetivo
Implementar el flujo completo de verificación de email para usuarios, permitiendo enviar un código de verificación al correo y confirmar dicho código para marcar el email como verificado.

---

## 1. Endpoint: Enviar código de verificación
- **Ruta:** `POST /api/verifications/email/send`
- **Body:**
  ```json
  {
    "email": "usuario@email.com"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "message": "Código de verificación enviado al email"
  }
  ```
- **Errores posibles:**
  - Email no registrado
  - Error al enviar email

---

## 2. Endpoint: Confirmar código de verificación
- **Ruta:** `POST /api/verifications/email/confirm`
- **Body:**
  ```json
  {
    "email": "usuario@email.com",
    "code": "123456"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "message": "Email verificado correctamente"
  }
  ```
- **Errores posibles:**
  - Código incorrecto o expirado
  - Email no registrado

---

## 3. Lógica de backend
- Al enviar el código:
  - Generar un código aleatorio de 6 dígitos.
  - Guardar el código temporalmente (en la base de datos o en memoria, asociado al usuario/email).
  - Enviar el código al email del usuario.
- Al confirmar el código:
  - Verificar que el código recibido coincida con el guardado y no esté expirado.
  - Si es correcto, marcar el email como verificado en la base de datos.

---

## 4. Cambios en la base de datos
- Añadir campos a la tabla de usuarios o verificaciones:
  - `emailVerificationCode` (opcional, si se guarda en la tabla de usuarios)
  - `emailVerified` (booleano)
  - `emailVerificationExpires` (opcional, timestamp de expiración)

---

## 5. Cambios en frontend
- Mostrar estado de verificación de email.
- Permitir enviar código y confirmar código.
- Mostrar mensajes de éxito/error según respuesta del backend.

---

## 6. Pruebas
- Probar envío de código a un email válido.
- Probar confirmación con código correcto e incorrecto.
- Probar expiración del código.

---

## 7. Seguridad
- Limitar intentos de verificación.
- Expirar el código después de X minutos.
- No exponer el código en logs ni respuestas.

---

## 8. Documentación
- Documentar los endpoints en Swagger/OpenAPI y en el README de la API.

---

> **Notas:**
> - Este flujo puede adaptarse para otros tipos de verificación (teléfono, identidad, etc.)
> - Se recomienda usar un servicio de email transaccional (SendGrid, Mailgun, etc.) para el envío de correos.
