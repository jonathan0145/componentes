import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertiesService from '@services/propertiesService';
import { toast } from 'react-toastify';

// Thunks asíncronos
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await propertiesService.getProperties(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al cargar propiedades');
    }
  }
);

export const fetchProperty = createAsyncThunk(
  'properties/fetchProperty',
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await propertiesService.getProperty(propertyId);
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
        state.currentProperty = action.payload;
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