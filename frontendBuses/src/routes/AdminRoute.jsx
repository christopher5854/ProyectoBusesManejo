import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardAdmin from '../pages/admin/DashboardAdmin';

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardAdmin />} />
    </Routes>
  );
};

export default AdminRoute;