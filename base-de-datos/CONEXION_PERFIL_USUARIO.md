# Guía de Conexión Frontend ↔ Backend: Perfil de Usuario

Esta guía explica cómo conectar el frontend y backend para los endpoints de usuario según la documentación oficial del proyecto. Incluye ejemplos de código y validaciones para asegurar que los campos y respuestas cumplen con el estándar.

---

## Endpoints a Conectar

- **Obtener perfil de usuario:** `GET /users/profile`
- **Actualizar perfil de usuario:** `PUT /users/profile`
- **Subir avatar de usuario:** `POST /users/avatar`

---

## 1. Estructura esperada según la documentación

### Respuesta estándar de perfil (`GET` y `PUT`)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@email.com",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "role": "buyer|seller|agent",
    "phone": "+1234567890",
    "avatarUrl": "https://...",
    "isVerified": true,
    "preferences": { ... },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "...",
  "timestamp": "..."
}
```

### Respuesta estándar de subir avatar
```json
{
  "success": true,
  "data": {
    "avatarUrl": "/uploads/archivo.png"
  },
  "message": "Avatar subido correctamente",
  "timestamp": "..."
}
```

---

## 2. Backend: Controladores y Modelos

- El backend debe:
  - Extraer los datos de perfil del modelo `Profile` y devolverlos en la raíz de `data`.
  - Aceptar y actualizar los campos: `firstName`, `lastName`, `phone`, `preferences`.
  - Para el avatar, guardar la ruta y devolverla como `avatarUrl`.
- Ejemplo de respuesta implementada:
  - Verifica que los controladores (`getProfile`, `updateProfile`, `uploadAvatar`) devuelven exactamente la estructura de la documentación.

---

## 3. Frontend: Servicios y Consumo

### Servicio de perfil (`src/services/authService.js`)
```js
// Obtener perfil
getProfile: async () => {
  return await apiClient.get('/users/profile');
},
// Actualizar perfil
updateProfile: async (profileData) => {
  return await apiClient.put('/users/profile', profileData);
},
// Subir avatar
uploadAvatar: async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return await apiClient.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
},
```

### Redux Slice (`src/store/slices/authSlice.js`)
- El thunk `updateProfile` debe usar `action.payload.data` para actualizar el usuario:
```js
.addCase(updateProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.user = { ...state.user, ...action.payload.data };
  toast.success('Perfil actualizado correctamente');
})
```

### Componente de perfil (`src/pages/profile/ProfilePage.js`)
- Los campos del formulario deben mapearse a los nombres esperados (`firstName`, `lastName`, `phone`, `preferences`).
- Al mostrar datos, usar siempre los campos planos de `currentUser`.

---

## 4. Validaciones y pruebas
- Verifica que:
  - El backend responde con la estructura y campos correctos.
  - El frontend consume y actualiza el estado correctamente.
  - El avatar se sube y la URL se refleja en el perfil.
- Usa herramientas como Postman o la consola de red del navegador para validar las respuestas.

---

## 5. Ejemplo de flujo E2E
1. Registrar usuario y loguearse.
2. Llamar a `GET /users/profile` y mostrar los datos en la UI.
3. Editar datos y enviar a `PUT /users/profile`, verificar que la UI se actualiza.
4. Subir avatar con `POST /users/avatar` y mostrar la imagen en el perfil.

---

**Cumpliendo estos pasos y validaciones, la integración estará alineada con la documentación oficial.**
