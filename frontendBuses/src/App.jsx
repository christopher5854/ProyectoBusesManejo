import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import Register from './pages/Register';
import LayoutConSidebar from './layouts/LayoutConSidebar';
import ResultadosPage from './pages/Resultados';
import AsientosPage from './pages/Asientos';
import PagoPage from './pages/Pagos';
import HistorialPage from './pages/Historial';

// Admin pages
import DashboardAdmin from './pages/admin/DashboardAdmin';
import BusesAdmin from './pages/admin/BusesAdmin';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import Frecuencias from './pages/admin/Frecuencias';
import HojaRuta from './pages/admin/HojaRuta';  // ← Agrega si existe
import Metrics from './pages/admin/Metrics';      // ← Agrega si existe

// Oficinista pages
import DashboardOficinista from './pages/oficinista/DashboardOficinista';
import PagosPendientes from './pages/oficinista/PagosPendientes';
import VentaBoletos from './pages/oficinista/VentaBoletos';

// Bus pages
import ScannerQR from './pages/bus-personal/ScannerQR';

import { UserContext } from './Context/UserContext';
import './App.css';

const getDefaultRoute = (rol) => {
  const normalizedRol = String(rol || '').toLowerCase();

  switch (normalizedRol) {
    case 'admin':
      return '/admin/dashboard';
    case 'oficinista':
      return '/oficinista/dashboard';
    case 'cliente':
    case 'client':
      return '/home';
    case 'personal_bus':
    case 'personal bus':
      return '/bus/escaneo';
    default:
      return '/home';
  }
};

function App() {
  const { usuario } = useContext(UserContext);
  const token = localStorage.getItem('token');
  const currentUsuario = usuario?.rol ? usuario : JSON.parse(localStorage.getItem('usuario') || 'null');
  const isAuthenticated = Boolean(token);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Rutas sin sidebar (públicas) */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to={getDefaultRoute(currentUsuario?.rol)} replace /> : <Login />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to={getDefaultRoute(currentUsuario?.rol)} replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to={getDefaultRoute(currentUsuario?.rol)} replace /> : <Register />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/buscar/resultados"
            element={isAuthenticated ? <ResultadosPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/asientos"
            element={isAuthenticated ? <AsientosPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/pago"
            element={isAuthenticated ? <PagoPage /> : <Navigate to="/login" replace />}
          />

          {/* Rutas con sidebar - Admin */}
          <Route path="/admin/dashboard" element={
            <LayoutConSidebar rol="admin">
              <DashboardAdmin />
            </LayoutConSidebar>
          } />
          <Route path="/admin/metricas" element={
            <LayoutConSidebar rol="admin">
              <Metrics />
            </LayoutConSidebar>
          } />
          <Route path="/admin/buses" element={
            <LayoutConSidebar rol="admin">
              <BusesAdmin />
            </LayoutConSidebar>
          } />
          <Route path="/admin/usuarios" element={
            <LayoutConSidebar rol="admin">
              <UsuariosAdmin />
            </LayoutConSidebar>
          } />
          <Route path="/admin/frecuencias" element={
            <LayoutConSidebar rol="admin">
              <Frecuencias />
            </LayoutConSidebar>
          } />
            <Route path="/admin/hoja-ruta" element={
              <LayoutConSidebar rol="admin">
                <HojaRuta />
              </LayoutConSidebar>
            } />

          {/* Rutas con sidebar - Oficinista */}
          <Route path="/oficinista/dashboard" element={
            <LayoutConSidebar rol="oficinista">
              <DashboardOficinista />
            </LayoutConSidebar>
          } />
          <Route path="/oficinista/venta-boletos" element={
            <LayoutConSidebar rol="oficinista">
              <VentaBoletos />
            </LayoutConSidebar>
          } />
          <Route path="/oficinista/pagos-pendientes" element={
            <LayoutConSidebar rol="oficinista">
              <PagosPendientes />
            </LayoutConSidebar>
          } />

          {/* Rutas con sidebar - Personal Bus */}
          <Route path="/bus/escaneo" element={
            <LayoutConSidebar rol="personal_bus">
              <ScannerQR />
            </LayoutConSidebar>
          } />

          {/* Rutas con sidebar - Cliente */}
          <Route path="/historial" element={
            <LayoutConSidebar rol="cliente">
              <HistorialPage />
            </LayoutConSidebar>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;