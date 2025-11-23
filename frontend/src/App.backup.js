import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Componentes de layout
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';

// Páginas
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import DashboardPage from '@pages/dashboard/DashboardPage';
import ChatPage from '@pages/chat/ChatPage';
import PropertiesPage from '@pages/properties/PropertiesPage';
import PropertyDetailPage from '@pages/properties/PropertyDetailPage';
import ProfilePage from '@pages/profile/ProfilePage';

// Componentes de protección
import ProtectedRoute from '@components/auth/ProtectedRoute';
import RoleBasedRoute from '@components/auth/RoleBasedRoute';

function App() {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}
      
      <div className="container-fluid">
        <div className="row">
          {isAuthenticated && (
            <div className="col-md-3 col-lg-2 px-0">
              <Sidebar />
            </div>
          )}
          
          <div className={`${isAuthenticated ? 'col-md-9 col-lg-10' : 'col-12'}`}>
            <Routes>
              {/* Rutas públicas */}
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
                } 
              />
              <Route 
                path="/register" 
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
                } 
              />

              {/* Rutas protegidas */}
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="chat/:conversationId" element={<ChatPage />} />
                <Route path="properties" element={<PropertiesPage />} />
                <Route path="properties/:propertyId" element={<PropertyDetailPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Rutas por rol */}
              <Route path="/agent" element={
                <RoleBasedRoute allowedRoles={['agent']}>
                  <div>Panel de Intermediario</div>
                </RoleBasedRoute>
              } />

              {/* Ruta 404 */}
              <Route path="*" element={
                <div className="container mt-5">
                  <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                      <h1>404</h1>
                      <p>Página no encontrada</p>
                    </div>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

// 🗺️ Rutas Disponibles en la Aplicación:
// Rutas Públicas (sin autenticación):
// /login - Página de inicio de sesión
// /register - Página de registro
// Rutas Protegidas (requieren autenticación):
// / - Redirige automáticamente a /dashboard
// /dashboard - Panel principal del usuario
// /chat - Lista de conversaciones
// /chat/:conversationId - Chat específico con ID de conversación
// /properties - Lista de propiedades
// /properties/:propertyId - Detalle de propiedad específica
// /profile - Perfil del usuario
// Rutas por Rol:
// /agent - Panel específico para intermediarios
// Comportamiento de las Rutas:
// Si NO estás autenticado:

// Solo puedes acceder a /login y /register
// Cualquier otra ruta te redirige a /login
// Si SÍ estás autenticado:

// /login y /register te redirigen a /dashboard
// Tienes acceso a todas las rutas protegidas
// La navegación incluye Navbar y Sidebar
// Sistema de Layout:

// Sin autenticación: Pantalla completa para login/register
// Con autenticación: Layout con Navbar arriba y Sidebar a la izquierda