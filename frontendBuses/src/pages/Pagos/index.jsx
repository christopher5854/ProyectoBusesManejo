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

  const getToken = () => localStorage.getItem("token");

const crearBoleto = async () => {
  const token = getToken();
  if (!token) {
    setError("No has iniciado sesión. Por favor, inicia sesión primero.");
    return;
  }

  const asientos = JSON.parse(localStorage.getItem("asientosSeleccionados") || "[]");
  const rutaId = localStorage.getItem("rutaId");
  
  // Obtener datos de la ruta y ciudades desde localStorage o sessionStorage
  const ciudadOrigenId = localStorage.getItem("ciudadOrigenId") || 1; // Quito por defecto
  const ciudadDestinoId = localStorage.getItem("ciudadDestinoId") || 4; // Ambato por defecto
  const metodoPagoId = datos.metodoPago === "Transferencia" ? 1 : datos.metodoPago === "Depósito" ? 2 : 3;
  
  // Obtener el usuario del contexto (deberías guardarlo al login)
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const clienteId = usuario.id || 2; // Si no hay, usar id=2 (cliente de prueba)
  
  // Precio base (deberías obtenerlo de la ruta seleccionada)
  const precioBase = 12.50; // Temporal, deberías obtenerlo de la frecuencia
  
  try {
    const res = await fetch("http://localhost:3000/api/boletos", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        ruta_id: parseInt(rutaId),
        asiento_id: asientos[0]?.id, 
        cliente_id: clienteId,
        ciudad_abordaje_id: parseInt(ciudadOrigenId),
        ciudad_destino_id: parseInt(ciudadDestinoId),
        metodo_pago_id: metodoPagoId,
        precio_base: precioBase
      }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al crear boleto");
    }
    
    const data = await res.json();
    setBoletoCreado(data.boleto);
    setPaso(1);
  } catch (err) {
    setError("Error al crear el boleto: " + err.message);
  }
};

const registrarPago = async () => {
  const token = getToken();
  try {
    const res = await fetch(`http://localhost:3000/api/boletos/${boletoCreado.id}/pago`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ referencia_bancaria: datos.referencia }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al registrar pago");
    }
    
    setPaso(2);
  } catch (err) {
    setError("Error al registrar el pago: " + err.message);
  }
};

  const subirComprobante = async () => {
    const token = getToken();
    const formData = new FormData();
    formData.append("comprobante", datos.comprobante);
    
    try {
      const res = await fetch(`http://localhost:3000/api/boletos/${boletoCreado.id}/comprobante`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!res.ok) throw new Error("Error al subir comprobante");
      
      setPaso(3);
    } catch (err) {
      setError("Error al subir el comprobante: " + err.message);
    }
  };

  const descargarPDF = async () => {
    const token = getToken();
    if (!token) {
      setError("No hay sesión iniciada. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/boletos/${boletoCreado.id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Error al descargar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boleto_${boletoCreado.codigo}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Error al descargar el PDF: " + err.message);
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