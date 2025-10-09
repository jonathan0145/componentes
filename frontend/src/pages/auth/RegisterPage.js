import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaUserPlus, FaEnvelope, FaLock, FaUser, FaPhone } from 'react-icons/fa';

import { registerUser } from '@store/slices/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    // Campos específicos por rol
    preferences: {
      location: '',
      priceRange: { min: '', max: '' },
      propertyType: ''
    },
    professional: {
      licenseNumber: '',
      agency: '',
      experience: '',
      specialization: '',
      coverageArea: ''
    }
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value,
      }
    }));
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        priceRange: {
          ...prev.preferences.priceRange,
          [name]: value,
        }
      }
    }));
  };

  const handleProfessionalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        [name]: value,
      }
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

    if (formData.password !== formData.confirmPassword) {
      setValidated(true);
      return;
    }

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      };

      // Agregar campos específicos según el rol
      if (formData.role === 'buyer') {
        userData.preferences = formData.preferences;
      } else if (formData.role === 'agent') {
        userData.professional = formData.professional;
      }

      await dispatch(registerUser(userData)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      // Error ya manejado en el slice
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light py-4">
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <FaUserPlus className="text-white" size={24} />
                </div>
                <h2 className="fw-bold text-dark">Crear cuenta</h2>
                <p className="text-muted">Únete a la plataforma InmoTech</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaUser className="me-2" />
                        Nombre
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        El nombre es requerido.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Tu apellido"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        El apellido es requerido.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaEnvelope className="me-2" />
                    Correo electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Por favor ingresa un correo electrónico válido.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaPhone className="me-2" />
                    Teléfono
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+57 300 123 4567"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipo de usuario</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="buyer">Comprador</option>
                    <option value="seller">Vendedor</option>
                    <option value="agent">Intermediario/Agente</option>
                  </Form.Select>
                </Form.Group>

                {/* Campos específicos por rol */}
                {formData.role === 'buyer' && (
                  <div className="mb-3 p-3 bg-light rounded">
                    <h6 className="mb-3 text-primary">Preferencias de Búsqueda</h6>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ubicación Preferida</Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            value={formData.preferences.location}
                            onChange={handlePreferenceChange}
                            placeholder="Ej: Bogotá, Zona Norte"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tipo de Propiedad</Form.Label>
                          <Form.Select
                            name="propertyType"
                            value={formData.preferences.propertyType}
                            onChange={handlePreferenceChange}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="apartment">Apartamento</option>
                            <option value="house">Casa</option>
                            <option value="condo">Condominio</option>
                            <option value="office">Oficina</option>
                            <option value="land">Terreno</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Precio Mínimo</Form.Label>
                          <Form.Control
                            type="number"
                            name="min"
                            value={formData.preferences.priceRange.min}
                            onChange={handlePriceRangeChange}
                            placeholder="0"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Precio Máximo</Form.Label>
                          <Form.Control
                            type="number"
                            name="max"
                            value={formData.preferences.priceRange.max}
                            onChange={handlePriceRangeChange}
                            placeholder="Sin límite"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}

                {formData.role === 'agent' && (
                  <div className="mb-3 p-3 bg-light rounded">
                    <h6 className="mb-3 text-primary">Información Profesional</h6>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Número de Licencia *</Form.Label>
                          <Form.Control
                            type="text"
                            name="licenseNumber"
                            value={formData.professional.licenseNumber}
                            onChange={handleProfessionalChange}
                            placeholder="Ej: LIC-12345678"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Agencia</Form.Label>
                          <Form.Control
                            type="text"
                            name="agency"
                            value={formData.professional.agency}
                            onChange={handleProfessionalChange}
                            placeholder="Nombre de la agencia"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Años de Experiencia</Form.Label>
                          <Form.Select
                            name="experience"
                            value={formData.professional.experience}
                            onChange={handleProfessionalChange}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="0-1">Menos de 1 año</option>
                            <option value="1-3">1-3 años</option>
                            <option value="3-5">3-5 años</option>
                            <option value="5-10">5-10 años</option>
                            <option value="10+">Más de 10 años</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Especialización</Form.Label>
                          <Form.Select
                            name="specialization"
                            value={formData.professional.specialization}
                            onChange={handleProfessionalChange}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="residential">Residencial</option>
                            <option value="commercial">Comercial</option>
                            <option value="luxury">Lujo</option>
                            <option value="investment">Inversión</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Área de Cobertura</Form.Label>
                          <Form.Control
                            type="text"
                            name="coverageArea"
                            value={formData.professional.coverageArea}
                            onChange={handleProfessionalChange}
                            placeholder="Ej: Bogotá y alrededores"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaLock className="me-2" />
                        Contraseña
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Tu contraseña"
                          required
                          minLength={6}
                        />
                        <Button
                          variant="link"
                          className="position-absolute end-0 top-0 h-100 border-0 text-muted"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ zIndex: 5 }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        La contraseña debe tener al menos 6 caracteres.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Confirmar contraseña</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirma tu contraseña"
                          required
                          isInvalid={validated && !passwordsMatch}
                        />
                        <Button
                          variant="link"
                          className="position-absolute end-0 top-0 h-100 border-0 text-muted"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ zIndex: 5 }}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Las contraseñas no coinciden.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    label={
                      <span>
                        Acepto los{' '}
                        <Link to="/terms" className="text-decoration-none">
                          términos y condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link to="/privacy" className="text-decoration-none">
                          política de privacidad
                        </Link>
                      </span>
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Debes aceptar los términos y condiciones.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        className="me-2"
                      />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </Form>
            </Card.Body>

            <Card.Footer className="bg-light text-center py-3">
              <span className="text-muted">¿Ya tienes cuenta? </span>
              <Link to="/login" className="text-decoration-none fw-bold">
                Inicia sesión aquí
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;