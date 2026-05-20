// src/pages/admin/Frecuencias.jsx
import { useQuery } from 'react-query';
import api from '../../services/api';

export default function Frecuencias() {
  const { data, isLoading } = useQuery('frecuencias', () => api.get('/frecuencias').then(res => res.data));
  if (isLoading) return <span>Cargando frecuencias...</span>;

  return (
    <div>
      <h2>Frecuencias</h2>
      {data?.map(frec => (
        <div key={frec.id}>
          Ruta: {frec.origen} - {frec.destino} | Hora: {frec.hora}
        </div>
      ))}
    </div>
  );
}