import { useQuery, useMutation, useQueryClient } from 'react-query';
import Oficinista from '../../services/Oficinista';

export default function PagosPendientes() {
  const qc = useQueryClient();
  const { data } = useQuery('pagos', () => Oficinista.getPagos());

  const mutarPago = useMutation(({ id, estado }) => Oficinista.actualizarPago(id, estado), {
    onSuccess: () => qc.invalidateQueries('pagos')
  });

  return (
    <div>
      <h2>Pagos Pendientes</h2>
      {data?.map(pago => (
        <div key={pago.id}>
          <img src={pago.comprobanteUrl} alt="Comprobante" width="200" />
          <button onClick={() => mutarPago.mutate({ id: pago.id, estado: 'Aprobado' })}>Aprobar</button>
          <button onClick={() => mutarPago.mutate({ id: pago.id, estado: 'Rechazado' })}>Rechazar</button>
        </div>
      ))}
    </div>
  );
}