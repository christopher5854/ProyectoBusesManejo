import { useQuery } from 'react-query';
import adminService from '../../services/adminService';

export default function UsuariosAdmin() {
  const { data, isLoading } = useQuery('usuarios', () => adminService.getUsuarios());
  if (isLoading) return <span>Cargando usuarios...</span>;

  return (
    <div>
      <h2>Gestión Usuarios</h2>
      {data?.map(user => (
        <div key={user.id}>{user.nombre} - Rol: {user.rol}</div>
      ))}
    </div>
  );
}