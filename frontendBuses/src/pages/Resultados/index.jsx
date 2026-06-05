import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box, Container, Typography, Card, CardContent,
  CardMedia, Button, Chip, CircularProgress
} from "@mui/material";
import api from "../../services/api";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

function BusCard({ ruta, pasajeros }) {
  const navigate = useNavigate();

  const handleSeleccionar = () => {
    // Limpiar selección anterior
    localStorage.removeItem("asientosSeleccionados");
    localStorage.removeItem("compraEnProceso");
    
    localStorage.setItem('rutaId', ruta.id);
    localStorage.setItem('rutaSeleccionada', JSON.stringify({
      id: ruta.id,
      origen: ruta.origen,
      destino: ruta.destino,
      fecha: ruta.fecha_ruta,
      hora_salida: ruta.hora_salida,
      precio: ruta.precio,
      ciudadOrigenId: ruta.ciudad_origen_id,
      ciudadDestinoId: ruta.ciudad_destino_id,
      cooperativa: ruta.cooperativa,
      placa: ruta.placa,
    }));
    navigate(`/asientos?rutaId=${ruta.id}&pasajeros=${pasajeros}`);
  };

  return (
    <Card sx={{ display: "flex", mb: 2, borderRadius: 3, boxShadow: 2, "&:hover": { boxShadow: 5 } }}>
      {ruta.bus?.foto ? (
        <CardMedia
          component="img"
          sx={{ width: 140 }}
          image={ruta.bus.foto}
          alt="bus"
        />
      ) : (
        <Box sx={{ width: 140, bgcolor: "grey.200", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <DirectionsBusIcon sx={{ fontSize: 48, color: "grey.400" }} />
        </Box>
      )}
      <CardContent sx={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">{ruta.cooperativa || "Cooperativa"}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">{ruta.hora_salida}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <AirlineSeatReclineNormalIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {ruta.asientos_disponibles ?? "N/D"} asientos disponibles
            </Typography>
          </Box>
          <Chip
            label={ruta.tipo_asiento || "Normal"}
            size="small"
            sx={{ mt: 1 }}
            color="primary"
            variant="outlined"
          />
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            ${Number(ruta.precio || ruta.precio_base || 0).toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={handleSeleccionar}
          >
            Seleccionar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ResultadosPage() {
  const [params] = useSearchParams();
  const origen = params.get("origen");
  const destino = params.get("destino");
  const fecha = params.get("fecha");
  const pasajeros = params.get("pasajeros") || 1;

  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const { data } = await api.get('/rutas/buscar', {
          params: { origen, destino, fecha }
        });
        setRutas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error buscando rutas:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const init = async () => {
      if (origen && destino && fecha) {
        await fetchRutas();
      } else {
        setRutas([]);
        setLoading(false);
      }
    };

    init();
  }, [origen, destino, fecha]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={1}>
        Resultados de búsqueda
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {origen} → {destino} · {fecha} · {pasajeros} pasajero(s)
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center" mt={4}>
          Error al cargar rutas. Intenta de nuevo.
        </Typography>
      )}

      {!loading && !error && rutas.length === 0 && (
        <Typography color="text.secondary" align="center" mt={4}>
          No hay rutas disponibles para esa búsqueda.
        </Typography>
      )}

      {!loading && !error && rutas.map((ruta) => (
        <BusCard key={ruta.id} ruta={ruta} pasajeros={pasajeros} />
      ))}
    </Container>
  );
}