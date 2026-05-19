import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { Login } from './pages/Login';

import AdminRoute from './routes/AdminRoute';
import OficinistaRoute from './routes/OficinistaRoute';
import BusRoute from './routes/BusRoute';

import './App.css';

function App() {

  return (

    <div className="App">

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/home" element={<Home />} />

          <Route path="/admin/*" element={<AdminRoute />} />

          <Route path="/oficinista/*" element={<OficinistaRoute />} />

          <Route path="/bus/*" element={<BusRoute />} />

          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>

      </BrowserRouter>

    </div>

  );

}

export default App;