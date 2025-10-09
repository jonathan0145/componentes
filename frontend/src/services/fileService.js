import apiClient from './apiClient';

class FileService {
  async uploadFile(file, conversationId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);

      const response = await apiClient.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // Emitir evento de progreso si es necesario
          window.dispatchEvent(new CustomEvent('fileUploadProgress', {
            detail: { progress, fileName: file.name }
          }));
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      const response = await apiClient.delete(`/api/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async downloadFile(fileId, fileName) {
    try {
      const response = await apiClient.get(`/api/files/${fileId}/download`, {
        responseType: 'blob',
      });

      // Crear URL para descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  // Validar archivo antes de subir
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo 10MB permitido.');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes, PDF y documentos de Office.');
    }

    return true;
  }

  // Obtener preview del archivo
  getFilePreview(file) {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } else {
        // Para archivos no imagen, retornar información básica
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          isImage: false
        });
      }
    });
  }

  // Formatear tamaño de archivo
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Obtener icono según tipo de archivo
  getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    if (fileType === 'text/plain') return '📄';
    return '📎';
  }
}

const fileService = new FileService();
export default fileService;