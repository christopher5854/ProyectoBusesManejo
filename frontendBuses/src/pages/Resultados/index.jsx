import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box, Container, Typography, Card, CardContent,
  CardMedia, Button, Chip, CircularProgress
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

function BusCard({ ruta, pasajeros }) {
  const navigate = useNavigate();

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
          <Typography variant="h6" fontWeight="bold">{ruta.cooperativa?.nombre || "Cooperativa"}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">{ruta.hora_salida}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <AirlineSeatReclineNormalIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {ruta.asientos_disponibles} asientos disponibles
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
            ${Number(ruta.precio_base || 0).toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={() => navigate(`/asientos?rutaId=${ruta.id}&pasajeros=${pasajeros}`)}
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
    fetch(`http://localhost:3000/api/frecuencias/buscar?origen=${origen}&destino=${destino}&fecha=${fecha}`)
      .then((res) => res.json())
      .then((data) => {
        setRutas(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
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
        <Typography color="error" textAlign="center" mt={4}>
          Error al cargar rutas. Intenta de nuevo.
        </Typography>
      )}

      {!loading && !error && rutas.length === 0 && (
        <Typography color="text.secondary" textAlign="center" mt={4}>
          No hay rutas disponibles para esa búsqueda.
        </Typography>
      )}

      {!loading && !error && rutas.map((ruta) => (
        <BusCard key={ruta.id} ruta={ruta} pasajeros={pasajeros} />
      ))}
    </Container>
  );
}