# Checklist de Servicios REST a Conectar (Frontend ↔ Backend)

Este archivo detalla los servicios/documentos REST que deben estar conectados entre el frontend y el backend según la documentación, estructura de carpetas y casos de uso del proyecto.

## Servicios ya conectados
- [x] Autenticación: Login (`/auth/login`)
- [x] Registro de usuario (`/auth/register`)

## Servicios REST pendientes de conectar

### Usuarios
- [] Obtener perfil de usuario (`GET /users/profile`)
- [] Actualizar perfil de usuario (`PUT /users/profile`)
- [] Subir avatar de usuario (`POST /users/avatar`)

### Propiedades
- [ ] Listar propiedades (`GET /properties`)
- [ ] Crear propiedad (`POST /properties`)
- [ ] Obtener detalle de propiedad (`GET /properties/:id`)
- [ ] Actualizar propiedad (`PUT /properties/:id`)
- [ ] Eliminar propiedad (`DELETE /properties/:id`)

### Ofertas
- [ ] Crear oferta (`POST /offers`)
- [ ] Listar ofertas del usuario (`GET /offers`)
- [ ] Responder oferta (aceptar/rechazar/contraoferta) (`PUT /offers/:id`)

### Chats y Mensajes
- [ ] Listar conversaciones (`GET /conversations`)
- [ ] Crear conversación (`POST /conversations`)
- [ ] Listar mensajes de una conversación (`GET /messages?conversationId=...`)
- [ ] Enviar mensaje (`POST /messages`)

### Notificaciones
- [ ] Listar notificaciones (`GET /notifications`)
- [ ] Marcar notificación como leída (`PUT /notifications/:id`)

### Citas/Visitas
- [ ] Listar citas (`GET /appointments`)
- [ ] Crear cita (`POST /appointments`)
- [ ] Actualizar cita (`PUT /appointments/:id`)
- [ ] Cancelar cita (`DELETE /appointments/:id`)

### Verificación de usuario
- [ ] Solicitar verificación (email/teléfono/documentos) (`POST /verifications`)
- [ ] Consultar estado de verificación (`GET /verifications`)

### Roles y Permisos
- [ ] Listar roles (`GET /roles`)
- [ ] Listar permisos (`GET /permissions`)

### Archivos
- [ ] Subir archivo (`POST /files`)
- [ ] Descargar archivo (`GET /files/:id`)

### Otros (según casos de uso)
- [ ] Historial de precios (`GET /pricehistories`)
- [ ] Servicios de email (`POST /email`)

---

## Recomendaciones
- Revisa que cada servicio tenga su respectivo archivo en `src/services/` del frontend y que use el endpoint correcto del backend.
- Asegúrate de que los slices de Redux y los componentes llamen a estos servicios y gestionen el estado y errores correctamente.
- Marca cada ítem como completado `[x]` conforme vayas conectando y probando cada flujo.

---

**Actualiza este checklist conforme avances en la integración.**
