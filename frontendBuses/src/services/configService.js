import api from './api';

const configService = {
  getConfiguracion: () => api.get('/configuracion'),
  actualizarConfiguracion: (data) => api.put('/configuracion', data),
  getParametros: () => api.get('/parametros'),
  actualizarParametro: (key, value) => api.put(`/parametros/${key}`, { value }),
};

export default configService;