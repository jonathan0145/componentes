# Especificación de Configuración de Privacidad

## 1. Modelo de Base de Datos

Se recomienda agregar los siguientes campos al modelo `Profile` (o `User` si prefieres):

- `showContactInfo` (boolean, default: true): Permitir que otros usuarios vean mi información de contacto.
- `receiveEmailNotifications` (boolean, default: true): Recibir notificaciones por email.

**Ejemplo de migración Sequelize:**
```js
showContactInfo: {
  type: Sequelize.BOOLEAN,
  allowNull: false,
  defaultValue: true
},
receiveEmailNotifications: {
  type: Sequelize.BOOLEAN,
  allowNull: false,
  defaultValue: true
}
```

## 2. Backend (API)

### Endpoints sugeridos

- `GET /api/v1/user/privacy`  
  Devuelve la configuración de privacidad del usuario autenticado.
- `PUT /api/v1/user/privacy`  
  Actualiza la configuración de privacidad del usuario autenticado.

### Ejemplo de respuesta
```json
{
  "showContactInfo": true,
  "receiveEmailNotifications": false
}
```

### Ejemplo de payload para actualización
```json
{
  "showContactInfo": false,
  "receiveEmailNotifications": true
}
```

## 3. Frontend

- El frontend debe mostrar los valores actuales de privacidad al cargar la página.
- Al cambiar un checkbox, debe enviar un `PUT` al endpoint para guardar los cambios.
- Al recargar, debe reflejar el estado real de la base de datos.

### Estado en Redux (ejemplo)
```js
privacy: {
  showContactInfo: true,
  receiveEmailNotifications: true,
  loading: false,
  error: null
}
```

### Flujo recomendado
1. Al cargar la página de privacidad, hacer `GET /api/v1/user/privacy` y poblar el estado.
2. Al cambiar un valor, hacer `PUT /api/v1/user/privacy` y actualizar el estado en Redux.

---

**Esta especificación debe ser implementada en:**
- Migraciones y modelo de base de datos.
- Controladores y rutas backend.
- Servicios, slices y componentes frontend.

> Si necesitas ejemplos de código para cada parte, pídelo y te los genero.
