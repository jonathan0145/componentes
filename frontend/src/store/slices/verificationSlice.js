import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API functions
const mockVerificationAPI = {
  getUserVerifications: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      email: { 
        status: 'verified', 
        verifiedAt: '2024-10-01T10:00:00.000Z',
        attempts: 1,
        lastAttempt: '2024-10-01T09:58:00.000Z'
      },
      phone: { 
        status: 'pending', 
        verifiedAt: null,
        attempts: 1,
        lastAttempt: '2024-10-08T15:30:00.000Z'
      },
      identity: { 
        status: 'not_started', 
        verifiedAt: null,
        documents: [],
        reviewNotes: null
      },
      professional: { 
        status: 'pending', 
        verifiedAt: null,
        documents: [
          {
            id: 1,
            name: 'licencia_agente.pdf',
            uploadedAt: '2024-10-07T14:20:00.000Z',
            status: 'under_review'
          }
        ],
        reviewNotes: 'Documentos en proceso de revisión'
      }
    };
  },

  sendEmailVerification: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      message: 'Código enviado exitosamente',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutos
    };
  },

  sendPhoneVerification: async (phoneNumber) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      success: true,
      message: 'SMS enviado exitosamente',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutos
    };
  },

  verifyCode: async (type, code) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simular validación de código
    if (code === '123456') {
      return {
        success: true,
        verifiedAt: new Date().toISOString(),
        message: 'Verificación exitosa'
      };
    } else {
      throw new Error('Código de verificación incorrecto');
    }
  },

  uploadDocuments: async (type, files) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const uploadedDocuments = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: 'under_review'
    }));

    return {
      success: true,
      documents: uploadedDocuments,
      message: 'Documentos subidos exitosamente'
    };
  },

  getVerificationBadges: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        type: 'email',
        name: 'Email Verificado',
        icon: 'envelope',
        color: 'primary',
        earnedAt: '2024-10-01T10:00:00.000Z'
      },
      {
        type: 'phone',
        name: 'Teléfono Verificado',
        icon: 'phone',
        color: 'success',
        earnedAt: null
      },
      {
        type: 'identity',
        name: 'Identidad Verificada',
        icon: 'id-card',
        color: 'info',
        earnedAt: null
      },
      {
        type: 'professional',
        name: 'Agente Certificado',
        icon: 'user-tie',
        color: 'warning',
        earnedAt: null
      }
    ];
  }
};

// Async thunks
export const fetchUserVerifications = createAsyncThunk(
  'verification/fetchUserVerifications',
  async (userId, { rejectWithValue }) => {
    try {
      const verifications = await mockVerificationAPI.getUserVerifications(userId);
      return verifications;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendEmailVerification = createAsyncThunk(
  'verification/sendEmailVerification',
  async (email, { rejectWithValue }) => {
    try {
      const result = await mockVerificationAPI.sendEmailVerification(email);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendPhoneVerification = createAsyncThunk(
  'verification/sendPhoneVerification',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const result = await mockVerificationAPI.sendPhoneVerification(phoneNumber);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyCode = createAsyncThunk(
  'verification/verifyCode',
  async ({ type, code }, { rejectWithValue }) => {
    try {
      const result = await mockVerificationAPI.verifyCode(type, code);
      return { type, ...result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadDocuments = createAsyncThunk(
  'verification/uploadDocuments',
  async ({ type, files }, { rejectWithValue }) => {
    try {
      const result = await mockVerificationAPI.uploadDocuments(type, files);
      return { type, ...result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVerificationBadges = createAsyncThunk(
  'verification/fetchVerificationBadges',
  async (userId, { rejectWithValue }) => {
    try {
      const badges = await mockVerificationAPI.getVerificationBadges(userId);
      return badges;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  verifications: {
    email: { status: 'not_started', verifiedAt: null, attempts: 0 },
    phone: { status: 'not_started', verifiedAt: null, attempts: 0 },
    identity: { status: 'not_started', verifiedAt: null, documents: [] },
    professional: { status: 'not_started', verifiedAt: null, documents: [] }
  },
  badges: [],
  loading: {
    fetch: false,
    emailVerification: false,
    phoneVerification: false,
    codeVerification: false,
    documentUpload: false,
    badges: false
  },
  error: null,
  pendingVerifications: [],
  verificationHistory: []
};

// Slice
const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetVerificationState: (state) => {
      state.verifications = initialState.verifications;
      state.error = null;
    },
    updateVerificationAttempt: (state, action) => {
      const { type, attemptData } = action.payload;
      if (state.verifications[type]) {
        state.verifications[type].attempts += 1;
        state.verifications[type].lastAttempt = new Date().toISOString();
      }
    },
    addVerificationNote: (state, action) => {
      const { type, note } = action.payload;
      if (state.verifications[type]) {
        if (!state.verifications[type].notes) {
          state.verifications[type].notes = [];
        }
        state.verifications[type].notes.push({
          id: Date.now(),
          text: note,
          createdAt: new Date().toISOString()
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user verifications
      .addCase(fetchUserVerifications.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchUserVerifications.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.verifications = { ...state.verifications, ...action.payload };
      })
      .addCase(fetchUserVerifications.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Send email verification
      .addCase(sendEmailVerification.pending, (state) => {
        state.loading.emailVerification = true;
        state.error = null;
      })
      .addCase(sendEmailVerification.fulfilled, (state, action) => {
        state.loading.emailVerification = false;
        state.verifications.email.status = 'pending';
        state.verifications.email.attempts += 1;
        state.verifications.email.lastAttempt = new Date().toISOString();
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.loading.emailVerification = false;
        state.error = action.payload;
      })

      // Send phone verification
      .addCase(sendPhoneVerification.pending, (state) => {
        state.loading.phoneVerification = true;
        state.error = null;
      })
      .addCase(sendPhoneVerification.fulfilled, (state, action) => {
        state.loading.phoneVerification = false;
        state.verifications.phone.status = 'pending';
        state.verifications.phone.attempts += 1;
        state.verifications.phone.lastAttempt = new Date().toISOString();
      })
      .addCase(sendPhoneVerification.rejected, (state, action) => {
        state.loading.phoneVerification = false;
        state.error = action.payload;
      })

      // Verify code
      .addCase(verifyCode.pending, (state) => {
        state.loading.codeVerification = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.loading.codeVerification = false;
        const { type, verifiedAt } = action.payload;
        state.verifications[type].status = 'verified';
        state.verifications[type].verifiedAt = verifiedAt;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading.codeVerification = false;
        state.error = action.payload;
      })

      // Upload documents
      .addCase(uploadDocuments.pending, (state) => {
        state.loading.documentUpload = true;
        state.error = null;
      })
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        state.loading.documentUpload = false;
        const { type, documents } = action.payload;
        state.verifications[type].status = 'pending';
        state.verifications[type].documents = documents;
      })
      .addCase(uploadDocuments.rejected, (state, action) => {
        state.loading.documentUpload = false;
        state.error = action.payload;
      })

      // Fetch verification badges
      .addCase(fetchVerificationBadges.pending, (state) => {
        state.loading.badges = true;
        state.error = null;
      })
      .addCase(fetchVerificationBadges.fulfilled, (state, action) => {
        state.loading.badges = false;
        state.badges = action.payload;
      })
      .addCase(fetchVerificationBadges.rejected, (state, action) => {
        state.loading.badges = false;
        state.error = action.payload;
      });
  }
});

// Action creators
export const {
  clearError,
  resetVerificationState,
  updateVerificationAttempt,
  addVerificationNote
} = verificationSlice.actions;

// Selectors
export const selectVerifications = (state) => state.verification.verifications;
export const selectVerificationLoading = (state) => state.verification.loading;
export const selectVerificationError = (state) => state.verification.error;
export const selectVerificationBadges = (state) => state.verification.badges;

export const selectVerificationByType = (state, type) => {
  return state.verification.verifications[type];
};

export const selectVerificationProgress = (state) => {
  const verifications = Object.values(state.verification.verifications);
  const verified = verifications.filter(v => v.status === 'verified').length;
  return {
    completed: verified,
    total: verifications.length,
    percentage: (verified / verifications.length) * 100
  };
};

export const selectVerificationLevel = (state) => {
  const verified = Object.values(state.verification.verifications)
    .filter(v => v.status === 'verified').length;
  
  if (verified === 0) return { level: 'Básico', color: 'secondary', score: 0 };
  if (verified <= 2) return { level: 'Intermedio', color: 'warning', score: 25 };
  if (verified === 3) return { level: 'Avanzado', color: 'info', score: 75 };
  return { level: 'Completo', color: 'success', score: 100 };
};

export const selectEarnedBadges = (state) => {
  return state.verification.badges.filter(badge => badge.earnedAt !== null);
};

export const selectPendingVerifications = (state) => {
  return Object.entries(state.verification.verifications)
    .filter(([type, verification]) => verification.status === 'pending')
    .map(([type, verification]) => ({ type, ...verification }));
};

export const selectCanStartVerification = (state, type) => {
  const verification = state.verification.verifications[type];
  return verification.status === 'not_started' || verification.status === 'rejected';
};

export const selectVerificationStats = (state) => {
  const verifications = state.verification.verifications;
  return {
    verified: Object.values(verifications).filter(v => v.status === 'verified').length,
    pending: Object.values(verifications).filter(v => v.status === 'pending').length,
    rejected: Object.values(verifications).filter(v => v.status === 'rejected').length,
    notStarted: Object.values(verifications).filter(v => v.status === 'not_started').length
  };
};

export default verificationSlice.reducer;