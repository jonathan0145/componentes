import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import DashboardPage from '@pages/dashboard/DashboardPage';
import ChatPage from '@pages/chat/ChatPage';
import PropertiesPage from '@pages/properties/PropertiesPage';
import CreatePropertyPage from '@pages/properties/CreatePropertyPage';
import PropertyDetailPage from '@pages/properties/PropertyDetailPage';
import EditPropertyPage from '@pages/properties/EditPropertyPage';
import ProfilePage from '@pages/profile/ProfilePage';
import OffersPage from '@pages/offers/OffersPage';
import AgentsPage from '@pages/agents/AgentsPage';
import AppointmentsPage from '@pages/appointments/AppointmentsPage';
import UserVerificationPage from '@pages/verification/UserVerificationPage';

// Componentes
import NotificationToast from '@components/notifications/NotificationToast';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Rutas públicas - Sin protección */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/new" element={<CreatePropertyPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/properties/:id/edit" element={<EditPropertyPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/verification" element={<UserVerificationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/config" element={<div className="container py-4"><h2>Configuración</h2><p>Página en desarrollo...</p></div>} />
        
        {/* Ruta raíz redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Ruta por defecto redirige al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      {/* Componente de notificaciones Toast */}
      <NotificationToast />
    </div>
  );
}

export default App;

// CÓDIGO ANTERIOR COMENTADO (con rutas protegidas):
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// // Páginas
// import LoginPage from '@pages/auth/LoginPage';
// import RegisterPage from '@pages/auth/RegisterPage';
// import DashboardPage from '@pages/dashboard/DashboardPage';

// // Componente de protección
// import ProtectedRoute from '@components/auth/ProtectedRoute';

// function App() {
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   return (
//     <div className="App">
//       <Routes>
//         {/* Rutas públicas */}
//         <Route 
//           path="/login" 
//           element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
//         />
//         <Route 
//           path="/register" 
//           element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
//         />
        
//         {/* Rutas protegidas */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <DashboardPage />
//             </ProtectedRoute>
//           } 
//         />
        
//         {/* Ruta raíz */}
//         <Route 
//           path="/" 
//           element={
//             isAuthenticated ? 
//               <Navigate to="/dashboard" replace /> : 
//               <Navigate to="/login" replace />
//           } 
//         />
        
//         {/* Ruta por defecto */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;