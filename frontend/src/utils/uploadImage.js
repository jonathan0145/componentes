// src/utils/uploadImage.js
export async function uploadImageToCloudinary(file) {
  const url = 'https://api.cloudinary.com/v1_1/dv8cyp6p4/image/upload'; // tu cloud_name
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'inmotech'); // tu upload_preset

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  return data.secure_url;
}
