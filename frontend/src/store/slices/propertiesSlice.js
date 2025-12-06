import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertiesService from '@services/propertiesService';
import { toast } from 'react-toastify';

// Thunks asíncronos
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await propertiesService.getProperties(params);
      let data = response.data;
      // Si la respuesta es un objeto con clave properties, usar ese array
      let propertiesArr = Array.isArray(data) ? data : (data.properties || []);
      // Parsear imágenes si vienen como string
      propertiesArr = propertiesArr.map(p => {
        let imgs = typeof p.images === 'string' ? (p.images ? JSON.parse(p.images) : []) : (p.images || []);
        // Si es array de objetos, extraer url; si es array de strings, dejar igual
        if (Array.isArray(imgs) && imgs.length > 0) {
          if (typeof imgs[0] === 'object' && imgs[0] !== null && imgs[0].url) {
            imgs = imgs.map(img => img.url);
          }
        }
        return { ...p, images: imgs };
      });
      // Retornar en el formato esperado por el slice
      return { properties: propertiesArr };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al cargar propiedades');
    }
  }
);

export const fetchProperty = createAsyncThunk(
  'properties/fetchProperty',
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await propertiesService.getPropertyById(propertyId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al cargar propiedad');
    }
  }
);

const initialState = {
  properties: [],
  currentProperty: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    status: 'active',
  },
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Properties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Fetch Property
      .addCase(fetchProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperty.fulfilled, (state, action) => {
        state.loading = false;
        let property = action.payload?.data || action.payload;
        // Parsear images y normalizar a array de strings (urls)
        if (property && property.images) {
          let imgs = typeof property.images === 'string'
            ? (property.images ? JSON.parse(property.images) : [])
            : (property.images || []);
          if (Array.isArray(imgs) && imgs.length > 0) {
            if (typeof imgs[0] === 'object' && imgs[0] !== null && imgs[0].url) {
              imgs = imgs.map(img => img.url);
            }
          }
          property.images = imgs;
        } else if (property) {
          property.images = [];
        }
        state.currentProperty = property;
      })
      .addCase(fetchProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { setFilters, clearFilters, clearCurrentProperty, clearError } = propertiesSlice.actions;
export default propertiesSlice.reducer;