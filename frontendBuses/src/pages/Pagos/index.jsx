import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Stepper, Step, StepLabel,
  TextField, Button, RadioGroup, FormControlLabel, Radio, Alert
} from "@mui/material";

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

  const crearBoleto = async () => {
    const asientos = JSON.parse(localStorage.getItem("asientosSeleccionados") || "[]");
    const rutaId = localStorage.getItem("rutaId");
    try {
      const res = await fetch("http://localhost:3000/api/boletos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruta_id: rutaId,
          asiento_ids: asientos.map((a) => a.id),
          cedula: datos.cedula,
          nombre: datos.nombre,
          email: datos.email,
        }),
      });
      const data = await res.json();
      setBoletoCreado(data);
      setPaso(1);
    } catch {
      setError("Error al crear el boleto. Intenta de nuevo.");
    }
  };

  const registrarPago = async () => {
    try {
      await fetch(`http://localhost:3000/api/boletos/${boletoCreado.id}/pago`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referencia: datos.referencia, metodo: datos.metodoPago }),
      });
      setPaso(2);
    } catch {
      setError("Error al registrar el pago.");
    }
  };

  const subirComprobante = async () => {
    const formData = new FormData();
    formData.append("comprobante", datos.comprobante);
    try {
      await fetch(`http://localhost:3000/api/boletos/${boletoCreado.id}/comprobante`, {
        method: "POST",
        body: formData,
      });
      setPaso(3);
    } catch {
      setError("Error al subir el comprobante.");
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

      {/* Paso 0 — Datos del pasajero */}
      {paso === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Datos del pasajero</Typography>
          {["cedula", "nombre", "email", "telefono"].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={datos[field]}
              onChange={handleChange}
              fullWidth
            />
          ))}
          <Button variant="contained" size="large" onClick={crearBoleto}>
            Continuar
          </Button>
        </Box>
      )}

      {/* Paso 1 — Método de pago */}
      {paso === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Método de pago</Typography>
          <RadioGroup name="metodoPago" value={datos.metodoPago} onChange={handleChange}>
            <FormControlLabel value="Transferencia" control={<Radio />} label="Transferencia bancaria" />
            <FormControlLabel value="Depósito" control={<Radio />} label="Depósito bancario" />
            <FormControlLabel value="Efectivo" control={<Radio />} label="Efectivo" />
          </RadioGroup>
          <TextField
            label="Número de referencia"
            name="referencia"
            value={datos.referencia}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="contained" size="large" disabled={!datos.metodoPago} onClick={registrarPago}>
            Registrar pago
          </Button>
        </Box>
      )}

      {/* Paso 2 — Subir comprobante */}
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

      {/* Paso 3 — Confirmación */}
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
            <Button variant="outlined" href={`http://localhost:3000/api/boletos/${boletoCreado.id}/pdf`} target="_blank">
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