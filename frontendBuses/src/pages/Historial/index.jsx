import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Card, CardContent,
  CardActionArea, Chip, CircularProgress, Alert,
  Modal, Divider, Button
} from "@mui/material";
import QRCode from "react-qr-code";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

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
  const [seleccionado, setSeleccionado] = useState(null);

useEffect(() => {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const token = localStorage.getItem("token");
  
  if (!usuario.id || !token) { 
    navigate("/home"); 
    return; 
  }
  
  fetch(`${API}/boletos?usuario_id=${usuario.id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then((r) => r.json())
    .then((data) => setBoletos(data))
    .catch(() => setError("No se pudo cargar el historial."))
    .finally(() => setLoading(false));
}, [navigate]);

  const descargarPDF = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API}/boletos/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boleto-${id}.pdf`;
    a.click();
  };

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
            <CardActionArea onClick={() => setSeleccionado(boleto)} sx={{ p: 1 }}>
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

      <Modal open={!!seleccionado} onClose={() => setSeleccionado(null)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper", borderRadius: 3,
          boxShadow: 24, p: 4, width: "90%", maxWidth: 400
        }}>
          {seleccionado && (
            <>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                {seleccionado.origen} → {seleccionado.destino}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 3 }}>
                <Typography variant="body2"><b>Fecha:</b> {seleccionado.fecha}</Typography>
                <Typography variant="body2"><b>Hora:</b> {seleccionado.hora_salida}</Typography>
                <Typography variant="body2"><b>Cooperativa:</b> {seleccionado.cooperativa}</Typography>
                <Typography variant="body2"><b>Asiento:</b> {seleccionado.asiento}</Typography>
                <Typography variant="body2"><b>Pasajero:</b> {seleccionado.nombre}</Typography>
                <Typography variant="body2"><b>Código:</b> {seleccionado.codigo}</Typography>
                <Chip label={seleccionado.estado} color={estadoColor(seleccionado.estado)} size="small" sx={{ alignSelf: "flex-start", mt: 0.5 }} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <QRCode value={seleccionado.codigo || "sin-codigo"} size={160} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button variant="contained" onClick={() => descargarPDF(seleccionado.id)}>
                  Descargar PDF
                </Button>
                <Button variant="outlined" onClick={() => setSeleccionado(null)}>
                  Cerrar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}