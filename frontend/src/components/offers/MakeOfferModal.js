import React, { useState } from 'react';
import { Modal, Form, Button, Alert, InputGroup, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '@store/slices/authSlice';
import { submitOffer, selectOffersLoading, selectOffersError, clearError } from '@store/slices/offersSlice';
import { FaDollarSign, FaCalendarAlt, FaFileContract } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MakeOfferModal = ({ show, onHide, property, onOfferSubmitted }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectOffersLoading);
  const error = useSelector(selectOffersError);
  const [validated, setValidated] = useState(false);

  const [offerData, setOfferData] = useState({
    amount: '',
    paymentTerms: 'cash',
    customPaymentTerms: '',
    financingPercentage: 80,
    closingDate: '',
    conditions: '',
    validUntil: '',
    includesFurnishing: false,
    includesParking: true,
    additionalNotes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOfferData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    // Validaciones adicionales
    if (parseFloat(offerData.amount) <= 0) {
      toast.error('El monto de la oferta debe ser mayor a 0');
      return;
    }

    if (new Date(offerData.validUntil) <= new Date()) {
      toast.error('La fecha de validez debe ser futura');
      return;
    }

    if (new Date(offerData.closingDate) <= new Date()) {
      toast.error('La fecha de cierre debe ser futura');
      return;
    }

    try {
      const offer = {
        ...offerData,
        propertyId: property.id,
        sellerId: property.seller?.id || property.ownerId,
        buyerId: currentUser.id,
        amount: parseFloat(offerData.amount),
        property: {
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          image: property.images?.[0] || property.image
        }
      };

      await dispatch(submitOffer(offer)).unwrap();
      
      toast.success('Oferta enviada exitosamente');
      handleReset();
      onOfferSubmitted?.(offer); // Pasar los datos de la oferta
    } catch (error) {
      toast.error(error || 'Error al enviar la oferta');
    }
  };

  const handleReset = () => {
    setOfferData({
      amount: '',
      paymentTerms: 'cash',
      customPaymentTerms: '',
      financingPercentage: 80,
      closingDate: '',
      conditions: '',
      validUntil: '',
      includesFurnishing: false,
      includesParking: true,
      additionalNotes: ''
    });
    setValidated(false);
    onHide();
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

  const calculatePercentage = () => {
    if (!offerData.amount || !property?.price) return 0;
    return ((parseFloat(offerData.amount) / property.price) * 100).toFixed(1);
  };

  // Configurar fechas mínimas
  const today = new Date();
  const minValidUntil = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Mañana
  const minClosingDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // En una semana

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaFileContract className="me-2" />
          Hacer Oferta Formal
        </Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Información de la propiedad */}
          <Card className="mb-4 bg-light">
            <Card.Body>
              <h6 className="mb-2">{property?.title}</h6>
              <p className="text-muted mb-1">{property?.location}</p>
              <h5 className="text-success mb-0">
                Precio de lista: {formatPrice(property?.price)}
              </h5>
            </Card.Body>
          </Card>

          {/* Monto de la oferta */}
          <div className="mb-4">
            <Form.Group>
              <Form.Label className="fw-bold">Monto de la Oferta *</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaDollarSign />
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  name="amount"
                  value={offerData.amount}
                  onChange={handleChange}
                  placeholder="Ingresa tu oferta"
                  required
                  min="1"
                />
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                El monto es requerido y debe ser mayor a 0.
              </Form.Control.Feedback>
              {offerData.amount && property?.price && (
                <Form.Text className="text-muted">
                  Tu oferta representa el {calculatePercentage()}% del precio de lista
                  {parseFloat(calculatePercentage()) < 90 && (
                    <span className="text-warning"> (Oferta baja)</span>
                  )}
                  {parseFloat(calculatePercentage()) >= 90 && parseFloat(calculatePercentage()) < 100 && (
                    <span className="text-info"> (Oferta competitiva)</span>
                  )}
                  {parseFloat(calculatePercentage()) >= 100 && (
                    <span className="text-success"> (Oferta completa o superior)</span>
                  )}
                </Form.Text>
              )}
              {offerData.amount && (
                <Form.Text className="text-success d-block">
                  {formatPrice(offerData.amount)}
                </Form.Text>
              )}
            </Form.Group>
          </div>

          {/* Términos de pago */}
          <div className="mb-4">
            <Form.Group>
              <Form.Label className="fw-bold">Términos de Pago *</Form.Label>
              <Form.Select
                name="paymentTerms"
                value={offerData.paymentTerms}
                onChange={handleChange}
                required
              >
                <option value="cash">Pago de contado</option>
                <option value="financing">Financiamiento bancario</option>
                <option value="mixed">Pago mixto (contado + financiamiento)</option>
                <option value="installments">Pagos a plazos con el vendedor</option>
                <option value="custom">Términos personalizados</option>
              </Form.Select>
            </Form.Group>

            {offerData.paymentTerms === 'financing' && (
              <Form.Group className="mt-3">
                <Form.Label>Porcentaje de Financiamiento</Form.Label>
                <Form.Range
                  name="financingPercentage"
                  value={offerData.financingPercentage}
                  onChange={handleChange}
                  min="50"
                  max="90"
                  step="5"
                />
                <Form.Text className="text-muted">
                  {offerData.financingPercentage}% financiado ({100 - offerData.financingPercentage}% inicial)
                  {offerData.amount && (
                    <> - Inicial: {formatPrice(offerData.amount * (100 - offerData.financingPercentage) / 100)}</>
                  )}
                </Form.Text>
              </Form.Group>
            )}

            {(offerData.paymentTerms === 'custom' || offerData.paymentTerms === 'installments') && (
              <Form.Group className="mt-3">
                <Form.Label>Detalles de los Términos de Pago</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="customPaymentTerms"
                  value={offerData.customPaymentTerms}
                  onChange={handleChange}
                  placeholder="Describe los términos específicos de pago..."
                  required={offerData.paymentTerms === 'custom'}
                />
              </Form.Group>
            )}
          </div>

          {/* Fechas importantes */}
          <div className="mb-4">
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <FaCalendarAlt className="me-1" />
                    Fecha de Cierre Propuesta *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="closingDate"
                    value={offerData.closingDate}
                    onChange={handleChange}
                    min={minClosingDate}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    La fecha de cierre es requerida.
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-bold">Válida Hasta *</Form.Label>
                  <Form.Control
                    type="date"
                    name="validUntil"
                    value={offerData.validUntil}
                    onChange={handleChange}
                    min={minValidUntil}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    La fecha de validez es requerida.
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
          </div>

          {/* Condiciones y términos */}
          <div className="mb-4">
            <Form.Group>
              <Form.Label className="fw-bold">Condiciones de la Oferta</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="conditions"
                value={offerData.conditions}
                onChange={handleChange}
                placeholder="Ej: Sujeto a inspección técnica, revisión de documentos legales, etc."
              />
              <Form.Text className="text-muted">
                Condiciones especiales que deben cumplirse para que la oferta sea válida
              </Form.Text>
            </Form.Group>
          </div>

          {/* Inclusiones */}
          <div className="mb-4">
            <Form.Label className="fw-bold d-block mb-3">¿Qué se incluye en la oferta?</Form.Label>
            
            <Form.Check
              type="checkbox"
              id="includesParking"
              name="includesParking"
              label="Incluye parqueadero (si aplica)"
              checked={offerData.includesParking}
              onChange={handleChange}
              className="mb-2"
            />
            
            <Form.Check
              type="checkbox"
              id="includesFurnishing"
              name="includesFurnishing"
              label="Incluye mobiliario y enseres"
              checked={offerData.includesFurnishing}
              onChange={handleChange}
              className="mb-2"
            />
          </div>

          {/* Notas adicionales */}
          <div className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Notas Adicionales</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="additionalNotes"
                value={offerData.additionalNotes}
                onChange={handleChange}
                placeholder="Información adicional que consideres relevante para el vendedor..."
              />
            </Form.Group>
          </div>

          {/* Advertencia legal */}
          <Alert variant="info">
            <small>
              <strong>Nota importante:</strong> Esta oferta, una vez enviada, constituye un compromiso formal. 
              Asegúrate de que todos los datos sean correctos antes de enviar. 
              El vendedor tendrá hasta la fecha de validez para responder.
            </small>
          </Alert>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading.submit}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" disabled={loading.submit}>
            {loading.submit ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Enviando Oferta...
              </>
            ) : (
              <>
                <FaFileContract className="me-1" />
                Enviar Oferta Formal
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MakeOfferModal;