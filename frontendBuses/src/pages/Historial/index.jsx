import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Card, CardContent,
  CardActionArea, Chip, CircularProgress, Alert,
  Modal, Divider, Button
} from "@mui/material";
//import QRCode from "react-qr-code";
import api from "../../services/api";

function estadoColor(estado) {
  if (estado === "pagado" || estado === "confirmado") return "success";
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
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    
    if (!token || !usuario.id) {
      navigate("/login");
      return;
    }

    const fetchBoletos = async () => {
      try {
        const response = await api.get(`/boletos?usuario_id=${usuario.id}`);
        setBoletos(response.data);
      } catch (error) {
        console.error("Error:", error);
        setError("No se pudo cargar el historial. " + (error.response?.data?.message || ""));
      } finally {
        setLoading(false);
      }
    };

    fetchBoletos();
  }, [navigate]);

  const descargarPDF = async (id, codigo) => {
    try {
      const response = await api.get(`/boletos/${id}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boleto_${codigo || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando PDF:", error);
      setError("Error al descargar el PDF");
    }
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

      {boletos.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No tienes boletos comprados aún.
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {boletos.map((boleto) => (
          <Card key={boleto.id} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardActionArea onClick={() => setSeleccionado(boleto)} sx={{ p: 1 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography fontWeight="bold" fontSize={15}>
                    {boleto.origen || "Origen"} → {boleto.destino || "Destino"}
                  </Typography>
                  <Chip 
                    label={boleto.estado_pago || boleto.estado || "pendiente"} 
                    color={estadoColor(boleto.estado_pago || boleto.estado)} 
                    size="small" 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {boleto.fecha_viaje || boleto.fecha} · {boleto.hora_salida || "Hora no disponible"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Asiento {boleto.numero_asiento || boleto.asiento} · {boleto.cooperativa || "Cooperativa"}
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
                {seleccionado.origen || "Origen"} → {seleccionado.destino || "Destino"}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 3 }}>
                <Typography variant="body2"><b>Fecha:</b> {seleccionado.fecha_viaje || seleccionado.fecha}</Typography>
                <Typography variant="body2"><b>Hora:</b> {seleccionado.hora_salida || "N/A"}</Typography>
                <Typography variant="body2"><b>Cooperativa:</b> {seleccionado.cooperativa || "N/A"}</Typography>
                <Typography variant="body2"><b>Asiento:</b> {seleccionado.numero_asiento || seleccionado.asiento}</Typography>
                <Typography variant="body2"><b>Pasajero:</b> {seleccionado.nombre || seleccionado.nombres}</Typography>
                <Typography variant="body2"><b>Código:</b> {seleccionado.codigo}</Typography>
                <Chip 
                  label={seleccionado.estado_pago || seleccionado.estado || "pendiente"} 
                  color={estadoColor(seleccionado.estado_pago || seleccionado.estado)} 
                  size="small" 
                  sx={{ alignSelf: "flex-start", mt: 0.5 }} 
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Código: {seleccionado.codigo}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button variant="contained" onClick={() => descargarPDF(seleccionado.id, seleccionado.codigo)}>
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