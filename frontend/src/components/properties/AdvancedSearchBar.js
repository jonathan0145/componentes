import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Badge } from 'react-bootstrap';

const defaultServices = [
  'Transporte público',
  'Supermercado',
  'Colegios',
  'Hospital',
  'Parques',
  'Centros comerciales'
];

const defaultAmenities = [
  'Piscina',
  'Gimnasio',
  'Jardín',
  'Ascensor',
  'Seguridad 24h',
  'Zona infantil'
];

const AdvancedSearchBar = ({ onSearch, onSaveSearch }) => {
  const [filters, setFilters] = useState({
    location: '',
    mapArea: '', // Placeholder para zona en mapa
    proximity: [],
    type: '',
    amenities: [],
    minRooms: '',
    minBaths: '',
    minPrice: '',
    maxPrice: '',
    minAge: '',
    maxAge: ''
  });
  const [saved, setSaved] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (defaultServices.includes(value)) {
        setFilters(f => ({
          ...f,
          proximity: checked
            ? [...f.proximity, value]
            : f.proximity.filter(s => s !== value)
        }));
      } else if (defaultAmenities.includes(value)) {
        setFilters(f => ({
          ...f,
          amenities: checked
            ? [...f.amenities, value]
            : f.amenities.filter(a => a !== value)
        }));
      }
    } else {
      setFilters(f => ({ ...f, [name]: value }));
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    if (onSearch) onSearch(filters);
  };

  const handleSaveSearch = () => {
    setSaved(true);
    if (onSaveSearch) onSaveSearch(filters);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <strong>Búsqueda Avanzada</strong>
        <Button
          variant="outline-success"
          size="sm"
          className="float-end"
          onClick={handleSaveSearch}
        >
          Guardar búsqueda
        </Button>
        {saved && <Badge bg="success" className="ms-2">¡Guardada!</Badge>}
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSearch}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Ubicación</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleChange}
                  placeholder="Ciudad, barrio, zona..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Zona en mapa</Form.Label>
                {/* Placeholder visual para mapa */}
                <div style={{ border: '1px solid #ccc', height: 120, borderRadius: 8, background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#888' }}>[Mapa interactivo aquí]</span>
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tipo de propiedad</Form.Label>
                <Form.Select name="type" value={filters.type} onChange={handleChange}>
                  <option value="">Cualquiera</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="oficina">Oficina</option>
                  <option value="local">Local comercial</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Proximidad a servicios</Form.Label>
                <div>
                  {defaultServices.map(s => (
                    <Form.Check
                      key={s}
                      type="checkbox"
                      label={s}
                      value={s}
                      checked={filters.proximity.includes(s)}
                      onChange={handleChange}
                      inline
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Amenities</Form.Label>
                <div>
                  {defaultAmenities.map(a => (
                    <Form.Check
                      key={a}
                      type="checkbox"
                      label={a}
                      value={a}
                      checked={filters.amenities.includes(a)}
                      onChange={handleChange}
                      inline
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Habitaciones mín.</Form.Label>
                <Form.Control
                  type="number"
                  name="minRooms"
                  value={filters.minRooms}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Baños mín.</Form.Label>
                <Form.Control
                  type="number"
                  name="minBaths"
                  value={filters.minBaths}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Precio mín.</Form.Label>
                <Form.Control
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Precio máx.</Form.Label>
                <Form.Control
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Antigüedad mín. (años)</Form.Label>
                <Form.Control
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Antigüedad máx. (años)</Form.Label>
                <Form.Control
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant="primary">Buscar propiedades</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdvancedSearchBar;
