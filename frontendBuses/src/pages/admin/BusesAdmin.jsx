import { useQuery } from 'react-query';
import api from '../../services/api';

export default function BusesAdmin() {
  const { data, isLoading } = useQuery('buses', () => api.get('/buses').then(res => res.data));
  if (isLoading) return <span>Cargando buses...</span>;

  return (
    <div>
      <h2>Gestión de Buses</h2>
      {data?.map(bus => (
        <div key={bus.id}>
          Bus: {bus.placa} - Asientos: {bus.capacidad}
        </div>
      ))}
    </div>
  );
}