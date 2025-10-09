import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { FaHome, FaUpload, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    city: '',
    address: '',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    parkingSpaces: 0,
    floor: '',
    totalFloors: '',
    yearBuilt: '',
    features: {
      furnished: false,
      petFriendly: false,
      elevator: false,
      balcony: false,
      garden: false,
      pool: false,
      gym: false,
      security: false,
      airConditioning: false,
      heating: false,
      internet: false,
      laundry: false
    },
    images: [],
    contactInfo: {
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      showPhone: true,
      showEmail: true
    }
  });

  const [validated, setValidated] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  // Verificar que el usuario sea vendedor
  if (currentUser?.role !== 'seller') {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h5>Acceso Restringido</h5>
          <p>Solo los vendedores pueden publicar propiedades.</p>
          <Button variant="primary" onClick={() => navigate('/properties')}>
            Ver Propiedades
          </Button>
        </Alert>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFeatureChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 10) {
      toast.error('Máximo 10 imágenes permitidas');
      return;
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Solo se permiten archivos de imagen (JPG, PNG, WebP)');
      return;
    }

    // Validar tamaño (máximo 5MB por imagen)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Cada imagen debe ser menor a 5MB');
      return;
    }

    setImageFiles(prev => [...prev, ...files]);

    // Crear URLs de preview
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Debes subir al menos una imagen');
      return;
    }

    setLoading(true);

    try {
      // Aquí iría la llamada a la API para crear la propiedad
      // const formDataToSend = new FormData();
      // Object.keys(formData).forEach(key => {
      //   if (key === 'images') return;
      //   if (typeof formData[key] === 'object') {
      //     formDataToSend.append(key, JSON.stringify(formData[key]));
      //   } else {
      //     formDataToSend.append(key, formData[key]);
      //   }
      // });
      
      // imageFiles.forEach((file, index) => {
      //   formDataToSend.append(`images`, file);
      // });

      // await dispatch(createProperty(formDataToSend)).unwrap();

      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Propiedad publicada exitosamente');
      navigate('/properties');
    } catch (error) {
      toast.error('Error al publicar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const propertyTypes = [
    { value: 'apartment', label: 'Apartamento' },
    { value: 'house', label: 'Casa' },
    { value: 'condo', label: 'Condominio' },
    { value: 'office', label: 'Oficina' },
    { value: 'land', label: 'Terreno' },
    { value: 'warehouse', label: 'Bodega' },
    { value: 'commercial', label: 'Local Comercial' }
  ];

  const features = [
    { key: 'furnished', label: 'Amoblado' },
    { key: 'petFriendly', label: 'Acepta Mascotas' },
    { key: 'elevator', label: 'Ascensor' },
    { key: 'balcony', label: 'Balcón' },
    { key: 'garden', label: 'Jardín' },
    { key: 'pool', label: 'Piscina' },
    { key: 'gym', label: 'Gimnasio' },
    { key: 'security', label: 'Seguridad 24h' },
    { key: 'airConditioning', label: 'Aire Acondicionado' },
    { key: 'heating', label: 'Calefacción' },
    { key: 'internet', label: 'Internet Incluido' },
    { key: 'laundry', label: 'Lavandería' }
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>
                <FaHome className="me-2 text-primary" />
                Publicar Nueva Propiedad
              </h2>
              <p className="text-muted">Completa todos los campos para publicar tu propiedad</p>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowPreview(true)}
                disabled={!formData.title}
              >
                <FaEye className="me-1" />
                Vista Previa
              </Button>
              <Button variant="outline-primary" onClick={() => navigate('/properties')}>
                Cancelar
              </Button>
            </div>
          </div>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Información Básica */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Información Básica</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Título de la Propiedad *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ej: Apartamento moderno en zona norte"
                        required
                        maxLength={100}
                      />
                      <Form.Control.Feedback type="invalid">
                        El título es requerido.
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        {formData.title.length}/100 caracteres
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Propiedad *</Form.Label>
                      <Form.Select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        required
                      >
                        {propertyTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe las características principales de tu propiedad..."
                    required
                    maxLength={1000}
                  />
                  <Form.Control.Feedback type="invalid">
                    La descripción es requerida.
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {formData.description.length}/1000 caracteres
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio *</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Ej: 350000000"
                        required
                        min="1"
                      />
                      <Form.Control.Feedback type="invalid">
                        El precio es requerido y debe ser mayor a 0.
                      </Form.Control.Feedback>
                      {formData.price && (
                        <Form.Text className="text-success">
                          {formatPrice(formData.price)}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Área (m²) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="Ej: 85"
                        required
                        min="1"
                      />
                      <Form.Control.Feedback type="invalid">
                        El área es requerida.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Ubicación */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Ubicación</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ciudad *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Ej: Bogotá"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        La ciudad es requerida.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Zona/Barrio *</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ej: Zona Norte, Chapinero"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        La zona es requerida.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección Completa</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ej: Carrera 15 # 85-32"
                  />
                  <Form.Text className="text-muted">
                    La dirección exacta no será mostrada públicamente
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Características */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Características</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {formData.propertyType !== 'land' && (
                    <>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Habitaciones</Form.Label>
                          <Form.Select
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                          >
                            <option value="0">0 (Estudio)</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5+</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Baños</Form.Label>
                          <Form.Select
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4+</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </>
                  )}
                  
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Parqueaderos</Form.Label>
                      <Form.Select
                        name="parkingSpaces"
                        value={formData.parkingSpaces}
                        onChange={handleChange}
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3+</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {formData.propertyType === 'apartment' && (
                    <>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Piso</Form.Label>
                          <Form.Control
                            type="number"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            placeholder="Ej: 5"
                            min="0"
                          />
                        </Form.Group>
                      </Col>
                    </>
                  )}
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Año de Construcción</Form.Label>
                      <Form.Control
                        type="number"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleChange}
                        placeholder="Ej: 2020"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Características adicionales */}
                <div className="mb-3">
                  <Form.Label className="mb-3">Características Adicionales</Form.Label>
                  <Row>
                    {features.map(feature => (
                      <Col md={4} sm={6} key={feature.key} className="mb-2">
                        <Form.Check
                          type="checkbox"
                          id={feature.key}
                          label={feature.label}
                          checked={formData.features[feature.key]}
                          onChange={() => handleFeatureChange(feature.key)}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              </Card.Body>
            </Card>

            {/* Imágenes */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Imágenes *</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Subir Imágenes</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-2"
                  />
                  <Form.Text className="text-muted">
                    Máximo 10 imágenes. Formatos: JPG, PNG, WebP. Tamaño máximo: 5MB por imagen.
                  </Form.Text>
                </Form.Group>

                {formData.images.length > 0 && (
                  <Row>
                    {formData.images.map((image, index) => (
                      <Col md={3} sm={4} key={index} className="mb-3">
                        <div className="position-relative">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="img-fluid rounded"
                            style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(index)}
                          >
                            <FaTrash size={12} />
                          </Button>
                          {index === 0 && (
                            <div className="position-absolute bottom-0 start-0 m-1">
                              <span className="badge bg-primary">Principal</span>
                            </div>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>

            {/* Información de Contacto */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Información de Contacto</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="contactInfo.phone"
                        value={formData.contactInfo.phone}
                        onChange={handleChange}
                        placeholder="+57 300 123 4567"
                      />
                    </Form.Group>
                    <Form.Check
                      type="checkbox"
                      id="showPhone"
                      name="contactInfo.showPhone"
                      label="Mostrar teléfono en el anuncio"
                      checked={formData.contactInfo.showPhone}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="contactInfo.email"
                        value={formData.contactInfo.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                      />
                    </Form.Group>
                    <Form.Check
                      type="checkbox"
                      id="showEmail"
                      name="contactInfo.showEmail"
                      label="Mostrar email en el anuncio"
                      checked={formData.contactInfo.showEmail}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Botones de acción */}
            <div className="d-flex justify-content-between align-items-center">
              <Button variant="outline-secondary" onClick={() => navigate('/properties')}>
                Cancelar
              </Button>
              
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowPreview(true)}
                  disabled={!formData.title}
                >
                  <FaEye className="me-1" />
                  Vista Previa
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <FaUpload className="me-1" />
                      Publicar Propiedad
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </Col>
      </Row>

      {/* Modal de Vista Previa */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Vista Previa de la Propiedad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData.images.length > 0 && (
            <img
              src={formData.images[0]}
              alt="Preview"
              className="img-fluid rounded mb-3"
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
          )}
          <h4>{formData.title}</h4>
          <p className="text-muted">{formData.location}, {formData.city}</p>
          <h5 className="text-success">{formatPrice(formData.price)}</h5>
          
          <div className="d-flex gap-3 mb-3">
            {formData.propertyType !== 'land' && formData.bedrooms > 0 && (
              <span><strong>{formData.bedrooms}</strong> habitaciones</span>
            )}
            <span><strong>{formData.bathrooms}</strong> baños</span>
            <span><strong>{formData.area}</strong> m²</span>
            {formData.parkingSpaces > 0 && (
              <span><strong>{formData.parkingSpaces}</strong> parqueaderos</span>
            )}
          </div>
          
          <p>{formData.description}</p>
          
          {Object.values(formData.features).some(Boolean) && (
            <div>
              <h6>Características:</h6>
              <ul>
                {features.filter(f => formData.features[f.key]).map(feature => (
                  <li key={feature.key}>{feature.label}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreatePropertyPage;