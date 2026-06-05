import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Stepper, Step, StepLabel,
  TextField, Button, RadioGroup, FormControlLabel, Radio, Alert
} from "@mui/material";
import api from "../../services/api";

const PASOS = ["Datos pasajero", "Método de pago", "Comprobante", "Confirmación"];

export default function PagoPage() {
  const [paso, setPaso] = useState(0);
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    cedula: "", nombre: "", email: "", telefono: "",
    metodoPago: "", referencia: "", comprobante: null,
  });
  const [boletoCreado, setBoletoCreado] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const getToken = () => localStorage.getItem("token");

  const crearBoleto = async () => {
    setError(""); 
  const token = getToken();
  if (!token) {
    setError("No has iniciado sesión. Por favor, inicia sesión primero.");
    return;
  }

  const asientos = JSON.parse(localStorage.getItem("asientosSeleccionados") || "[]");
  const rutaId = localStorage.getItem("rutaId");
  const rutaStored = JSON.parse(localStorage.getItem("rutaSeleccionada") || "null");
  const ciudadOrigenId = rutaStored?.ciudadOrigenId || 1;
  const ciudadDestinoId = rutaStored?.ciudadDestinoId || 4;
  const metodoPagoId = datos.metodoPago === "Transferencia" ? 1 : datos.metodoPago === "Depósito" ? 2 : 3;
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const clienteId = usuario.id || 2;
  const precioBase = rutaStored?.precio || asientos[0]?.precio || 0;

  try {
    const res = await api.post('/boletos', {
      ruta_id: parseInt(rutaId, 10),
      asiento_id: asientos[0]?.id,
      cliente_id: clienteId,
      ciudad_abordaje_id: parseInt(ciudadOrigenId, 10),
      ciudad_destino_id: parseInt(ciudadDestinoId, 10),
      metodo_pago_id: metodoPagoId,
      precio_base: precioBase
    });

    setBoletoCreado(res.data.boleto);
    setPaso(1);
  } catch (err) {
    setError("Error al crear el boleto: " + (err.response?.data?.message || err.message));
  }
};

  const registrarPago = async () => {
    setError("");  // Limpia errores anteriores
    try {
      await api.put(`/boletos/${boletoCreado.id}/pago`, {
        referencia_bancaria: datos.referencia,
      });
      setPaso(2);
    } catch (err) {
      setError("Error al registrar el pago: " + (err.response?.data?.message || err.message));
    }
  };

  const subirComprobante = async () => {
    try {
      const formData = new FormData();
      formData.append("comprobante", datos.comprobante);
      await api.post(`/boletos/${boletoCreado.id}/comprobante`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPaso(3);
    } catch (err) {
      setError("Error al subir el comprobante: " + (err.response?.data?.message || err.message));
    }
  };

  const descargarPDF = async () => {
    try {
      const response = await api.get(`/boletos/${boletoCreado.id}/pdf`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boleto_${boletoCreado.codigo}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Error al descargar el PDF: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
        Comprar pasaje
      </Typography>

      <Stepper activeStep={paso} alternativeLabel sx={{ mb: 4 }}>
        {PASOS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {paso === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Datos del pasajero</Typography>
            <Typography variant="caption" color="error" sx={{ mb: 1 }}>
              * Todos los campos son obligatorios
            </Typography>
            
            <TextField
              label="Cédula *"
              name="cedula"
              value={datos.cedula}
              onChange={handleChange}
              fullWidth
              error={datos.cedula.trim() === ""}
              helperText={datos.cedula.trim() === "" ? "La cédula es obligatoria" : ""}
            />
            
            <TextField
              label="Nombre completo *"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              fullWidth
              error={datos.nombre.trim() === ""}
              helperText={datos.nombre.trim() === "" ? "El nombre es obligatorio" : ""}
            />
            
            <TextField
              label="Correo electrónico *"
              name="email"
              type="email"
              value={datos.email}
              onChange={handleChange}
              fullWidth
              error={datos.email.trim() === "" || !datos.email.includes("@")}
              helperText={
                datos.email.trim() === "" 
                  ? "El correo es obligatorio" 
                  : !datos.email.includes("@") 
                    ? "Ingresa un correo válido (ej: nombre@gmail.com)" 
                    : ""
              }
            />
            
            <TextField
              label="Teléfono *"
              name="telefono"
              value={datos.telefono}
              onChange={handleChange}
              fullWidth
              error={datos.telefono.trim() === ""}
              helperText={datos.telefono.trim() === "" ? "El teléfono es obligatorio" : ""}
            />
            
            <Button 
              variant="contained" 
              size="large" 
              onClick={crearBoleto}
              disabled={
                datos.cedula.trim() === "" ||
                datos.nombre.trim() === "" ||
                datos.email.trim() === "" ||
                !datos.email.includes("@") ||
                datos.telefono.trim() === ""
              }
            >
              Continuar
            </Button>
          </Box>
        )}

        {paso === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Método de pago</Typography>
            <Typography variant="caption" color="error" sx={{ mb: 1 }}>
              * Todos los campos son obligatorios
            </Typography>
            
            <RadioGroup name="metodoPago" value={datos.metodoPago} onChange={handleChange}>
              <FormControlLabel value="Transferencia" control={<Radio />} label="Transferencia bancaria" />
              <FormControlLabel value="Depósito" control={<Radio />} label="Depósito bancario" />
              <FormControlLabel value="Efectivo" control={<Radio />} label="Efectivo" />
            </RadioGroup>
            
            <TextField
              label="Número de referencia *"
              name="referencia"
              value={datos.referencia}
              onChange={handleChange}
              fullWidth
              error={datos.metodoPago !== "Efectivo" && datos.referencia.trim() === ""}
              helperText={
                datos.metodoPago !== "Efectivo" && datos.referencia.trim() === "" 
                  ? "El número de referencia es obligatorio para transferencia o depósito" 
                  : ""
              }
            />
            
            <Button 
              variant="contained" 
              size="large" 
              onClick={registrarPago}
              disabled={
                !datos.metodoPago ||
                (datos.metodoPago !== "Efectivo" && datos.referencia.trim() === "")
              }
            >
              Registrar pago
            </Button>
          </Box>
        )}

      {paso === 2 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Subir comprobante</Typography>
          <Button variant="outlined" component="label">
            Seleccionar imagen
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setDatos({ ...datos, comprobante: e.target.files[0] })}
            />
          </Button>
          {datos.comprobante && (
            <Typography variant="body2" color="success.main">
              ✓ {datos.comprobante.name}
            </Typography>
          )}
          <Button variant="contained" size="large" disabled={!datos.comprobante} onClick={subirComprobante}>
            Subir y finalizar
          </Button>
        </Box>
      )}

      {paso === 3 && boletoCreado && (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" color="success.main" fontWeight="bold" mb={2}>
            ¡Compra exitosa! 🎉
          </Typography>
          <Typography variant="body1" mb={1}>
            Código de boleto: <strong>{boletoCreado.codigo}</strong>
          </Typography>
          {boletoCreado.qr && (
            <Box component="img" src={boletoCreado.qr} alt="QR" sx={{ width: 160, height: 160, mx: "auto", display: "block", my: 2 }} />
          )}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
            <Button variant="outlined" onClick={descargarPDF}>
              Descargar PDF
            </Button>
            <Button variant="contained" onClick={() => navigate("/")}>
              Adquirir otro boleto
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}