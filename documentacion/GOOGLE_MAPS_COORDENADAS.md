# Integración de Google Maps y coordenadas geográficas

## Campos nuevos en la propiedad
- `lat` (float): Latitud de la propiedad.
- `lng` (float): Longitud de la propiedad.

Estos campos permiten ubicar la propiedad en Google Maps y deben ser proporcionados al crear o editar una propiedad.

## Uso en el frontend
- En la página de detalle de propiedad, si existen `lat` y `lng`, se muestra un botón para abrir la ubicación en Google Maps.
- Si no existen, se muestra una alerta indicando que no hay coordenadas registradas.

## Uso en el backend
- Los endpoints de creación y edición de propiedad aceptan y devuelven los campos `lat` y `lng`.
- El endpoint de detalle de propiedad también incluye estos campos en la respuesta.

## Ejemplo de request para crear propiedad
```json
{
  "title": "Apartamento en el centro",
  "price": 350000000,
  "address": "Calle 123 #45-67",
  "sellerId": 1,
  "lat": 4.710989,
  "lng": -74.072092
}
```

## Ejemplo de uso en Google Maps
```
https://maps.google.com/?q=<lat>,<lng>
```

## Recomendaciones
- Si no tienes las coordenadas, puedes obtenerlas usando Google Maps: haz clic derecho sobre la ubicación y selecciona "¿Qué hay aquí?" para copiar latitud y longitud.
