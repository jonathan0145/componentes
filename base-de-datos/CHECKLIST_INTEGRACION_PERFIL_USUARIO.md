# Checklist de Integración de Perfil de Usuario (Frontend ↔ Backend)

Este archivo te guía paso a paso para conectar y probar los servicios REST relacionados con el perfil de usuario, de acuerdo con la documentación y el checklist oficial.

## Endpoints a conectar
- [ ] Obtener perfil de usuario (`GET /users/profile`)
- [ ] Actualizar perfil de usuario (`PUT /users/profile`)
- [ ] Subir avatar de usuario (`POST /users/avatar`)

---

## Pasos recomendados

### 1. Obtener perfil de usuario (`GET /users/profile`)
- [ ] Verifica que el endpoint existe y responde correctamente en el backend.
- [ ] Crea o revisa el método correspondiente en `src/services/authService.js` o `userService.js` del frontend.
- [ ] Asegúrate de que el slice de Redux (por ejemplo, `authSlice.js`) tenga un thunk para obtener el perfil y lo almacene en el estado global.
- [ ] En el componente de perfil (`ProfilePage.js`), usa el estado global para mostrar los datos del usuario.
- [ ] Prueba el flujo: al iniciar sesión, el perfil debe mostrar los datos reales del usuario.

### 2. Actualizar perfil de usuario (`PUT /users/profile`)
- [ ] Verifica que el endpoint existe y actualiza correctamente los datos en el backend.
- [ ] Crea o revisa el método correspondiente en el servicio del frontend.
- [ ] Asegúrate de que el slice de Redux tenga un thunk para actualizar el perfil y sincronizar el estado global tras la actualización.
- [ ] Implementa el formulario de edición en el frontend y conecta el submit al servicio.
- [ ] Prueba el flujo: al editar y guardar, los cambios deben verse reflejados en la UI y en la base de datos.

### 3. Subir avatar de usuario (`POST /users/avatar`)
- [ ] Verifica que el endpoint existe y guarda correctamente el archivo en el backend.
- [ ] Crea o revisa el método correspondiente en el servicio del frontend (usando `FormData`).
- [ ] Asegúrate de que el slice de Redux tenga un thunk para subir el avatar y actualizar el estado global con la nueva URL.
- [ ] Implementa el input de archivo en el frontend y conecta el submit al servicio.
- [ ] Prueba el flujo: al subir un avatar, la imagen debe actualizarse en la UI y en la base de datos.

---

## Consejos adicionales
- Usa Swagger UI para probar los endpoints antes de conectar el frontend.
- Marca cada paso como completado `[x]` conforme avances.
- Si algún flujo no funciona, revisa la consola del navegador y los logs del backend para depurar.
- Actualiza el checklist oficial (`CHECKLIST_SERVICIOS_REST.md`) conforme completes cada integración.

---

**Actualiza este archivo conforme avances y documenta cualquier ajuste necesario para tu equipo.**
