import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Carousel, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '@store/slices/authSlice';
import { fetchProperty } from '@store/slices/propertiesSlice';
import { 
  FaArrowLeft, FaHeart, FaShareAlt, FaMapMarkerAlt, FaBed, FaBath, FaRuler, 
  FaCar, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaEye, FaExpand,
  FaCalculator, FaComments, FaHandshake, FaFlag, FaPrint, FaWifi,
  FaSwimmingPool, FaDumbbell, FaTree, FaShieldAlt, FaSnowflake,
  FaSun, FaTshirt, FaPaw, FaCouch
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import MakeOfferModal from '@components/offers/MakeOfferModal';
import ScheduleVisitModal from '@components/appointments/ScheduleVisitModal';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Local state
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Calculator state
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('12');
  const [loanTerm, setLoanTerm] = useState('20');
  const [downPayment, setDownPayment] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      // Simulación de carga de datos - En producción usar dispatch(fetchProperty(id))
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo - En producción vendría del store
      const mockProperty = {
        id: id,
        title: 'Apartamento Moderno con Vista Panorámica',
        description: 'Hermoso apartamento ubicado en el corazón de la ciudad con vistas espectaculares. Completamente renovado con acabados de lujo y todas las comodidades modernas. Ideal para personas que buscan confort y elegancia en un lugar privilegiado.',
        price: 450000000,
        location: 'Bogotá, Zona Rosa',
        address: 'Carrera 13 #85-32, Apartamento 1204',
        type: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        parkingSpaces: 2,
        floor: 12,
        totalFloors: 20,
        yearBuilt: 2020,
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
          'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800'
        ],
        features: {
          furnished: true,
          petFriendly: false,
          elevator: true,
          balcony: true,
          garden: false,
          pool: true,
          gym: true,
          security: true,
          airConditioning: true,
          heating: true,
          internet: true,
          laundry: true
        },
        seller: {
          id: 1,
          name: 'María González',
          phone: '+57 320 555 1234',
          email: 'maria.gonzalez@email.com',
          verified: true,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b147?w=150',
          propertiesCount: 8,
          rating: 4.8,
          memberSince: '2022'
        },
        coordinates: {
          lat: 4.6097,
          lng: -74.0817
        },
        priceHistory: [
          { date: '2024-10-01', price: 450000000 },
          { date: '2024-09-01', price: 460000000 },
          { date: '2024-08-01', price: 470000000 }
        ],
        views: 234,
        daysOnMarket: 45,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };
      
      setProperty(mockProperty);
      setLoanAmount(Math.round(mockProperty.price * 0.8).toString());
      setDownPayment(Math.round(mockProperty.price * 0.2).toString());
    } catch (err) {
      setError('Error al cargar la propiedad');
      toast.error('Error al cargar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (principal && monthlyRate && numberOfPayments) {
      const monthlyPaymentCalc = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      setMonthlyPayment(monthlyPaymentCalc);
    }
  };

  const handleSaveProperty = () => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para guardar propiedades');
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Propiedad removida de favoritos' : 'Propiedad guardada en favoritos');
  };

  const handleShareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Mira esta propiedad: ${property.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para contactar al vendedor');
      navigate('/login');
      return;
    }
    
    // Crear nueva conversación o ir a chat existente
    navigate(`/chat?property=${property.id}&seller=${property.seller.id}`);
  };

  const handleMakeOffer = () => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para hacer ofertas');
      navigate('/login');
      return;
    }
    
    if (currentUser?.role !== 'buyer') {
      toast.warning('Solo los compradores pueden hacer ofertas');
      return;
    }
    
    setShowOfferModal(true);
  };

  const handleScheduleVisit = () => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para agendar visitas');
      navigate('/login');
      return;
    }
    
    setShowScheduleModal(true);
  };

  const getFeatureIcon = (feature) => {
    const icons = {
      furnished: FaCouch,
      petFriendly: FaPaw,
      elevator: FaArrowLeft,
      balcony: FaEye,
      garden: FaTree,
      pool: FaSwimmingPool,
      gym: FaDumbbell,
      security: FaShieldAlt,
      airConditioning: FaSnowflake,
      heating: FaSun,
      internet: FaWifi,
      laundry: FaTshirt
    };
    return icons[feature] || FaEye;
  };

  const getFeatureLabel = (feature) => {
    const labels = {
      furnished: 'Amoblado',
      petFriendly: 'Acepta Mascotas',
      elevator: 'Ascensor',
      balcony: 'Balcón',
      garden: 'Jardín',
      pool: 'Piscina',
      gym: 'Gimnasio',
      security: 'Seguridad 24h',
      airConditioning: 'Aire Acondicionado',
      heating: 'Calefacción',
      internet: 'Internet',
      laundry: 'Lavandería'
    };
    return labels[feature] || feature;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Cargando detalles de la propiedad...</p>
        </div>
      </Container>
    );
  }

  if (error || !property) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h5>Error</h5>
          <p>{error || 'Propiedad no encontrada'}</p>
          <Button variant="primary" onClick={() => navigate('/properties')}>
            Volver a Propiedades
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header con navegación */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <Button variant="outline-secondary" onClick={() => navigate('/properties')}>
              <FaArrowLeft className="me-2" />
              Volver a Propiedades
            </Button>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={handleSaveProperty}>
                <FaHeart className={isSaved ? 'text-danger' : 'text-muted'} />
              </Button>
              <Button variant="outline-primary" onClick={handleShareProperty}>
                <FaShareAlt />
              </Button>
              <Button variant="outline-primary" onClick={() => window.print()}>
                <FaPrint />
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Galería de imágenes */}
        <Col lg={8} className="mb-4">
          <Card>
            <div style={{ height: '400px', overflow: 'hidden' }}>
              <Carousel 
                indicators={false}
                interval={null}
                onSelect={(selectedIndex) => setSelectedImageIndex(selectedIndex)}
              >
                {property.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={image}
                      alt={`${property.title} - ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '400px', 
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => setShowImageModal(true)}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
              <div className="position-absolute bottom-0 end-0 p-3">
                <Button 
                  variant="dark" 
                  size="sm"
                  onClick={() => setShowImageModal(true)}
                >
                  <FaExpand className="me-1" />
                  Ver todas las fotos ({property.images.length})
                </Button>
              </div>
            </div>
          </Card>

          {/* Información principal */}
          <Card className="mt-4">
            <Card.Body>
              <div className="mb-3">
                <Badge bg="primary" className="mb-2">
                  {property.type === 'apartment' ? 'Apartamento' : property.type}
                </Badge>
                <h2 className="mb-2">{property.title}</h2>
                <p className="text-muted mb-3">
                  <FaMapMarkerAlt className="me-1" />
                  {property.address}
                </p>
                <h3 className="text-success mb-4">{formatPrice(property.price)}</h3>
              </div>

              {/* Características principales */}
              <Row className="mb-4">
                <Col sm={3} className="text-center">
                  <div className="border rounded p-3">
                    <FaBed size={24} className="text-primary mb-2" />
                    <div><strong>{property.bedrooms}</strong></div>
                    <small className="text-muted">Habitaciones</small>
                  </div>
                </Col>
                <Col sm={3} className="text-center">
                  <div className="border rounded p-3">
                    <FaBath size={24} className="text-primary mb-2" />
                    <div><strong>{property.bathrooms}</strong></div>
                    <small className="text-muted">Baños</small>
                  </div>
                </Col>
                <Col sm={3} className="text-center">
                  <div className="border rounded p-3">
                    <FaRuler size={24} className="text-primary mb-2" />
                    <div><strong>{property.area}</strong></div>
                    <small className="text-muted">m²</small>
                  </div>
                </Col>
                <Col sm={3} className="text-center">
                  <div className="border rounded p-3">
                    <FaCar size={24} className="text-primary mb-2" />
                    <div><strong>{property.parkingSpaces}</strong></div>
                    <small className="text-muted">Parqueaderos</small>
                  </div>
                </Col>
              </Row>

              {/* Descripción */}
              <div className="mb-4">
                <h5>Descripción</h5>
                <p className="text-muted">{property.description}</p>
              </div>

              {/* Características adicionales */}
              <div className="mb-4">
                <h5>Características</h5>
                <Row>
                  {Object.entries(property.features)
                    .filter(([key, value]) => value)
                    .map(([feature, value]) => {
                      const Icon = getFeatureIcon(feature);
                      return (
                        <Col md={6} lg={4} key={feature} className="mb-2">
                          <div className="d-flex align-items-center">
                            <Icon className="text-success me-2" />
                            <span>{getFeatureLabel(feature)}</span>
                          </div>
                        </Col>
                      );
                    })}
                </Row>
              </div>

              {/* Información adicional */}
              <Row className="text-muted small">
                <Col md={6}>
                  <p><strong>Piso:</strong> {property.floor} de {property.totalFloors}</p>
                  <p><strong>Año de construcción:</strong> {property.yearBuilt}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Días en el mercado:</strong> {property.daysOnMarket}</p>
                  <p><strong>Vistas:</strong> {property.views}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar derecho */}
        <Col lg={4}>
          {/* Información del vendedor */}
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">Información del Vendedor</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={property.seller.avatar}
                  alt={property.seller.name}
                  className="rounded-circle me-3"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div>
                  <h6 className="mb-1">
                    {property.seller.name}
                    {property.seller.verified && (
                      <Badge bg="success" className="ms-2">Verificado</Badge>
                    )}
                  </h6>
                  <small className="text-muted">
                    Miembro desde {property.seller.memberSince} • {property.seller.propertiesCount} propiedades
                  </small>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <Button variant="primary" onClick={handleContactSeller}>
                  <FaComments className="me-2" />
                  Enviar Mensaje
                </Button>
                <Button variant="outline-primary" onClick={() => window.open(`tel:${property.seller.phone}`)}>
                  <FaPhone className="me-2" />
                  {property.seller.phone}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Acciones principales */}
          <Card className="mb-4">
            <Card.Body>
              <div className="d-grid gap-2">
                {isAuthenticated && currentUser?.role === 'buyer' && (
                  <Button variant="success" size="lg" onClick={handleMakeOffer}>
                    <FaHandshake className="me-2" />
                    Hacer Oferta
                  </Button>
                )}
                <Button variant="outline-primary" onClick={handleScheduleVisit}>
                  <FaCalendarAlt className="me-2" />
                  Agendar Visita
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowMortgageCalculator(true)}
                >
                  <FaCalculator className="me-2" />
                  Calculadora de Hipoteca
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Mapa básico */}
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">Ubicación</h6>
            </Card.Header>
            <Card.Body>
              <div 
                style={{ 
                  height: '200px', 
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem'
                }}
              >
                <div className="text-center text-muted">
                  <FaMapMarkerAlt size={30} className="mb-2" />
                  <p className="mb-0">Mapa Interactivo</p>
                  <small>{property.location}</small>
                </div>
              </div>
              <div className="mt-3">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => window.open(`https://maps.google.com/?q=${property.coordinates.lat},${property.coordinates.lng}`)}
                >
                  Ver en Google Maps
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Reportar */}
          <Card>
            <Card.Body className="text-center">
              <Button variant="outline-danger" size="sm">
                <FaFlag className="me-1" />
                Reportar Propiedad
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de galería completa */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Galería de Imágenes</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Carousel activeIndex={selectedImageIndex} onSelect={setSelectedImageIndex}>
            {property.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image}
                  alt={`${property.title} - ${index + 1}`}
                  style={{ width: '100%', height: '70vh', objectFit: 'cover' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>

      {/* Modal calculadora de hipoteca */}
      <Modal show={showMortgageCalculator} onHide={() => setShowMortgageCalculator(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCalculator className="me-2" />
            Calculadora de Hipoteca
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Monto del Préstamo</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="350,000,000"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cuota Inicial</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      placeholder="90,000,000"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tasa de Interés (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plazo (años)</Form.Label>
                  <Form.Control
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={calculateMortgage} className="w-100 mb-3">
              Calcular Cuota Mensual
            </Button>
            {monthlyPayment && (
              <Alert variant="success">
                <h5>Cuota Mensual Estimada:</h5>
                <h4>{formatPrice(monthlyPayment)}</h4>
                <small className="text-muted">
                  *Cálculo estimado. Consulte con su entidad financiera para información precisa.
                </small>
              </Alert>
            )}
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de hacer oferta */}
      <MakeOfferModal
        show={showOfferModal}
        onHide={() => setShowOfferModal(false)}
        property={property}
        onOfferSubmitted={() => {
          setShowOfferModal(false);
          toast.success('Oferta enviada exitosamente');
        }}
      />

      {/* Modal de agendar visita */}
      <ScheduleVisitModal
        show={showScheduleModal}
        onHide={() => setShowScheduleModal(false)}
        property={property}
        onVisitScheduled={() => {
          setShowScheduleModal(false);
          toast.success('Visita agendada exitosamente');
        }}
      />
    </Container>
  );
};

export default PropertyDetailPage;