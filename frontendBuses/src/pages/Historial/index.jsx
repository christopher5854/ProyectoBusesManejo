import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Card, CardContent,
  CardActionArea, Chip, CircularProgress, Alert
} from "@mui/material";

const API = "http://localhost:3000/api";

function estadoColor(estado) {
  if (estado === "confirmado") return "success";
  if (estado === "pendiente") return "warning";
  if (estado === "cancelado") return "error";
  return "default";
}

export default function HistorialPage() {
  const navigate = useNavigate();
  const [boletos, setBoletos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const clienteId = localStorage.getItem("clienteId");
    if (!clienteId) { navigate("/"); return; }
    fetch(`${API}/boletos/cliente/${clienteId}`)
      .then((r) => r.json())
      .then((data) => setBoletos(data))
      .catch(() => setError("No se pudo cargar el historial."))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
        Mis boletos
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {boletos.map((boleto) => (
          <Card key={boleto.id} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardActionArea sx={{ p: 1 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography fontWeight="bold" fontSize={15}>
                    {boleto.origen} → {boleto.destino}
                  </Typography>
                  <Chip label={boleto.estado} color={estadoColor(boleto.estado)} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {boleto.fecha} · {boleto.hora_salida}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Asiento {boleto.asiento} · {boleto.cooperativa}
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="primary" mt={1}>
                  Código: {boleto.codigo}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
}