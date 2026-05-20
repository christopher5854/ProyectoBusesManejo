import { useQuery } from 'react-query';
import api from '../../services/api';

export default function HojaRuta() {
  const { data, isLoading } = useQuery('hojaRuta', () => api.get('/hojas-ruta').then(res => res.data));
  if (isLoading) return <span>Cargando hojas de ruta...</span>;

  return (
    <div>
      <h2>Hoja de Ruta</h2>
      {data?.map(hoja => (
        <div key={hoja.id}>{hoja.descripcion} - Chofer: {hoja.chofer}</div>
      ))}
    </div>
  );
}
