import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API functions
const mockAppointmentsAPI = {
  fetchAppointments: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        property: {
          id: 1,
          title: 'Apartamento Moderno Zona Norte',
          location: 'Bogotá, Zona Norte',
          price: 350000000,
          image: 'https://via.placeholder.com/200x150?text=Apt1',
          seller: { name: 'María González', phone: '+57 300 123 4567' }
        },
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '10:00',
        visitor: {
          name: 'Ana García',
          phone: '+57 315 987 6543',
          email: 'ana@email.com',
          notes: 'Interesada en compra inmediata, busca apartamento para familia joven'
        },
        status: 'scheduled',
        confirmationCode: 'VISIT-123456',
        scheduledAt: new Date(Date.now() - 3600000).toISOString(),
        type: 'incoming'
      },
      {
        id: 2,
        property: {
          id: 2,
          title: 'Casa Familiar con Jardín',
          location: 'Medellín, El Poblado',
          price: 580000000,
          image: 'https://via.placeholder.com/200x150?text=Casa1',
          seller: { name: 'Carlos Rodríguez', phone: '+57 301 555 7890' }
        },
        date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        time: '15:30',
        visitor: {
          name: 'Roberto Silva',
          phone: '+57 320 111 2222',
          email: 'roberto@email.com',
          notes: 'Primera visita, tiene preguntas sobre financiación'
        },
        status: 'confirmed',
        confirmationCode: 'VISIT-789012',
        scheduledAt: new Date(Date.now() - 86400000).toISOString(),
        confirmedAt: new Date(Date.now() - 43200000).toISOString(),
        type: 'incoming'
      },
      {
        id: 3,
        property: {
          id: 3,
          title: 'Oficina Ejecutiva Centro',
          location: 'Bogotá, Centro',
          price: 420000000,
          image: 'https://via.placeholder.com/200x150?text=Ofi1',
          seller: { name: 'Ana Martínez', phone: '+57 302 444 5555' }
        },
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        time: '14:00',
        visitor: {
          name: 'Luisa Fernández',
          phone: '+57 318 666 7777',
          email: 'luisa@email.com',
          notes: 'Inversión comercial, necesita información sobre rentabilidad'
        },
        status: 'completed',
        confirmationCode: 'VISIT-345678',
        scheduledAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        confirmedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
        completedAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
        type: 'outgoing'
      }
    ];
  },

  scheduleAppointment: async (appointmentData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: Date.now(),
      ...appointmentData,
      status: 'scheduled',
      confirmationCode: `VISIT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      scheduledAt: new Date().toISOString(),
      type: 'outgoing'
    };
  },

  updateAppointment: async (appointmentId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: appointmentId,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  },

  cancelAppointment: async (appointmentId, reason) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: appointmentId,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelReason: reason
    };
  },

  confirmAppointment: async (appointmentId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: appointmentId,
      status: 'confirmed',
      confirmedAt: new Date().toISOString()
    };
  },

  completeAppointment: async (appointmentId, notes) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: appointmentId,
      status: 'completed',
      completedAt: new Date().toISOString(),
      completionNotes: notes
    };
  },

  rescheduleAppointment: async (appointmentId, newDate, newTime) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: appointmentId,
      date: newDate,
      time: newTime,
      status: 'rescheduled',
      rescheduledAt: new Date().toISOString(),
      originalDate: new Date().toISOString(),
      originalTime: '10:00'
    };
  },

  getAvailableSlots: async (date, propertyId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Simular slots disponibles
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00'
    ];
    
    // Simular algunos slots ocupados
    const occupiedSlots = ['10:00', '15:30', '16:00'];
    return baseSlots.filter(slot => !occupiedSlots.includes(slot));
  }
};

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (userId, { rejectWithValue }) => {
    try {
      const appointments = await mockAppointmentsAPI.fetchAppointments(userId);
      return appointments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scheduleAppointment = createAsyncThunk(
  'appointments/scheduleAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const appointment = await mockAppointmentsAPI.scheduleAppointment(appointmentData);
      return appointment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ appointmentId, updates }, { rejectWithValue }) => {
    try {
      const updatedAppointment = await mockAppointmentsAPI.updateAppointment(appointmentId, updates);
      return updatedAppointment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async ({ appointmentId, reason }, { rejectWithValue }) => {
    try {
      const cancelledAppointment = await mockAppointmentsAPI.cancelAppointment(appointmentId, reason);
      return cancelledAppointment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const confirmAppointment = createAsyncThunk(
  'appointments/confirmAppointment',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const confirmedAppointment = await mockAppointmentsAPI.confirmAppointment(appointmentId);
      return confirmedAppointment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeAppointment = createAsyncThunk(
  'appointments/completeAppointment',
  async ({ appointmentId, notes }, { rejectWithValue }) => {
    try {
      const completedAppointment = await mockAppointmentsAPI.completeAppointment(appointmentId, notes);
      return completedAppointment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rescheduleAppointment = createAsyncThunk(
  'appointments/rescheduleAppointment',
  async ({ appointmentId, newDate, newTime }, { rejectWithValue }) => {
    try {
      const rescheduledAppointment = await mockAppointmentsAPI.rescheduleAppointment(appointmentId, newDate, newTime);
      return rescheduledAppointment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAvailableSlots = createAsyncThunk(
  'appointments/getAvailableSlots',
  async ({ date, propertyId }, { rejectWithValue }) => {
    try {
      const slots = await mockAppointmentsAPI.getAvailableSlots(date, propertyId);
      return { date, propertyId, slots };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  appointments: [],
  availableSlots: {},
  loading: {
    fetch: false,
    schedule: false,
    update: false,
    cancel: false,
    confirm: false,
    complete: false,
    reschedule: false,
    slots: false
  },
  error: null,
  filters: {
    status: 'all',
    dateRange: 'all',
    propertyType: 'all'
  },
  sortBy: 'date',
  sortOrder: 'asc'
};

// Slice
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
    },
    clearAvailableSlots: (state) => {
      state.availableSlots = {};
    },
    updateAppointmentStatus: (state, action) => {
      const { appointmentId, status, additionalData = {} } = action.payload;
      const appointment = state.appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        appointment.status = status;
        Object.assign(appointment, additionalData);
      }
    },
    addAppointmentNote: (state, action) => {
      const { appointmentId, note } = action.payload;
      const appointment = state.appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        if (!appointment.notes) appointment.notes = [];
        appointment.notes.push({
          id: Date.now(),
          text: note,
          createdAt: new Date().toISOString()
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Schedule appointment
      .addCase(scheduleAppointment.pending, (state) => {
        state.loading.schedule = true;
        state.error = null;
      })
      .addCase(scheduleAppointment.fulfilled, (state, action) => {
        state.loading.schedule = false;
        state.appointments.push(action.payload);
      })
      .addCase(scheduleAppointment.rejected, (state, action) => {
        state.loading.schedule = false;
        state.error = action.payload;
      })

      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = { ...state.appointments[index], ...action.payload };
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      // Cancel appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.loading.cancel = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading.cancel = false;
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = { ...state.appointments[index], ...action.payload };
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading.cancel = false;
        state.error = action.payload;
      })

      // Confirm appointment
      .addCase(confirmAppointment.pending, (state) => {
        state.loading.confirm = true;
        state.error = null;
      })
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        state.loading.confirm = false;
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = { ...state.appointments[index], ...action.payload };
        }
      })
      .addCase(confirmAppointment.rejected, (state, action) => {
        state.loading.confirm = false;
        state.error = action.payload;
      })

      // Complete appointment
      .addCase(completeAppointment.pending, (state) => {
        state.loading.complete = true;
        state.error = null;
      })
      .addCase(completeAppointment.fulfilled, (state, action) => {
        state.loading.complete = false;
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = { ...state.appointments[index], ...action.payload };
        }
      })
      .addCase(completeAppointment.rejected, (state, action) => {
        state.loading.complete = false;
        state.error = action.payload;
      })

      // Reschedule appointment
      .addCase(rescheduleAppointment.pending, (state) => {
        state.loading.reschedule = true;
        state.error = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.loading.reschedule = false;
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = { ...state.appointments[index], ...action.payload };
        }
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.loading.reschedule = false;
        state.error = action.payload;
      })

      // Get available slots
      .addCase(getAvailableSlots.pending, (state) => {
        state.loading.slots = true;
        state.error = null;
      })
      .addCase(getAvailableSlots.fulfilled, (state, action) => {
        state.loading.slots = false;
        const { date, propertyId, slots } = action.payload;
        state.availableSlots[`${propertyId}-${date}`] = slots;
      })
      .addCase(getAvailableSlots.rejected, (state, action) => {
        state.loading.slots = false;
        state.error = action.payload;
      });
  }
});

// Action creators
export const {
  clearError,
  setFilters,
  setSorting,
  clearAvailableSlots,
  updateAppointmentStatus,
  addAppointmentNote
} = appointmentsSlice.actions;

// Selectors
export const selectAppointments = (state) => state.appointments.appointments;
export const selectAppointmentsLoading = (state) => state.appointments.loading;
export const selectAppointmentsError = (state) => state.appointments.error;
export const selectAppointmentFilters = (state) => state.appointments.filters;
export const selectAvailableSlots = (state) => state.appointments.availableSlots;

export const selectAppointmentsByStatus = (state, status) => {
  const appointments = selectAppointments(state);
  if (status === 'scheduled') {
    return appointments.filter(apt => ['scheduled', 'confirmed'].includes(apt.status));
  }
  return appointments.filter(apt => apt.status === status);
};

export const selectUpcomingAppointments = (state) => {
  const appointments = selectAppointments(state);
  const now = new Date();
  return appointments.filter(apt => {
    const appointmentDateTime = new Date(`${apt.date}T${apt.time}`);
    return appointmentDateTime > now && ['scheduled', 'confirmed'].includes(apt.status);
  });
};

export const selectAppointmentById = (state, appointmentId) => {
  return selectAppointments(state).find(apt => apt.id === appointmentId);
};

export const selectAppointmentStats = (state) => {
  const appointments = selectAppointments(state);
  return {
    total: appointments.length,
    scheduled: appointments.filter(apt => ['scheduled', 'confirmed'].includes(apt.status)).length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    upcoming: selectUpcomingAppointments(state).length
  };
};

export const selectFilteredAndSortedAppointments = (state) => {
  const appointments = selectAppointments(state);
  const { filters, sortBy, sortOrder } = state.appointments;

  let filtered = [...appointments];

  // Apply status filter
  if (filters.status !== 'all') {
    if (filters.status === 'scheduled') {
      filtered = filtered.filter(apt => ['scheduled', 'confirmed'].includes(apt.status));
    } else {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }
  }

  // Apply date range filter
  if (filters.dateRange !== 'all') {
    const now = new Date();
    switch (filters.dateRange) {
      case 'today':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= now && aptDate <= weekFromNow;
        });
        break;
      case 'month':
        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= now && aptDate <= monthFromNow;
        });
        break;
    }
  }

  // Sort appointments
  filtered.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(`${a.date}T${a.time}`);
        bValue = new Date(`${b.date}T${b.time}`);
        break;
      case 'property':
        aValue = a.property.title.toLowerCase();
        bValue = b.property.title.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'visitor':
        aValue = a.visitor.name.toLowerCase();
        bValue = b.visitor.name.toLowerCase();
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
};

export default appointmentsSlice.reducer;