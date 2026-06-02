import api from './api';

const adminService = {
  // Servicios para usuarios
  getUsuarios: () => api.get('/usuarios'),
  crearUsuario: (data) => api.post('/usuarios', data),
  actualizarUsuario: (id, data) => api.put(`/usuarios/${id}`, data),
  eliminarUsuario: (id) => api.delete(`/usuarios/${id}`),
  
  // Servicios para buses
  getBuses: () => api.get('/buses'),
  crearBus: (data) => api.post('/buses', data),
  actualizarBus: (id, data) => api.put(`/buses/${id}`, data),
  eliminarBus: (id) => api.delete(`/buses/${id}`),
  
  // Servicios para rutas
  getRutas: () => api.get('/rutas'),
  crearRuta: (data) => api.post('/rutas', data),
  
  // Servicios para frecuencias
  getFrecuencias: () => api.get('/frecuencias'),
};

export default adminService;