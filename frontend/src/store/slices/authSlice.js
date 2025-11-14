import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@services/authService';
import { setAuthToken } from '@services/apiClient';
import { toast } from 'react-toastify';
import { getUserPermissions, getUserAccessLevel } from '@utils/permissionHelpers';
import { syncEmailVerificationStatus } from './verificationSlice';

// Thunks asíncronos
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // 1. Login
      const response = await authService.login(email, password);
      // Establecer el token en apiClient
      if (response.data.token) {
        setAuthToken(response.data.token);
      }
      // 2. Obtener perfil completo
      const profileResponse = await authService.getProfile();
      // 3. Combinar datos de login y perfil
      return {
        ...response.data,
        user: profileResponse.data.data // el backend retorna { data: { ...user, ...profile } }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al iniciar sesión');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      // Establecer el token en apiClient
      if (response.data.token) {
        setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al registrarse');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await authService.refreshToken(auth.refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue('Sesión expirada');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Error al actualizar perfil');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  // Información adicional de permisos y verificaciones
  userPermissions: [],
  accessLevel: 'basic'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.userPermissions = [];
      state.accessLevel = 'basic';
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Limpiar el token del apiClient
      setAuthToken(null);
      
      // Desconectar Socket.io
      import('@services/socketService').then(({ default: socketService }) => {
        socketService.disconnect();
      });
      
      toast.info('Sesión cerrada');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Actualizar permisos y nivel de acceso cuando se actualiza el usuario
        state.userPermissions = getUserPermissions(state.user);
        state.accessLevel = getUserAccessLevel(state.user);
      }
    },
    updateUserVerifications: (state, action) => {
      if (state.user) {
        state.user.verifications = { ...state.user.verifications, ...action.payload };
        // Recalcular permisos y nivel de acceso
        state.userPermissions = getUserPermissions(state.user);
        state.accessLevel = getUserAccessLevel(state.user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;

        // Calcular permisos y nivel de acceso
        state.userPermissions = getUserPermissions(action.payload.user);
        state.accessLevel = getUserAccessLevel(action.payload.user);

        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);

        // Conectar Socket.io con el token
        import('@services/socketService').then(({ default: socketService }) => {
          socketService.connect(action.payload.token);
        });


        toast.success(`¡Bienvenido, ${action.payload.user.firstName}!`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        toast.error(action.payload);
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        
        // Calcular permisos y nivel de acceso
        state.userPermissions = getUserPermissions(action.payload.user);
        state.accessLevel = getUserAccessLevel(action.payload.user);
        
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        
        // Conectar Socket.io con el token
        import('@services/socketService').then(({ default: socketService }) => {
          socketService.connect(action.payload.token);
        });
        
        toast.success('¡Registro exitoso!');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        toast.warning('Sesión expirada. Por favor, inicia sesión nuevamente.');
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Merge profundo para preferences
        if (action.payload.data && typeof action.payload.data === 'object') {
          state.user = {
            ...state.user,
            ...action.payload.data,
            preferences: {
              ...(state.user?.preferences || {}),
              ...(action.payload.data.preferences || {})
            }
          };
        } else {
          state.user = { ...state.user, ...action.payload.data };
        }
        toast.success('Perfil actualizado correctamente');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout, clearError, updateUserData, updateUserVerifications } = authSlice.actions;

// Selectores
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserPermissions = (state) => state.auth.userPermissions;
export const selectUserAccessLevel = (state) => state.auth.accessLevel;

export default authSlice.reducer;