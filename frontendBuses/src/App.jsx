import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import ResultadosPage from './pages/Resultados';  
import AsientosPage from './pages/Asientos';  
import PagoPage from './pages/Pagos';
import HistorialPage from "./pages/Historial";


import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/buscar/resultados" element={<ResultadosPage />} />
          <Route path="/asientos" element={<AsientosPage />} /> 
          <Route path="/pago" element={<PagoPage />} /> 
          <Route path="/historial" element={<HistorialPage />} />


          {/* Activar cuando existan las pantallas por rol */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
          {/* <Route path="/oficina/ventas" element={<OficinaVentas />} /> */}
          {/* <Route path="/bus/escaneo" element={<BusEscaneo />} /> */}
          {/* <Route path="/cooperativa/dashboard" element={<CoopDashboard />} /> */}

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
