# Comparativa de Inputs: Frontend vs Backend

## Inputs enviados por el Frontend (CreatePropertyPage.js)
- title
- description
- price
- address
- city
- location
- state (opcional)
- postalCode (opcional)
- propertyType
- status
- features (objeto: furnished, petFriendly, elevator, balcony, garden, pool, gym, security, airConditioning, heating, internet, laundry, bedrooms, bathrooms, area, parkingSpaces)
- images (array de objetos: url, caption, isPrimary)
- sellerId
- contactInfo (phone, email, showPhone, showEmail) [solo frontend]

## Inputs que espera el Backend (Modelo y Controlador)
- title (obligatorio)
- description
- price (obligatorio)
- location
- address (obligatorio)
- type
- bedrooms
- bathrooms
- area
- parkingSpaces
- images
- sellerId (obligatorio)
- createdAt
- updatedAt

## Campos que el FRONT tiene y el BACK NO recibe/guarda
- city
- state
- postalCode
- propertyType (el back usa "type")
- status
- features (como objeto anidado, el back espera los campos planos)
- contactInfo (phone, email, showPhone, showEmail)

## Campos que el BACK espera y el FRONT NO envía
- type (el front envía propertyType, pero el back espera "type")
- createdAt (lo pone el back)
- updatedAt (lo pone el back)

## Campos que existen en ambos pero pueden quedar vacíos/NULL
- bedrooms
- bathrooms
- area
- parkingSpaces
- images

---

## Recomendaciones para integración completa
- El backend debe mapear propertyType → type.
- El backend debe extraer los campos de features y guardarlos como columnas planas (bedrooms, bathrooms, area, parkingSpaces, etc).
- Si se quiere guardar city, state, postalCode, status, agregar esos campos al modelo y migraciones.
- Para images, el backend debe aceptar el array y guardarlo en la columna JSON.
- Si se quiere guardar información de contacto, agregar columnas o tabla relacionada.

---

**Resumen:**
- El frontend envía más información de la que el backend guarda actualmente.
- Para evitar NULL, el backend debe extraer y mapear todos los campos del payload.
- Si algún campo es importante para el negocio, debe agregarse al modelo y controlador del backend.
# Especificación de Inputs del Formulario de Propiedad (Frontend)

Estos son los campos (inputs) que el frontend envía al backend al crear una propiedad. El backend debe aceptar y procesar todos estos campos para que la información se almacene correctamente y no queden valores en NULL.

## Campos principales enviados

- **title**: string (Título de la propiedad)
- **description**: string (Descripción de la propiedad)
- **price**: number (Precio)
- **address**: string (Dirección)
- **city**: string (Ciudad)
- **location**: string (Ubicación, puede ser texto o coordenadas)
- **state**: string (Departamento/estado, opcional)
- **postalCode**: string (Código postal, opcional)
- **propertyType**: string (Tipo de propiedad: apartment, house, etc)
- **status**: string (Estado, por defecto 'active')
- **features**: object (Características adicionales, ver detalle abajo)
- **images**: array de objetos { url, caption, isPrimary } (URLs de imágenes subidas a Cloudinary)
- **sellerId**: number (ID del usuario vendedor)

## Detalle de features (características adicionales)
- **furnished**: boolean
- **petFriendly**: boolean
- **elevator**: boolean
- **balcony**: boolean
- **garden**: boolean
- **pool**: boolean
- **gym**: boolean
- **security**: boolean
- **airConditioning**: boolean
- **heating**: boolean
- **internet**: boolean
- **laundry**: boolean
- **bedrooms**: number
- **bathrooms**: number
- **area**: number
- **parkingSpaces**: number

## Información de contacto (solo visible en frontend, pero puedes mapear si lo necesitas)
- **contactInfo.phone**: string
- **contactInfo.email**: string
- **contactInfo.showPhone**: boolean
- **contactInfo.showEmail**: boolean

---

**Nota:**
- Si algún campo no se está guardando en la base de datos, revisa que el backend lo reciba y lo procese correctamente en el controlador y modelo.
- Los campos que aparecen como NULL en la base de datos (como bedrooms, bathrooms, area, parkingSpaces, images) es porque el backend no los está extrayendo del objeto recibido o el modelo no los tiene definidos correctamente.
- Para imágenes, el frontend envía un array de objetos con url, caption e isPrimary. El backend debe mapear esto a la estructura de la base de datos.

---

**Ejemplo de payload enviado al backend:**

```json
{
  "title": "Apartamento moderno",
  "description": "Hermoso apartamento en el centro",
  "price": 100000000,
  "address": "Calle 123 #45-67",
  "city": "Bogotá",
  "location": "Bogotá, Colombia",
  "state": "Cundinamarca",
  "postalCode": "110111",
  "propertyType": "apartment",
  "status": "active",
  "features": {
    "furnished": true,
    "petFriendly": false,
    "elevator": true,
    "balcony": true,
    "garden": false,
    "pool": true,
    "gym": true,
    "security": true,
    "airConditioning": false,
    "heating": false,
    "internet": true,
    "laundry": true,
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 80,
    "parkingSpaces": 1
  },
  "images": [
    { "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg", "caption": "Fachada", "isPrimary": true }
  ],
  "sellerId": 2
}
```

---

**Checklist para el backend:**
- [ ] Recibir y mapear todos los campos anteriores.
- [ ] Guardar correctamente los campos numéricos y booleanos (no como NULL).
- [ ] Procesar el array de imágenes.
- [ ] Validar sellerId y asociar con el usuario vendedor.
- [ ] Permitir campos opcionales (state, postalCode, location).
