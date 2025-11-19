import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import privacyService from '../../services/privacyService';

// Thunks
export const fetchPrivacy = createAsyncThunk(
  'privacy/fetchPrivacy',
  async (_, thunkAPI) => {
    try {
      const data = await privacyService.getPrivacy();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error al obtener privacidad');
    }
  }
);

export const savePrivacy = createAsyncThunk(
  'privacy/savePrivacy',
  async (payload, thunkAPI) => {
    try {
      const data = await privacyService.savePrivacy(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error al guardar privacidad');
    }
  }
);

const privacySlice = createSlice({
  name: 'privacy',
  initialState: {
    privacy: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrivacy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrivacy.fulfilled, (state, action) => {
        state.loading = false;
        state.privacy = action.payload;
      })
      .addCase(fetchPrivacy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(savePrivacy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePrivacy.fulfilled, (state, action) => {
        state.loading = false;
        state.privacy = action.payload;
      })
      .addCase(savePrivacy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Selectores
export const selectPrivacy = (state) => state.privacy.privacy;
export const selectPrivacyLoading = (state) => state.privacy.loading;
export const selectPrivacyError = (state) => state.privacy.error;

export default privacySlice.reducer;
