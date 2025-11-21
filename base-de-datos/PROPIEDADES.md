# Integración de Servicios REST: Propiedades

Este documento describe los pasos y recomendaciones para conectar el frontend y backend en los servicios REST relacionados con propiedades.

## Endpoints a conectar

- **Listar propiedades**: `GET /properties`
- **Crear propiedad**: `POST /properties`
- **Obtener detalle de propiedad**: `GET /properties/:id`
- **Actualizar propiedad**: `PUT /properties/:id`
- **Eliminar propiedad**: `DELETE /properties/:id`

---

## 1. Backend

- Verifica que los endpoints estén implementados en el backend y respondan correctamente según la documentación.
- Cada endpoint debe validar los datos recibidos y devolver respuestas claras (éxito/error).
- Asegúrate de que los controladores de propiedades estén en `src/controllers/propertyController.js` (o similar) y las rutas en `src/routes/propertyRoutes.js`.
- Los endpoints deben estar agrupados bajo `/api/v1/properties` en el backend.

## 2. Frontend

- Crea o revisa el archivo `src/services/propertiesService.js` para implementar las funciones:
  - `getProperties()` → `GET /properties`
  - `createProperty(data)` → `POST /properties`
  - `getPropertyById(id)` → `GET /properties/:id`
  - `updateProperty(id, data)` → `PUT /properties/:id`
  - `deleteProperty(id)` → `DELETE /properties/:id`
- Usa estas funciones en los componentes de React correspondientes:
  - Listado: `PropertiesPage.js`
  - Detalle: `PropertyDetailPage.js`
  - Crear/Editar: `CreatePropertyPage.js`, `PropertiesPage.js`
- Asegúrate de manejar el estado y los errores usando Redux o useState/useEffect según tu arquitectura.
- Muestra mensajes de éxito/error al usuario usando `react-toastify` o alertas.

## 3. Flujo recomendado

1. **Listar propiedades**: Al cargar la página de propiedades, llama a `getProperties()` y muestra el listado.
2. **Crear propiedad**: Al enviar el formulario de creación, llama a `createProperty(data)` y muestra feedback.
3. **Detalle de propiedad**: Al entrar a la página de detalle, llama a `getPropertyById(id)`.
4. **Actualizar propiedad**: Al editar, llama a `updateProperty(id, data)` y actualiza la vista.
5. **Eliminar propiedad**: Al eliminar, llama a `deleteProperty(id)` y actualiza el listado.

## 4. Checklist de integración

- [ ] Endpoints del backend probados con Postman o similar.
- [ ] Servicios en `src/services/propertiesService.js` implementados y probados.
- [ ] Componentes de frontend conectados a los servicios.
- [ ] Manejo de errores y feedback al usuario.
- [ ] Pruebas de flujo completo (crear, listar, ver, editar, eliminar).

---

**Actualiza este archivo conforme avances en la integración y marca cada paso completado.**
