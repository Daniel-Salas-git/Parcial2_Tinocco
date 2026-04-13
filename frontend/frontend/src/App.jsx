import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import PublicPage from './pages/PublicPage';
import LoginPage from './pages/LoginPage';
import AdminTickets from './pages/AdminTickets';
import AdminCatalogs from './pages/AdminCatalogs';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<PublicPage />} />
          
          {/* Login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas de Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/catalogs"
            element={
              <ProtectedRoute>
                <AdminCatalogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Redirecciones */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
