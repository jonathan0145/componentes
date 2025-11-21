import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, InputGroup, Dropdown, Modal, Pagination } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '@store/slices/authSlice';
import { fetchProperties, setFilters, clearFilters } from '@store/slices/propertiesSlice';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaHeart, FaShareAlt, FaEye, FaPlus, FaSort } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
  const [sortBy, setSortBy] = useState('created_desc');
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [savedProperties, setSavedProperties] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
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

  // Sincronizar URL con filtros
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (sortBy !== 'created_desc') params.set('sort', sortBy);
    setSearchParams(params);
  }, [localFilters, sortBy, setSearchParams]);

  // Cargar propiedades guardadas del usuario
  useEffect(() => {
    if (currentUser) {
      const saved = JSON.parse(localStorage.getItem(`savedProperties_${currentUser.id}`) || '[]');
      setSavedProperties(saved);
    }
  }, [currentUser]);

  // Datos de ejemplo de propiedades (fallback si no hay datos del store)
  const exampleProperties = [
    {
      id: 1,
      title: 'Apartamento Moderno en Zona Norte',
      location: 'Bogotá, Zona Norte',
      price: 350000000,
      propertyType: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: 85,
      images: ['https://via.placeholder.com/300x200?text=Apartamento+1'],
      description: 'Hermoso apartamento con acabados de lujo, cerca de centros comerciales.',
      seller: { name: 'María González', phone: '+57 300 123 4567' },
      status: 'active',
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'Casa Familiar con Jardín',
      location: 'Medellín, El Poblado',
      price: 580000000,
      propertyType: 'house',
      bedrooms: 4,
      bathrooms: 3,
      area: 150,
      images: ['/images/ejemplo-casa1.jpg'],
      description: 'Casa familiar perfecta, con amplio jardín y zona de BBQ.',
      seller: { name: 'Carlos Rodríguez', phone: '+57 301 987 6543' },
      status: 'active',
      createdAt: new Date()
    },
    {
      id: 3,
      title: 'Oficina Ejecutiva Centro',
      location: 'Bogotá, Centro',
      price: 420000000,
      propertyType: 'office',
      bedrooms: 0,
      bathrooms: 1,
      area: 45,
      images: ['/images/ejemplo-oficina1.jpg'],
      description: 'Oficina moderna en edificio empresarial, excelente ubicación.',
      seller: { name: 'Ana Martínez', phone: '+57 302 555 7890' },
      status: 'active',
      createdAt: new Date()
    },
    {
      id: 4,
      title: 'Apartamento Vista al Mar',
      location: 'Cartagena, Bocagrande',
      price: 650000000,
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 90,
      images: ['https://via.placeholder.com/300x200?text=Apartamento+Vista+Mar'],
      description: 'Increíble vista al mar, totalmente amoblado y listo para vivir.',
      seller: { name: 'Roberto Silva', phone: '+57 315 444 2233' },
      status: 'active',
      createdAt: new Date()
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


  const getPropertyTypeLabel = (propertyType) => {
    const types = {
      apartment: 'Apartamento',
      house: 'Casa',
      condo: 'Condominio',
      office: 'Oficina',
      land: 'Terreno'
    };
    return types[propertyType] || propertyType;
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
      // Crear una conversación temporal para ir al chat
      const property = selectedProperty;
      const conversation = {
        id: `property-${property.id}-${Date.now()}`,
        property: {
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          image: property.images[0]
        },
        participants: [
          {
            id: currentUser.id,
            name: currentUser.name || currentUser.email,
            role: currentUser.role || 'buyer'
          },
          {
            id: `seller-${property.id}`,
            name: property.seller.name,
            role: 'seller'
          }
        ],
        lastMessage: {
          text: `Hola, me interesa esta propiedad: ${property.title}`,
          timestamp: new Date(),
          sender: currentUser
        },
        unreadCount: 0
      };

      // Almacenar la conversación en localStorage para que el chat la pueda usar
      const existingConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      const existingIndex = existingConversations.findIndex(conv => 
        conv.property?.id === property.id && 
        conv.participants.some(p => p.id === currentUser.id)
      );

      if (existingIndex >= 0) {
        // Si ya existe una conversación para esta propiedad, usarla
        navigate(`/chat?conversation=${existingConversations[existingIndex].id}`);
      } else {
        // Crear nueva conversación
        existingConversations.push(conversation);
        localStorage.setItem('conversations', JSON.stringify(existingConversations));
        navigate(`/chat?conversation=${conversation.id}`);
      }

      toast.success(`Iniciando conversación con ${property.seller.name}`);
      setShowContactModal(false);
    }
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  };

  const applyFilters = () => {
    let filtered = properties;

    if (filters.search) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(property => property.propertyType === filters.propertyType);
    }

    if (filters.priceMin) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.priceMin));
    }

    if (filters.priceMax) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.priceMax));
    }

    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.bathrooms));
    }

    setFilteredProperties(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>🏠 Catálogo de Propiedades</h1>
              <p className="text-muted">Encuentra la propiedad perfecta para ti</p>
            </div>
            <Button 
              variant="outline-secondary"
              onClick={() => navigate('/dashboard')}
            >
              ← Volver al Dashboard
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="search"
                      placeholder="Buscar por título o ubicación..."
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </InputGroup>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <FaFilter /> Filtros
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/properties/new')}
                    >
                      + Publicar Propiedad
                    </Button>
                  </div>
                </Col>
              </Row>

              {showFilters && (
                <Row className="mt-3 pt-3 border-top">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select
                        name="propertyType"
                        value={filters.propertyType}
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
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Precio Mínimo</Form.Label>
                      <Form.Control
                        type="number"
                        name="priceMin"
                        placeholder="0"
                        value={filters.priceMin}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Precio Máximo</Form.Label>
                      <Form.Control
                        type="number"
                        name="priceMax"
                        placeholder="Sin límite"
                        value={filters.priceMax}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Habitaciones</Form.Label>
                      <Form.Select
                        name="bedrooms"
                        value={filters.bedrooms}
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
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Resultados */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Resultados ({filteredProperties.length} propiedades)</h5>
            <Badge bg="secondary">{filteredProperties.length} encontradas</Badge>
          </div>
        </Col>
      </Row>

      {/* Lista de Propiedades */}
      <Row>
        {filteredProperties.map(property => (
          <Col md={6} lg={4} key={property.id} className="mb-4">
            <Card className="h-100 property-card">
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <Card.Img 
                  variant="top" 
                  src={property.images[0]} 
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <div className="mb-2">
                  <Badge bg="info" className="me-2">
                    {getPropertyTypeLabel(property.propertyType)}
                  </Badge>
                  <h6 className="card-title">{property.title}</h6>
                </div>
                
                <div className="mb-2">
                  <small className="text-muted">
                    <FaMapMarkerAlt className="me-1" />
                    {property.location}
                  </small>
                </div>

                <div className="mb-2">
                  <strong className="text-primary fs-5">
                    {formatPrice(property.price)}
                  </strong>
                </div>

                <div className="mb-2 d-flex gap-3">
                  {property.bedrooms > 0 && (
                    <small>
                      <FaBed className="me-1" />
                      {property.bedrooms} hab.
                    </small>
                  )}
                  <small>
                    <FaBath className="me-1" />
                    {property.bathrooms} baños
                  </small>
                  <small>
                    <FaRuler className="me-1" />
                    {property.area} m²
                  </small>
                </div>

                <p className="text-muted small mb-3">
                  {property.description}
                </p>

                <div className="mt-auto">
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary"
                      onClick={() => handleContactSeller(property)}
                    >
                      � Contactar Vendedor
                    </Button>
                    <Button 
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigate(`/properties/${property.id}`)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => navigate(`/properties/${property.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredProperties.length === 0 && (
        <Row>
          <Col>
            <Card>
              <Card.Body className="text-center py-5">
                <h5>No se encontraron propiedades</h5>
                <p className="text-muted">Intenta ajustar los filtros de búsqueda</p>
                <Button 
                  variant="primary"
                  onClick={() => setFilters({
                    search: '',
                    propertyType: '',
                    priceMin: '',
                    priceMax: '',
                    location: '',
                    bedrooms: '',
                    bathrooms: ''
                  })}
                >
                  Limpiar Filtros
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PropertiesPage;