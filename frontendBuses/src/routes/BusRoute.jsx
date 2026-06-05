import { Navigate, Route, Routes } from 'react-router-dom';
import ScannerQR from '../pages/bus-personal/ScannerQR';

const BusRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/bus/escaneo" replace />} />
      <Route path="/escaneo" element={<ScannerQR />} />
      <Route path="/mapa-asientos" element={<ScannerQR />} />
      <Route path="/control-paradas" element={<ScannerQR />} />
      <Route path="/vender-boleto" element={<ScannerQR />} />
      <Route path="/reporte" element={<ScannerQR />} />
    </Routes>
  );
};

export default BusRoute;