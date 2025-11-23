import React, { useState, useRef } from 'react';
import { Modal, Button, Alert, ProgressBar, ListGroup, Badge } from 'react-bootstrap';
import { FaUpload, FaTimes, FaCheck, FaFileAlt } from 'react-icons/fa';
import fileService from '@services/fileService';

const FileUploadModal = ({ show, onHide, onFileUploaded, conversationId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setError('');
    
    try {
      const validFiles = files.map(file => {
        fileService.validateFile(file);
        return {
          file,
          id: Date.now() + Math.random(),
          preview: null,
          uploaded: false
        };
      });

      setSelectedFiles(prev => [...prev, ...validFiles]);

      // Generar previews para archivos de imagen
      validFiles.forEach(async (fileObj) => {
        if (fileObj.file.type.startsWith('image/')) {
          try {
            const preview = await fileService.getFilePreview(fileObj.file);
            setSelectedFiles(prev => 
              prev.map(f => f.id === fileObj.id ? { ...f, preview } : f)
            );
          } catch (err) {
            console.error('Error generating preview:', err);
          }
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError('');

    try {
      for (const fileObj of selectedFiles) {
        if (fileObj.uploaded) continue;

        setUploadProgress(prev => ({ ...prev, [fileObj.id]: 0 }));

        // Simular progreso para demo (en producción sería real)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileObj.id] || 0;
            if (currentProgress < 90) {
              return { ...prev, [fileObj.id]: currentProgress + 10 };
            } else {
              clearInterval(progressInterval);
              return prev;
            }
          });
        }, 200);

        try {
          // Aquí sería la llamada real al servicio
          // const result = await fileService.uploadFile(fileObj.file, conversationId);
          
          // Simular subida exitosa después de 2 segundos
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [fileObj.id]: 100 }));
          
          // Marcar como subido
          setSelectedFiles(prev => 
            prev.map(f => f.id === fileObj.id ? { ...f, uploaded: true } : f)
          );

          // Notificar al componente padre
          const fileData = {
            id: fileObj.id,
            name: fileObj.file.name,
            size: fileObj.file.size,
            type: fileObj.file.type,
            url: URL.createObjectURL(fileObj.file), // En producción sería la URL del servidor
            preview: fileObj.preview
          };
          
          onFileUploaded(fileData);
        } catch (uploadError) {
          clearInterval(progressInterval);
          setError(`Error subiendo ${fileObj.file.name}: ${uploadError.message}`);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFiles([]);
      setUploadProgress({});
      setError('');
      onHide();
    }
  };

  const allFilesUploaded = selectedFiles.length > 0 && 
    selectedFiles.every(f => f.uploaded);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaUpload className="me-2" />
          Compartir Archivos
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {/* Área de selección de archivos */}
        <div 
          className="border-2 border-dashed border-primary rounded p-4 text-center mb-3"
          style={{ backgroundColor: '#f8f9fa' }}
        >
          <FaFileAlt size={48} className="text-muted mb-2" />
          <p className="mb-2">
            Arrastra archivos aquí o{' '}
            <Button 
              variant="link" 
              className="p-0 text-decoration-none"
              onClick={() => fileInputRef.current?.click()}
            >
              selecciona archivos
            </Button>
          </p>
          <small className="text-muted">
            Formatos soportados: JPG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, TXT
            <br />
            Tamaño máximo: 10MB por archivo
          </small>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {/* Lista de archivos seleccionados */}
        {selectedFiles.length > 0 && (
          <div>
            <h6>Archivos seleccionados:</h6>
            <ListGroup>
              {selectedFiles.map((fileObj) => (
                <ListGroup.Item 
                  key={fileObj.id} 
                  className="d-flex align-items-center"
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    {/* Preview o icono */}
                    <div className="me-3">
                      {fileObj.preview && fileObj.file.type.startsWith('image/') ? (
                        <img 
                          src={fileObj.preview} 
                          alt="Preview" 
                          style={{ width: 40, height: 40, objectFit: 'cover' }}
                          className="rounded"
                        />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center rounded"
                          style={{ 
                            width: 40, 
                            height: 40, 
                            backgroundColor: '#e9ecef',
                            fontSize: '20px'
                          }}
                        >
                          {fileService.getFileIcon(fileObj.file.type)}
                        </div>
                      )}
                    </div>

                    {/* Información del archivo */}
                    <div className="flex-grow-1">
                      <div className="fw-bold">{fileObj.file.name}</div>
                      <small className="text-muted">
                        {fileService.formatFileSize(fileObj.file.size)}
                      </small>
                      
                      {/* Barra de progreso */}
                      {uploadProgress[fileObj.id] !== undefined && (
                        <ProgressBar 
                          now={uploadProgress[fileObj.id]} 
                          size="sm" 
                          className="mt-1"
                          variant={fileObj.uploaded ? "success" : "primary"}
                        />
                      )}
                    </div>

                    {/* Estado y acciones */}
                    <div className="ms-2">
                      {fileObj.uploaded ? (
                        <Badge bg="success">
                          <FaCheck /> Subido
                        </Badge>
                      ) : (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFile(fileObj.id)}
                          disabled={uploading}
                        >
                          <FaTimes />
                        </Button>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={handleClose}
          disabled={uploading}
        >
          {allFilesUploaded ? 'Cerrar' : 'Cancelar'}
        </Button>
        
        {selectedFiles.length > 0 && !allFilesUploaded && (
          <Button 
            variant="primary" 
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
          >
            {uploading ? 'Subiendo...' : `Subir ${selectedFiles.length} archivo(s)`}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default FileUploadModal;