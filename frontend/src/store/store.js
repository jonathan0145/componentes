import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import propertiesReducer from './slices/propertiesSlice';
import notificationsReducer from './slices/notificationsSlice';
import offersReducer from './slices/offersSlice';
import agentsReducer from './slices/agentsSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import verificationReducer from './slices/verificationSlice';
import { setAuthToken } from '@services/apiClient';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    properties: propertiesReducer,
    notifications: notificationsReducer,
    offers: offersReducer,
    agents: agentsReducer,
    appointments: appointmentsReducer,
    verification: verificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Inicializar token del localStorage en el apiClient al cargar la app
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export default store;