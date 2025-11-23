import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunks asíncronos
export const fetchAvailableAgents = createAsyncThunk(
  'agents/fetchAvailable',
  async ({ location, propertyType }, { rejectWithValue }) => {
    try {
      // Aquí iría la llamada a la API real
      // const response = await agentsAPI.getAvailableAgents({ location, propertyType });
      
      // Simulamos datos de agentes
      const mockAgents = [
        {
          id: 1,
          name: 'María González Rodríguez',
          company: 'Inmobiliaria Premium',
          license: 'LIC-2023-001',
          rating: 4.8,
          reviews: 127,
          specialties: ['Apartamentos', 'Casas Familiares'],
          location: 'Bogotá, Zona Norte',
          experience: '8 años',
          phone: '+57 300 123 4567',
          email: 'maria.gonzalez@premium.com',
          photo: 'https://via.placeholder.com/80x80?text=MG',
          verified: true,
          description: 'Especialista en propiedades residenciales de alta gama.',
          languages: ['Español', 'Inglés'],
          fee: '3%',
          responseTime: '< 2 horas',
          successRate: 95,
          available: true,
          portfolio: {
            totalSales: 156,
            averagePrice: 420000000,
            closingTime: 45
          }
        },
        {
          id: 2,
          name: 'Carlos Mendoza Silva',
          company: 'Realty Expert',
          license: 'LIC-2022-045',
          rating: 4.6,
          reviews: 89,
          specialties: ['Oficinas', 'Locales Comerciales'],
          location: 'Bogotá, Centro',
          experience: '12 años',
          phone: '+57 301 987 6543',
          email: 'carlos.mendoza@realtyexpert.com',
          photo: 'https://via.placeholder.com/80x80?text=CM',
          verified: true,
          description: 'Experto en propiedades comerciales e inversión inmobiliaria.',
          languages: ['Español'],
          fee: '2.5%',
          responseTime: '< 4 horas',
          successRate: 92,
          available: true,
          portfolio: {
            totalSales: 203,
            averagePrice: 680000000,
            closingTime: 38
          }
        },
        {
          id: 3,
          name: 'Ana Patricia Ruiz',
          company: 'Century 21 Colombia',
          license: 'LIC-2021-123',
          rating: 4.9,
          reviews: 203,
          specialties: ['Casas', 'Terrenos', 'Proyectos'],
          location: 'Medellín, El Poblado',
          experience: '15 años',
          phone: '+57 315 555 7890',
          email: 'ana.ruiz@century21.com',
          photo: 'https://via.placeholder.com/80x80?text=AR',
          verified: true,
          description: 'Líder en ventas con reconocimiento nacional.',
          languages: ['Español', 'Inglés', 'Portugués'],
          fee: '3.5%',
          responseTime: '< 1 hora',
          successRate: 98,
          available: true,
          portfolio: {
            totalSales: 321,
            averagePrice: 520000000,
            closingTime: 32
          }
        }
      ];

      // Filtrar por ubicación y tipo de propiedad
      const filtered = mockAgents.filter(agent => 
        (location ? agent.location.toLowerCase().includes(location.toLowerCase()) : true) &&
        (propertyType ? agent.specialties.some(s => s.toLowerCase().includes(propertyType.toLowerCase())) : true)
      );

      return filtered;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al cargar agentes');
    }
  }
);

export const requestAgent = createAsyncThunk(
  'agents/request',
  async ({ agentId, propertyId, message, contactInfo }, { rejectWithValue }) => {
    try {
      // Aquí iría la llamada a la API real
      // const response = await agentsAPI.requestAgent({ agentId, propertyId, message, contactInfo });
      
      // Simulamos la respuesta
      const request = {
        id: Date.now(),
        agentId,
        propertyId,
        message,
        contactInfo,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expectedResponse: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 horas
      };

      return request;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al enviar solicitud');
    }
  }
);

export const fetchAgentRequests = createAsyncThunk(
  'agents/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      // Aquí iría la llamada a la API real
      // const response = await agentsAPI.getUserRequests();
      
      // Simulamos datos de solicitudes
      const mockRequests = [
        {
          id: 1,
          agent: {
            id: 1,
            name: 'María González Rodríguez',
            company: 'Inmobiliaria Premium',
            photo: 'https://via.placeholder.com/50x50?text=MG'
          },
          property: {
            id: 1,
            title: 'Apartamento Moderno Zona Norte',
            location: 'Bogotá, Zona Norte',
            price: 350000000
          },
          status: 'accepted',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          respondedAt: new Date(Date.now() - 43200000).toISOString(),
          message: 'Interesado en contar con asesoría profesional para esta propiedad.',
          agentResponse: 'Perfecto, me comunicaré contigo hoy mismo para coordinar una cita.'
        },
        {
          id: 2,
          agent: {
            id: 2,
            name: 'Carlos Mendoza Silva',
            company: 'Realty Expert',
            photo: 'https://via.placeholder.com/50x50?text=CM'
          },
          property: {
            id: 2,
            title: 'Oficina Ejecutiva Centro',
            location: 'Bogotá, Centro',
            price: 420000000
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          message: 'Busco asesoría para inversión en propiedad comercial.',
          agentResponse: null
        }
      ];

      return mockRequests;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al cargar solicitudes');
    }
  }
);

export const fetchAgentProfile = createAsyncThunk(
  'agents/fetchProfile',
  async (agentId, { rejectWithValue }) => {
    try {
      // Aquí iría la llamada a la API real
      // const response = await agentsAPI.getAgentProfile(agentId);
      
      // Simulamos datos detallados del agente
      const mockProfile = {
        id: agentId,
        name: 'María González Rodríguez',
        company: 'Inmobiliaria Premium',
        license: 'LIC-2023-001',
        rating: 4.8,
        reviews: 127,
        totalReviews: 127,
        specialties: ['Apartamentos', 'Casas Familiares', 'Propiedades de Lujo'],
        location: 'Bogotá, Zona Norte',
        coverage: ['Bogotá', 'Chía', 'Cajicá', 'Zipaquirá'],
        experience: '8 años',
        joinDate: '2016-03-15',
        phone: '+57 300 123 4567',
        email: 'maria.gonzalez@premium.com',
        photo: 'https://via.placeholder.com/150x150?text=MG',
        verified: true,
        description: 'Especialista en propiedades residenciales de alta gama con más de 8 años de experiencia en el mercado inmobiliario bogotano. Reconocida por su profesionalismo y capacidad de negociación.',
        languages: ['Español', 'Inglés'],
        fee: '3%',
        responseTime: '< 2 horas',
        successRate: 95,
        available: true,
        portfolio: {
          totalSales: 156,
          totalValue: 65520000000,
          averagePrice: 420000000,
          averageClosingTime: 45,
          topSale: 1200000000,
          thisYearSales: 23,
          satisfactionRate: 98
        },
        certifications: [
          'Especialización en Avalúos Inmobiliarios',
          'Certificación en Negociación Inmobiliaria',
          'Curso Avanzado en Marketing Digital'
        ],
        achievements: [
          'Top Agent 2023 - Inmobiliaria Premium',
          'Mayor Volumen de Ventas 2022',
          'Certificación de Excelencia en Servicio'
        ],
        recentReviews: [
          {
            id: 1,
            client: 'Juan Pérez',
            rating: 5,
            comment: 'Excelente profesional, muy atenta y conocedora del mercado.',
            date: '2024-09-15',
            property: 'Apartamento en Zona Rosa'
          },
          {
            id: 2,
            client: 'Ana Martínez',
            rating: 5,
            comment: 'Me ayudó a encontrar la casa perfecta. Altamente recomendada.',
            date: '2024-08-22',
            property: 'Casa en La Calera'
          }
        ]
      };

      return mockProfile;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al cargar perfil del agente');
    }
  }
);

const initialState = {
  // Lista de agentes disponibles
  availableAgents: [],
  // Solicitudes de agentes del usuario
  userRequests: [],
  // Perfil detallado del agente seleccionado
  selectedAgentProfile: null,
  // Estados de carga
  loading: {
    fetchingAgents: false,
    requesting: false,
    fetchingRequests: false,
    fetchingProfile: false
  },
  // Errores
  error: null,
  // Filtros de búsqueda
  filters: {
    location: '',
    specialties: [],
    rating: 0,
    experience: '',
    verified: false,
    available: true
  },
  // Configuraciones
  searchRadius: 50, // km
  maxResults: 20
};

const agentsSlice = createSlice({
  name: 'agents',
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
    
    // Seleccionar agente
    selectAgent: (state, action) => {
      state.selectedAgent = action.payload;
    },
    
    // Limpiar agente seleccionado
    clearSelectedAgent: (state) => {
      state.selectedAgent = null;
      state.selectedAgentProfile = null;
    },
    
    // Actualizar estado de solicitud
    updateRequestStatus: (state, action) => {
      const { requestId, status, agentResponse } = action.payload;
      const request = state.userRequests.find(r => r.id === requestId);
      if (request) {
        request.status = status;
        if (agentResponse) {
          request.agentResponse = agentResponse;
          request.respondedAt = new Date().toISOString();
        }
      }
    },
    
    // Marcar agente como contactado
    markAgentContacted: (state, action) => {
      const { agentId } = action.payload;
      const agent = state.availableAgents.find(a => a.id === agentId);
      if (agent) {
        agent.lastContacted = new Date().toISOString();
      }
    },
    
    // Agregar reseña a agente
    addAgentReview: (state, action) => {
      const { agentId, review } = action.payload;
      const agent = state.availableAgents.find(a => a.id === agentId);
      if (agent) {
        agent.reviews += 1;
        // Recalcular rating (simplificado)
        agent.rating = ((agent.rating * (agent.reviews - 1)) + review.rating) / agent.reviews;
      }
    }
  },
  
  extraReducers: (builder) => {
    // Fetch Available Agents
    builder
      .addCase(fetchAvailableAgents.pending, (state) => {
        state.loading.fetchingAgents = true;
        state.error = null;
      })
      .addCase(fetchAvailableAgents.fulfilled, (state, action) => {
        state.loading.fetchingAgents = false;
        state.availableAgents = action.payload;
      })
      .addCase(fetchAvailableAgents.rejected, (state, action) => {
        state.loading.fetchingAgents = false;
        state.error = action.payload;
      });
    
    // Request Agent
    builder
      .addCase(requestAgent.pending, (state) => {
        state.loading.requesting = true;
        state.error = null;
      })
      .addCase(requestAgent.fulfilled, (state, action) => {
        state.loading.requesting = false;
        state.userRequests.unshift(action.payload);
      })
      .addCase(requestAgent.rejected, (state, action) => {
        state.loading.requesting = false;
        state.error = action.payload;
      });
    
    // Fetch Agent Requests
    builder
      .addCase(fetchAgentRequests.pending, (state) => {
        state.loading.fetchingRequests = true;
        state.error = null;
      })
      .addCase(fetchAgentRequests.fulfilled, (state, action) => {
        state.loading.fetchingRequests = false;
        state.userRequests = action.payload;
      })
      .addCase(fetchAgentRequests.rejected, (state, action) => {
        state.loading.fetchingRequests = false;
        state.error = action.payload;
      });
    
    // Fetch Agent Profile
    builder
      .addCase(fetchAgentProfile.pending, (state) => {
        state.loading.fetchingProfile = true;
        state.error = null;
      })
      .addCase(fetchAgentProfile.fulfilled, (state, action) => {
        state.loading.fetchingProfile = false;
        state.selectedAgentProfile = action.payload;
      })
      .addCase(fetchAgentProfile.rejected, (state, action) => {
        state.loading.fetchingProfile = false;
        state.error = action.payload;
      });
  }
});

// Acciones
export const {
  clearError,
  setFilters,
  clearFilters,
  selectAgent,
  clearSelectedAgent,
  updateRequestStatus,
  markAgentContacted,
  addAgentReview
} = agentsSlice.actions;

// Selectores
export const selectAvailableAgents = (state) => state.agents.availableAgents;
export const selectUserRequests = (state) => state.agents.userRequests;
export const selectSelectedAgentProfile = (state) => state.agents.selectedAgentProfile;
export const selectAgentsLoading = (state) => state.agents.loading;
export const selectAgentsError = (state) => state.agents.error;
export const selectAgentsFilters = (state) => state.agents.filters;

// Selectores derivados
export const selectFilteredAgents = (state) => {
  const { availableAgents, filters } = state.agents;
  
  return availableAgents.filter(agent => {
    // Filtrar por ubicación
    if (filters.location && !agent.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filtrar por especialidades
    if (filters.specialties.length > 0) {
      const hasMatchingSpecialty = filters.specialties.some(specialty =>
        agent.specialties.some(agentSpecialty =>
          agentSpecialty.toLowerCase().includes(specialty.toLowerCase())
        )
      );
      if (!hasMatchingSpecialty) return false;
    }
    
    // Filtrar por rating mínimo
    if (filters.rating > 0 && agent.rating < filters.rating) {
      return false;
    }
    
    // Filtrar por verificación
    if (filters.verified && !agent.verified) {
      return false;
    }
    
    // Filtrar por disponibilidad
    if (filters.available && !agent.available) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Ordenar por rating descendente
    return b.rating - a.rating;
  });
};

export const selectPendingRequests = (state) => {
  return state.agents.userRequests.filter(request => request.status === 'pending');
};

export const selectAgentStats = (state) => {
  const { availableAgents, userRequests } = state.agents;
  
  return {
    totalAgents: availableAgents.length,
    verifiedAgents: availableAgents.filter(a => a.verified).length,
    averageRating: availableAgents.length > 0 
      ? (availableAgents.reduce((sum, a) => sum + a.rating, 0) / availableAgents.length).toFixed(1)
      : 0,
    totalRequests: userRequests.length,
    pendingRequests: userRequests.filter(r => r.status === 'pending').length,
    acceptedRequests: userRequests.filter(r => r.status === 'accepted').length
  };
};

export default agentsSlice.reducer;