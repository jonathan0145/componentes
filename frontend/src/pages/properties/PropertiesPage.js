import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, InputGroup, Dropdown, Modal, Pagination, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '@store/slices/authSlice';
import { fetchProperties, setFilters, clearFilters } from '@store/slices/propertiesSlice';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaHeart, FaShareAlt, FaEye, FaPlus, FaSort, FaTh, FaList, FaPhone, FaEnvelope, FaHandshake, FaCalendarAlt } from 'react-icons/fa';
import AdvancedSearchBar from '@components/properties/AdvancedSearchBar';
import { toast } from 'react-toastify';
import MakeOfferModal from '@components/offers/MakeOfferModal';
import ScheduleVisitModal from '@components/appointments/ScheduleVisitModal';

const PropertiesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { properties, loading, pagination, filters: storeFilters } = useSelector(state => state.properties);
  
  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get('search') || '',
    propertyType: searchParams.get('type') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    location: searchParams.get('location') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    status: 'active'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_desc');
  const [viewMode, setViewMode] = useState('grid');
  const [savedProperties, setSavedProperties] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Cargar propiedades al montar y cuando cambien los filtros
  useEffect(() => {
    const params = {
      ...localFilters,
      sort: sortBy,
      page: searchParams.get('page') || 1,
      limit: 12
    };
    
    dispatch(fetchProperties(params));
  }, [dispatch, localFilters, sortBy, searchParams]);

  // Cargar propiedades guardadas del usuario
  useEffect(() => {
    if (currentUser) {
      const saved = JSON.parse(localStorage.getItem(`savedProperties_${currentUser.id}`) || '[]');
      setSavedProperties(saved);
    }
  }, [currentUser]);

  // Sincronizar URL con filtros
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && key !== 'status') params.set(key, value);
    });
    if (sortBy !== 'created_desc') params.set('sort', sortBy);
    setSearchParams(params);
  }, [localFilters, sortBy, setSearchParams]);

  // Datos de ejemplo de propiedades (fallback si no hay datos del store)
  const exampleProperties = [
    {
      id: 1,
      title: 'Apartamento Moderno en Zona Norte',
      location: 'Bogotá, Zona Norte',
      price: 350000000,
      type: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: 85,
      images: ['https://via.placeholder.com/300x200?text=Apartamento+1'],
      description: 'Hermoso apartamento con acabados de lujo, cerca de centros comerciales.',
      seller: { id: 1, name: 'María González', phone: '+57 300 123 4567' },
      status: 'active',
      views: 245,
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: 2,
      title: 'Casa Familiar con Jardín',
      location: 'Medellín, El Poblado',
      price: 580000000,
      type: 'house',
      bedrooms: 4,
      bathrooms: 3,
      area: 150,
      images: ['https://via.placeholder.com/300x200?text=Casa+1'],
      description: 'Casa familiar perfecta, con amplio jardín y zona de BBQ.',
      seller: { id: 2, name: 'Carlos Rodríguez', phone: '+57 301 987 6543' },
      status: 'active',
      views: 189,
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      id: 3,
      title: 'Oficina Ejecutiva Centro',
      location: 'Bogotá, Centro',
      price: 420000000,
      type: 'office',
      bedrooms: 0,
      bathrooms: 1,
      area: 45,
      images: ['https://via.placeholder.com/300x200?text=Oficina+1'],
      description: 'Oficina moderna en edificio empresarial, excelente ubicación.',
      seller: { id: 3, name: 'Ana Martínez', phone: '+57 302 555 7890' },
      status: 'active',
      views: 67,
      createdAt: new Date(Date.now() - 259200000)
    },
    {
      id: 4,
      title: 'Apartamento Vista al Mar',
      location: 'Cartagena, Bocagrande',
      price: 650000000,
      type: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 90,
      images: ['https://via.placeholder.com/300x200?text=Apartamento+Vista+Mar'],
      description: 'Increíble vista al mar, totalmente amoblado y listo para vivir.',
      seller: { id: 4, name: 'Roberto Silva', phone: '+57 315 444 2233' },
      status: 'active',
      views: 432,
      createdAt: new Date(Date.now() - 345600000)
    }
  ];

  // Usar propiedades del store o ejemplos como fallback
  const displayProperties = properties.length > 0 ? properties : exampleProperties;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPropertyTypeLabel = (type) => {
    const types = {
      apartment: 'Apartamento',
      house: 'Casa',
      condo: 'Condominio',
      office: 'Oficina',
      land: 'Terreno'
    };
    return types[type] || type;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Los filtros se aplican automáticamente por el useEffect
  };

  const clearAllFilters = () => {
    setLocalFilters({
      search: '',
      propertyType: '',
      priceMin: '',
      priceMax: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      status: 'active'
    });
    dispatch(clearFilters());
  };

  const handleSaveProperty = (propertyId) => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para guardar propiedades');
      navigate('/login');
      return;
    }

    const newSaved = savedProperties.includes(propertyId)
      ? savedProperties.filter(id => id !== propertyId)
      : [...savedProperties, propertyId];
    
    setSavedProperties(newSaved);
    localStorage.setItem(`savedProperties_${currentUser.id}`, JSON.stringify(newSaved));
    
    const action = savedProperties.includes(propertyId) ? 'eliminada de' : 'agregada a';
    toast.success(`Propiedad ${action} favoritos`);
  };

  const handleShareProperty = (property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.origin + `/properties/${property.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/properties/${property.id}`);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  const handleContactSeller = (property) => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para contactar al vendedor');
      navigate('/login');
      return;
    }

    setSelectedProperty(property);
    setShowContactModal(true);
  };

  const handleStartChat = () => {
    if (selectedProperty) {
      // Crear nueva conversación o ir a chat existente
      navigate(`/chat?property=${selectedProperty.id}&seller=${selectedProperty.seller.id}`);
      setShowContactModal(false);
    }
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleMakeOffer = (property) => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para hacer una oferta');
      return;
    }
    
    if (currentUser?.role !== 'buyer') {
      toast.warning('Solo los compradores pueden hacer ofertas');
      return;
    }

    setSelectedProperty(property);
    setShowOfferModal(true);
  };

  const handleScheduleVisit = (property) => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para agendar una visita');
      return;
    }

    setSelectedProperty(property);
    setShowScheduleModal(true);
  };

  const handleVisitScheduled = (visitData) => {
    setShowScheduleModal(false);
    setSelectedProperty(null);
    toast.success('¡Visita agendada exitosamente!');
  };

  const handleOfferSubmitted = () => {
    setShowOfferModal(false);
    setSelectedProperty(null);
    toast.success('Oferta enviada exitosamente');
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  const getSortLabel = (value) => {
    const sorts = {
      'created_desc': 'Más recientes',
      'created_asc': 'Más antiguos',
      'price_asc': 'Precio: menor a mayor',
      'price_desc': 'Precio: mayor a menor',
      'area_desc': 'Área: mayor a menor',
      'area_asc': 'Área: menor a mayor'
    };
    return sorts[value] || value;
  };

  const PropertyCard = ({ property }) => (
    <Card className="h-100 property-card">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={property.images?.[0] || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
          style={{ height: '200px', objectFit: 'cover' }}
          onClick={() => handleViewProperty(property.id)}
          className="cursor-pointer"
        />
        <div className="position-absolute top-0 start-0 p-2">
          <Badge bg="primary">{getPropertyTypeLabel(property.type)}</Badge>
        </div>
        <div className="position-absolute top-0 end-0 p-2">
          <Button
            variant="light"
            size="sm"
            className="rounded-circle me-1"
            onClick={() => handleSaveProperty(property.id)}
          >
            <FaHeart className={savedProperties.includes(property.id) ? 'text-danger' : 'text-muted'} />
          </Button>
          <Button
            variant="light"
            size="sm"
            className="rounded-circle"
            onClick={() => handleShareProperty(property)}
          >
            <FaShareAlt className="text-muted" />
          </Button>
        </div>
      </div>

      <Card.Body>
        <Card.Title className="mb-2" style={{ fontSize: '1.1rem' }}>
          {property.title}
        </Card.Title>

        <div className="mb-2">
          <small className="text-muted d-flex align-items-center">
            <FaMapMarkerAlt className="me-1" />
            {property.location}
          </small>
        </div>

        <h5 className="text-success mb-3">{formatPrice(property.price)}</h5>

        <div className="d-flex justify-content-between mb-3">
          {property.bedrooms > 0 && (
            <span className="text-muted small">
              <FaBed className="me-1" />
              {property.bedrooms} hab
            </span>
          )}
          <span className="text-muted small">
            <FaBath className="me-1" />
            {property.bathrooms} baños
          </span>
          <span className="text-muted small">
            <FaRuler className="me-1" />
            {property.area}m²
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted d-flex align-items-center">
            <FaEye className="me-1" />
            {property.views || 0} vistas
          </small>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleViewProperty(property.id)}
            >
              Ver
            </Button>
            {isAuthenticated && (
              <>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleScheduleVisit(property)}
                  title="Agendar visita"
                >
                  <FaCalendarAlt />
                </Button>
                {currentUser?.role === 'buyer' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleMakeOffer(property)}
                  >
                    <FaHandshake className="me-1" />
                    Ofertar
                  </Button>
                )}
              </>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleContactSeller(property)}
            >
              Contactar
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const PropertyListItem = ({ property }) => (
    <Card className="mb-3">
      <Row className="g-0">
        <Col md={4}>
          <Card.Img
            src={property.images?.[0] || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
            style={{ height: '200px', objectFit: 'cover' }}
            onClick={() => handleViewProperty(property.id)}
            className="cursor-pointer h-100"
          />
        </Col>
        <Col md={8}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Card.Title className="mb-2">{property.title}</Card.Title>
                <p className="text-muted mb-2">
                  <FaMapMarkerAlt className="me-1" />
                  {property.location}
                </p>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => handleSaveProperty(property.id)}
                >
                  <FaHeart className={savedProperties.includes(property.id) ? 'text-danger' : 'text-muted'} />
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => handleShareProperty(property)}
                >
                  <FaShareAlt className="text-muted" />
                </Button>
              </div>
            </div>

            <h4 className="text-success mb-3">{formatPrice(property.price)}</h4>

            <div className="d-flex gap-4 mb-3">
              <Badge bg="secondary">{getPropertyTypeLabel(property.type)}</Badge>
              {property.bedrooms > 0 && (
                <span className="text-muted">
                  <FaBed className="me-1" />
                  {property.bedrooms} hab
                </span>
              )}
              <span className="text-muted">
                <FaBath className="me-1" />
                {property.bathrooms} baños
              </span>
              <span className="text-muted">
                <FaRuler className="me-1" />
                {property.area}m²
              </span>
              <span className="text-muted">
                <FaEye className="me-1" />
                {property.views || 0} vistas
              </span>
            </div>

            <p className="text-muted mb-3">{property.description}</p>

            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Publicado por: {property.seller?.name}
              </small>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => handleViewProperty(property.id)}
                >
                  Ver Detalles
                </Button>
                {isAuthenticated && (
                  <>
                    <Button
                      variant="outline-success"
                      onClick={() => handleScheduleVisit(property)}
                      title="Agendar visita"
                    >
                      <FaCalendarAlt className="me-1" />
                      Agendar Visita
                    </Button>
                    {currentUser?.role === 'buyer' && (
                      <Button
                        variant="success"
                        onClick={() => handleMakeOffer(property)}
                      >
                        <FaHandshake className="me-1" />
                        Hacer Oferta
                      </Button>
                    )}
                  </>
                )}
                <Button
                  variant="primary"
                  onClick={() => handleContactSeller(property)}
                >
                  Contactar Vendedor
                </Button>
              </div>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Container fluid className="py-4">

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>🏠 Propiedades Disponibles</h2>
              <p className="text-muted">
                {displayProperties.length} propiedades encontradas
              </p>
            </div>
            {currentUser?.role === 'seller' && (
              <Button variant="primary" onClick={() => navigate('/properties/new')}>
                <FaPlus className="me-2" />
                Publicar Propiedad
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Búsqueda avanzada */}
      <Row>
        <Col>
          <AdvancedSearchBar
            onSearch={filters => {
              // Actualiza los filtros locales con los filtros avanzados
              setLocalFilters(prev => ({
                ...prev,
                ...filters
              }));
            }}
            onSaveSearch={filters => {
              // Guarda la búsqueda avanzada en localStorage
              localStorage.setItem('savedAdvancedSearch', JSON.stringify(filters));
              toast.success('¡Búsqueda avanzada guardada!');
            }}
          />
        </Col>
      </Row>

      {/* Barra de búsqueda y filtros */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row className="align-items-end">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Buscar</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="search"
                          value={localFilters.search}
                          onChange={handleFilterChange}
                          placeholder="Título, ubicación, descripción..."
                        />
                        <Button variant="primary" type="submit">
                          <FaSearch />
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select
                        name="propertyType"
                        value={localFilters.propertyType}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todos</option>
                        <option value="apartment">Apartamento</option>
                        <option value="house">Casa</option>
                        <option value="condo">Condominio</option>
                        <option value="office">Oficina</option>
                        <option value="land">Terreno</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Ubicación</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={localFilters.location}
                        onChange={handleFilterChange}
                        placeholder="Ciudad, barrio..."
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowFilters(!showFilters)}
                      className="w-100"
                    >
                      <FaFilter className="me-1" />
                      Más Filtros
                    </Button>
                  </Col>

                  <Col md={2}>
                    <Button
                      variant="outline-danger"
                      onClick={clearAllFilters}
                      className="w-100"
                    >
                      Limpiar
                    </Button>
                  </Col>
                </Row>

                {/* Filtros avanzados */}
                {showFilters && (
                  <Row className="mt-3 pt-3 border-top">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Precio Mínimo</Form.Label>
                        <Form.Control
                          type="number"
                          name="priceMin"
                          value={localFilters.priceMin}
                          onChange={handleFilterChange}
                          placeholder="Ej: 200000000"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Precio Máximo</Form.Label>
                        <Form.Control
                          type="number"
                          name="priceMax"
                          value={localFilters.priceMax}
                          onChange={handleFilterChange}
                          placeholder="Ej: 500000000"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Habitaciones</Form.Label>
                        <Form.Select
                          name="bedrooms"
                          value={localFilters.bedrooms}
                          onChange={handleFilterChange}
                        >
                          <option value="">Cualquiera</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Baños</Form.Label>
                        <Form.Select
                          name="bathrooms"
                          value={localFilters.bathrooms}
                          onChange={handleFilterChange}
                        >
                          <option value="">Cualquiera</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Controles de vista y ordenamiento */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Vista:</span>
              <div className="btn-group" role="group">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <FaTh />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <FaList />
                </Button>
              </div>
            </div>

            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                <FaSort className="me-1" />
                {getSortLabel(sortBy)}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortBy('created_desc')}>
                  Más recientes
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('created_asc')}>
                  Más antiguos
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('price_asc')}>
                  Precio: menor a mayor
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('price_desc')}>
                  Precio: mayor a menor
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('area_desc')}>
                  Área: mayor a menor
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('area_asc')}>
                  Área: menor a mayor
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>

      {/* Loading */}
      {loading && (
        <Row>
          <Col className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Cargando propiedades...</p>
          </Col>
        </Row>
      )}

      {/* Lista de propiedades */}
      {!loading && displayProperties.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <Row>
              {displayProperties.map(property => (
                <Col lg={4} md={6} key={property.id} className="mb-4">
                  <PropertyCard property={property} />
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              <Col>
                {displayProperties.map(property => (
                  <PropertyListItem key={property.id} property={property} />
                ))}
              </Col>
            </Row>
          )}
        </>
      )}

      {/* Sin resultados */}
      {!loading && displayProperties.length === 0 && (
        <Row>
          <Col>
            <Card>
              <Card.Body className="text-center py-5">
                <h5>No se encontraron propiedades</h5>
                <p className="text-muted">Intenta ajustar los filtros de búsqueda</p>
                <Button variant="primary" onClick={clearAllFilters}>
                  Limpiar Filtros
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.Prev
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              />
              
              {[...Array(pagination.totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === pagination.currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              
              <Pagination.Next
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              />
            </Pagination>
          </Col>
        </Row>
      )}

      {/* Modal de contacto */}
      <Modal show={showContactModal} onHide={() => setShowContactModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Contactar Vendedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProperty && (
            <>
              <h6>{selectedProperty.title}</h6>
              <p className="text-muted">{selectedProperty.location}</p>
              <p><strong>Vendedor:</strong> {selectedProperty.seller?.name}</p>
              <p className="text-muted">
                ¿Cómo te gustaría contactar al vendedor?
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContactModal(false)}>
            Cancelar
          </Button>
          <Button variant="outline-primary" onClick={() => window.open(`tel:${selectedProperty?.seller?.phone}`)}>
            <FaPhone className="me-1" />
            Llamar
          </Button>
          <Button variant="primary" onClick={handleStartChat}>
            <FaEnvelope className="me-1" />
            Enviar Mensaje
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de hacer oferta */}
      <MakeOfferModal
        show={showOfferModal}
        onHide={() => setShowOfferModal(false)}
        property={selectedProperty}
        onOfferSubmitted={handleOfferSubmitted}
      />

      {/* Modal de agendar visita */}
      <ScheduleVisitModal
        show={showScheduleModal}
        onHide={() => setShowScheduleModal(false)}
        property={selectedProperty}
        onVisitScheduled={handleVisitScheduled}
      />
    </Container>
  );
};

export default PropertiesPage;