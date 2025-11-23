import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunks asíncronos
export const submitOffer = createAsyncThunk(
  'offers/submitOffer',
  async (offerData, { rejectWithValue }) => {
    try {
      // Aquí iría la llamada a la API real
      // const response = await offersAPI.submitOffer(offerData);
      
      // Simulamos la respuesta del servidor
      const response = {
        id: Date.now(),
        ...offerData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + (offerData.validityDays || 7) * 24 * 60 * 60 * 1000).toISOString()
      };

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al enviar la oferta');
    }
  }
);

export const fetchUserOffers = createAsyncThunk(
  'offers/fetchUserOffers',
  async ({ type }, { rejectWithValue }) => {
    try {
      // Aquí iría la llamada a la API real
      // const response = await offersAPI.getUserOffers(type);
      
      // Simulamos datos de ofertas
      const mockOffers = {
        sent: [
          {
            id: 1,
            property: {
              id: 1,
              title: 'Apartamento Moderno Zona Norte',
              location: 'Bogotá, Zona Norte',
              price: 350000000,
              image: 'https://via.placeholder.com/200x150?text=Apt1'
            },
            amount: 320000000,
            status: 'pending',
            submittedAt: new Date(Date.now() - 86400000).toISOString(),
            validUntil: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            paymentTerms: 'financing',
            closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            seller: { name: 'María González', phone: '+57 300 123 4567' }
          }
        ],
        received: [
          {
            id: 2,
            property: {
              id: 2,
              title: 'Mi Casa en Chapinero',
              location: 'Bogotá, Chapinero',
              price: 450000000,
              image: 'https://via.placeholder.com/200x150?text=Casa1'
            },
            amount: 430000000,
            status: 'pending',
            submittedAt: new Date(Date.now() - 43200000).toISOString(),
            validUntil: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            paymentTerms: 'financing',
            closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            buyer: { name: 'Roberto Silva', email: 'roberto@email.com', phone: '+57 315 444 2233' }
          }
        ]
      };

      return mockOffers[type] || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al cargar las ofertas');
    }
  }
);

export const respondToOffer = createAsyncThunk(
  'offers/respondToOffer',
  async ({ offerId, response, message, counterAmount }, { rejectWithValue }) => {
    try {
      // Aquí iría la llamada a la API real
      // const result = await offersAPI.respondToOffer(offerId, { response, message, counterAmount });
      
      // Simulamos la respuesta
      const result = {
        offerId,
        response,
        message,
        counterAmount,
        respondedAt: new Date().toISOString()
      };

      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al responder la oferta');
    }
  }
);

export const fetchOfferDetails = createAsyncThunk(
  'offers/fetchOfferDetails',
  async (offerId, { rejectWithValue }) => {
    try {
      // Aquí iría la llamada a la API real
      // const response = await offersAPI.getOfferDetails(offerId);
      
      // Simulamos datos detallados
      const mockOffer = {
        id: offerId,
        property: {
          id: 1,
          title: 'Apartamento Moderno Zona Norte',
          location: 'Bogotá, Zona Norte',
          price: 350000000,
          images: ['https://via.placeholder.com/400x300?text=Apt1'],
          bedrooms: 3,
          bathrooms: 2,
          area: 90
        },
        amount: 320000000,
        status: 'pending',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        validUntil: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        paymentTerms: 'financing',
        downPayment: 64000000,
        financingAmount: 256000000,
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        conditions: 'Sujeto a inspección técnica y aprobación del crédito',
        buyer: { 
          name: 'Juan Pérez', 
          email: 'juan@email.com', 
          phone: '+57 300 123 4567',
          preapprovalAmount: 300000000
        },
        seller: { 
          name: 'María González', 
          email: 'maria@email.com',
          phone: '+57 301 987 6543' 
        },
        timeline: [
          {
            date: new Date(Date.now() - 86400000).toISOString(),
            action: 'Oferta enviada',
            description: 'El comprador envió una oferta formal'
          }
        ]
      };

      return mockOffer;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al cargar los detalles de la oferta');
    }
  }
);

const initialState = {
  // Ofertas enviadas por el usuario (para compradores)
  sentOffers: [],
  // Ofertas recibidas por el usuario (para vendedores)
  receivedOffers: [],
  // Oferta seleccionada actualmente
  selectedOffer: null,
  // Estados de carga
  loading: {
    submit: false,
    fetch: false,
    respond: false,
    details: false
  },
  // Errores
  error: null,
  // Filtros y paginación
  filters: {
    status: 'all', // all, pending, accepted, rejected, countered
    dateRange: 'all', // all, week, month, year
    sortBy: 'date_desc' // date_desc, date_asc, amount_desc, amount_asc
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  },
  // Estadísticas
  stats: {
    totalSent: 0,
    totalReceived: 0,
    acceptanceRate: 0,
    averageResponseTime: 0
  }
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    // Limpiar errores
    clearError: (state) => {
      state.error = null;
    },
    
    // Actualizar filtros
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Limpiar filtros
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Actualizar paginación
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Seleccionar oferta
    selectOffer: (state, action) => {
      state.selectedOffer = action.payload;
    },
    
    // Limpiar oferta seleccionada
    clearSelectedOffer: (state) => {
      state.selectedOffer = null;
    },
    
    // Marcar oferta como vista
    markOfferAsViewed: (state, action) => {
      const { offerId, type } = action.payload;
      const offers = type === 'sent' ? state.sentOffers : state.receivedOffers;
      const offer = offers.find(o => o.id === offerId);
      if (offer && !offer.viewedAt) {
        offer.viewedAt = new Date().toISOString();
      }
    },
    
    // Actualizar estado de oferta en tiempo real
    updateOfferStatus: (state, action) => {
      const { offerId, status, response } = action.payload;
      
      // Actualizar en ofertas enviadas
      const sentOffer = state.sentOffers.find(o => o.id === offerId);
      if (sentOffer) {
        sentOffer.status = status;
        if (response) {
          sentOffer.response = response;
          sentOffer.respondedAt = new Date().toISOString();
        }
      }
      
      // Actualizar en ofertas recibidas
      const receivedOffer = state.receivedOffers.find(o => o.id === offerId);
      if (receivedOffer) {
        receivedOffer.status = status;
        if (response) {
          receivedOffer.response = response;
          receivedOffer.respondedAt = new Date().toISOString();
        }
      }
      
      // Actualizar oferta seleccionada si coincide
      if (state.selectedOffer && state.selectedOffer.id === offerId) {
        state.selectedOffer.status = status;
        if (response) {
          state.selectedOffer.response = response;
          state.selectedOffer.respondedAt = new Date().toISOString();
        }
      }
    }
  },
  
  extraReducers: (builder) => {
    // Submit Offer
    builder
      .addCase(submitOffer.pending, (state) => {
        state.loading.submit = true;
        state.error = null;
      })
      .addCase(submitOffer.fulfilled, (state, action) => {
        state.loading.submit = false;
        state.sentOffers.unshift(action.payload);
        state.stats.totalSent += 1;
      })
      .addCase(submitOffer.rejected, (state, action) => {
        state.loading.submit = false;
        state.error = action.payload;
      });
    
    // Fetch User Offers
    builder
      .addCase(fetchUserOffers.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchUserOffers.fulfilled, (state, action) => {
        state.loading.fetch = false;
        // Determinar qué tipo de ofertas se cargaron basándose en el contenido
        if (action.payload.length > 0) {
          if (action.payload[0].buyer) {
            state.receivedOffers = action.payload;
            state.stats.totalReceived = action.payload.length;
          } else {
            state.sentOffers = action.payload;
            state.stats.totalSent = action.payload.length;
          }
        }
      })
      .addCase(fetchUserOffers.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      });
    
    // Respond to Offer
    builder
      .addCase(respondToOffer.pending, (state) => {
        state.loading.respond = true;
        state.error = null;
      })
      .addCase(respondToOffer.fulfilled, (state, action) => {
        state.loading.respond = false;
        const { offerId, response, message, counterAmount, respondedAt } = action.payload;
        
        // Actualizar la oferta en receivedOffers
        const offer = state.receivedOffers.find(o => o.id === offerId);
        if (offer) {
          offer.status = response === 'accept' ? 'accepted' : response === 'reject' ? 'rejected' : 'countered';
          offer.response = message;
          offer.respondedAt = respondedAt;
          if (counterAmount) {
            offer.counterAmount = counterAmount;
          }
        }
      })
      .addCase(respondToOffer.rejected, (state, action) => {
        state.loading.respond = false;
        state.error = action.payload;
      });
    
    // Fetch Offer Details
    builder
      .addCase(fetchOfferDetails.pending, (state) => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.loading.details = false;
        state.selectedOffer = action.payload;
      })
      .addCase(fetchOfferDetails.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.payload;
      });
  }
});

// Acciones
export const {
  clearError,
  setFilters,
  clearFilters,
  setPagination,
  selectOffer,
  clearSelectedOffer,
  markOfferAsViewed,
  updateOfferStatus
} = offersSlice.actions;

// Selectores
export const selectSentOffers = (state) => state.offers.sentOffers;
export const selectReceivedOffers = (state) => state.offers.receivedOffers;
export const selectSelectedOffer = (state) => state.offers.selectedOffer;
export const selectOffersLoading = (state) => state.offers.loading;
export const selectOffersError = (state) => state.offers.error;
export const selectOffersFilters = (state) => state.offers.filters;
export const selectOffersPagination = (state) => state.offers.pagination;
export const selectOffersStats = (state) => state.offers.stats;

// Selectores derivados
export const selectFilteredSentOffers = (state) => {
  const { sentOffers, filters } = state.offers;
  
  return sentOffers.filter(offer => {
    // Filtrar por estado
    if (filters.status !== 'all' && offer.status !== filters.status) {
      return false;
    }
    
    // Filtrar por rango de fechas
    if (filters.dateRange !== 'all') {
      const offerDate = new Date(offer.submittedAt);
      const now = new Date();
      const daysDiff = (now - offerDate) / (1000 * 60 * 60 * 24);
      
      switch (filters.dateRange) {
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
        case 'year':
          if (daysDiff > 365) return false;
          break;
      }
    }
    
    return true;
  }).sort((a, b) => {
    // Ordenar según filtros
    switch (filters.sortBy) {
      case 'date_asc':
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      case 'date_desc':
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      case 'amount_asc':
        return a.amount - b.amount;
      case 'amount_desc':
        return b.amount - a.amount;
      default:
        return new Date(b.submittedAt) - new Date(a.submittedAt);
    }
  });
};

export const selectFilteredReceivedOffers = (state) => {
  const { receivedOffers, filters } = state.offers;
  
  return receivedOffers.filter(offer => {
    // Filtrar por estado
    if (filters.status !== 'all' && offer.status !== filters.status) {
      return false;
    }
    
    // Filtrar por rango de fechas
    if (filters.dateRange !== 'all') {
      const offerDate = new Date(offer.submittedAt);
      const now = new Date();
      const daysDiff = (now - offerDate) / (1000 * 60 * 60 * 24);
      
      switch (filters.dateRange) {
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
        case 'year':
          if (daysDiff > 365) return false;
          break;
      }
    }
    
    return true;
  }).sort((a, b) => {
    // Ordenar según filtros
    switch (filters.sortBy) {
      case 'date_asc':
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      case 'date_desc':
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      case 'amount_asc':
        return a.amount - b.amount;
      case 'amount_desc':
        return b.amount - a.amount;
      default:
        return new Date(b.submittedAt) - new Date(a.submittedAt);
    }
  });
};

export const selectPendingOffersCount = (state) => {
  const { sentOffers, receivedOffers } = state.offers;
  return {
    sent: sentOffers.filter(offer => offer.status === 'pending').length,
    received: receivedOffers.filter(offer => offer.status === 'pending').length
  };
};

export default offersSlice.reducer;