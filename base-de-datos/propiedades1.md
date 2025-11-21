# Subida de Imágenes y Creación de Propiedades según Documentación

## 1. Flujo recomendado para crear una propiedad

### a) Subida de imágenes (Frontend)
1. El usuario selecciona imágenes en el formulario.
2. Cada imagen se sube a un servicio externo (ejemplo: Cloudinary) usando una función como:

```js
export async function uploadImageToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/<tu_cloud_name>/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', '<tu_upload_preset>');

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  return data.secure_url; // URL de la imagen subida
}
```

3. Se obtienen las URLs de todas las imágenes subidas.

### b) Envío de datos al backend
- Se arma el objeto para el endpoint `/properties` así:

```js
const dataToSend = {
  title: formData.title,
  description: formData.description,
  price: Number(formData.price),
  address: formData.address,
  city: formData.city,
  state: formData.state || '',
  postalCode: formData.postalCode || '',
  propertyType: formData.propertyType,
  status: 'active',
  features: {
    bedrooms: Number(formData.bedrooms),
    bathrooms: Number(formData.bathrooms),
    area: Number(formData.area),
    parking: formData.features?.parkingSpaces > 0,
    garden: !!formData.features?.garden,
    // Agrega más features según tu formulario
  },
  images: urls.map((url, idx) => ({
    url,
    caption: '',
    isPrimary: idx === 0
  }))
};
```
- **No se envía `sellerId`**. El backend lo toma del usuario autenticado.
- El campo `images` es un array de objetos con URLs, no archivos ni base64.

### c) Ejemplo de integración en el submit

```js
setLoading(true);
try {
  // Subir imágenes a Cloudinary
  const urls = [];
  for (const file of imageFiles) {
    const url = await uploadImageToCloudinary(file);
    urls.push(url);
  }

  // Armar el array de imágenes para la API
  const images = urls.map((url, idx) => ({
    url,
    caption: '',
    isPrimary: idx === 0
  }));

  const dataToSend = { ...otrosCampos, images };
  await propertiesService.createProperty(dataToSend);
  toast.success('Propiedad publicada exitosamente');
  navigate('/properties');
} catch (error) {
  toast.error('Error al publicar la propiedad');
} finally {
  setLoading(false);
}
```

---

## 2. Resumen de buenas prácticas
- Sube imágenes a un servicio externo y usa solo URLs en el backend.
- No envíes sellerId, el backend lo toma del usuario autenticado.
- Envía solo los campos que la documentación oficial indica.
- Muestra feedback al usuario en cada paso.

---

¿Necesitas ejemplo para otro servicio de imágenes? ¿O integración con otro backend?