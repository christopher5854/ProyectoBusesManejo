import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardOficinista from '../pages/oficinista/DashboardOficinista';
import PagosPendientes from '../pages/oficinista/PagosPendientes';
import VentaBoletos from '../pages/oficinista/VentaBoletos';

const OficinistaRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/oficinista/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardOficinista />} />
      <Route path="/venta-boletos" element={<VentaBoletos />} />
      <Route path="/pagos-pendientes" element={<PagosPendientes />} />
      <Route path="/rutas-dia" element={<DashboardOficinista />} />
      <Route path="/estado-buses" element={<DashboardOficinista />} />
    </Routes>
  );
};

export default OficinistaRoute;