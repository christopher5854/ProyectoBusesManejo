
import { useQuery } from 'react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import adminService from '../../services/adminService';

const COLORES = ['#0088FE', '#00C49F', '#FFBB28'];

export default function DashboardAdmin() {
  const { data } = useQuery('metricas', () => adminService.getMetricas());

  if (!data) return <span>Cargando...</span>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <p>Total Vendidos: {data.kpis.total}</p>
        <p>Ingresos Mes: ${data.kpis.ingresos}</p>
        <p>Ocupación Promedio: {data.kpis.ocupacion}%</p>
      </div>

      <BarChart width={500} height={300} data={data.ventasSieteDias}>
        <XAxis dataKey="ruta" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="ventas" fill="#8884d8" />
      </BarChart>

      <PieChart width={400} height={400}>
        <Pie data={data.estadoBoletos} dataKey="valor" nameKey="estado" cx="50%" cy="50%" outerRadius={100}>
          {data.estadoBoletos.map((entry, index) => <Cell key={index} fill={COLORES[index % COLORES.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}