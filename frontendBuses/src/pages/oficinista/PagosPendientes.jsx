import { useState, useEffect } from "react";
import {
  Container, Typography, Box, Card, CardContent,
  Button, CircularProgress, Alert, Grid
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function PagosPendientes() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(null);

  useEffect(() => {
    const cargarPagos = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API}/boletos/pendientes`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setPagos(data);
      } catch {
        setError("Error al cargar pagos");
      } finally {
        setLoading(false);
      }
    };
    cargarPagos();
  }, []);

  const validarPago = async (id, estado) => {
    setProcesando(id);
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API}/boletos/${id}/validar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ estado })
      });
      // Recargar la lista después de validar
      const res = await fetch(`${API}/boletos/pendientes`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setPagos(data);
    } catch {
      setError("Error al validar pago");
    } finally {
      setProcesando(null);
    }
  };

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
        Pagos Pendientes de Validación
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {pagos.length === 0 ? (
        <Alert severity="info">No hay pagos pendientes</Alert>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {pagos.map((pago) => (
            <Card key={pago.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <b>Pasajero:</b> {pago.nombres} {pago.apellidos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Cédula:</b> {pago.cedula}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Ruta:</b> {pago.origen} → {pago.destino}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Asiento:</b> {pago.asiento}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Referencia:</b> {pago.referencia_bancaria || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {pago.comprobante_url && (
                      <img
                        src={`${API}${pago.comprobante_url}`}
                        alt="Comprobante"
                        style={{ maxWidth: "100%", maxHeight: 150, borderRadius: 8 }}
                      />
                    )}
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => validarPago(pago.id, "Aprobado")}
                        disabled={procesando === pago.id}
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => validarPago(pago.id, "Rechazado")}
                        disabled={procesando === pago.id}
                      >
                        Rechazar
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}