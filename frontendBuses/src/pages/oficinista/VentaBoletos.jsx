import { useState } from 'react';
import Oficinista from '../../services/Oficinista';

export default function VentaBoletos() {
  const [cedula, setCedula] = useState('');
  const [cliente, setCliente] = useState(null);

  const buscar = async () => {
    const data = await Oficinista.buscarCliente(cedula);
    setCliente(data);
  };

  return (
    <div>
      <h2>Venta Boletos</h2>
      <input placeholder="Cédula" value={cedula} onChange={e => setCedula(e.target.value)} />
      <button onClick={buscar}>Buscar</button>
      
      {cliente && (
        <div>
          <p>Cliente: {cliente.nombre}</p>
          <button>Continuar Venta</button>
        </div>
      )}
    </div>
  );
}