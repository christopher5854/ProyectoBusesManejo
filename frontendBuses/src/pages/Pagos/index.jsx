import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Stepper, Step, StepLabel,
  TextField, Button, RadioGroup, FormControlLabel, Radio, Alert,
  Paper, Chip
} from "@mui/material";
import api from "../../services/api";

const PASOS = ["Resumen", "Datos pasajero", "Método de pago", "Comprobante", "Confirmación"];

export default function PagoPage() {
  const [paso, setPaso] = useState(0);
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    cedula: "", nombre: "", email: "", telefono: "",
    metodoPago: "", referencia: "", comprobante: null,
  });
  const [boletoCreado, setBoletoCreado] = useState(null);
  const [error, setError] = useState("");
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const ruta = JSON.parse(localStorage.getItem("rutaSeleccionada") || "null");
    const asientos = JSON.parse(localStorage.getItem("asientosSeleccionados") || "[]");
    
    // Usar setTimeout para evitar el warning
    const timer = setTimeout(() => {
      setRutaSeleccionada(ruta);
      setAsientosSeleccionados(asientos);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const getToken = () => localStorage.getItem("token");

  const crearBoleto = async () => {
    setError("");
    const token = getToken();
    if (!token) {
      setError("No has iniciado sesión. Por favor, inicia sesión primero.");
      return;
    }

    // Validar campos obligatorios antes de crear boleto
    if (!datos.cedula.trim() || !datos.nombre.trim() || !datos.email.trim() || !datos.telefono.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (!datos.email.includes("@")) {
      setError("Ingresa un correo electrónico válido");
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
      setPaso(2);
    } catch (err) {
      setError("Error al crear el boleto: " + (err.response?.data?.message || err.message));
    }
  };

  const registrarPago = async () => {
    setError("");
    
    // Validar referencia según método de pago
    if (datos.metodoPago !== "Efectivo" && !datos.referencia.trim()) {
      setError("El número de referencia es obligatorio para transferencia o depósito");
      return;
    }
    if (!datos.metodoPago) {
      setError("Selecciona un método de pago");
      return;
    }

    try {
      await api.put(`/boletos/${boletoCreado.id}/pago`, {
        referencia_bancaria: datos.referencia,
      });
      setPaso(3);
    } catch (err) {
      setError("Error al registrar el pago: " + (err.response?.data?.message || err.message));
    }
  };

  const subirComprobante = async () => {
    setError("");
    try {
      const formData = new FormData();
      formData.append("comprobante", datos.comprobante);
      await api.post(`/boletos/${boletoCreado.id}/comprobante`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPaso(4);
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

        {/* PASO 0: RESUMEN */}
        {paso === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" fontWeight="bold">Resumen de tu compra</Typography>

            {/* Información de la ruta */}
            <Paper elevation={2} sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                📍 Ruta
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {rutaSeleccionada?.origen || "Origen"} → {rutaSeleccionada?.destino || "Destino"}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
                <Typography variant="body2">
                  📅 {rutaSeleccionada?.fecha ? new Date(rutaSeleccionada.fecha).toLocaleDateString("es-EC") : "Fecha no disponible"}
                </Typography>
                <Typography variant="body2">
                  🕐 {rutaSeleccionada?.hora_salida || "Hora no disponible"}
                </Typography>
              </Box>
            </Paper>

            {/* Asientos seleccionados */}
            <Paper elevation={2} sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                💺 Asientos seleccionados
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {asientosSeleccionados.map((asiento) => (
                  <Chip
                    key={asiento.id}
                    label={`Asiento ${asiento.numero} - Piso ${asiento.piso}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Precio por asiento: ${(() => {
                  const precio = Number(asientosSeleccionados[0]?.precio) || Number(rutaSeleccionada?.precio) || 0;
                  return precio.toFixed(2);
                })()}
              </Typography>
            </Paper>

            {/* Total a pagar */}
            <Paper elevation={3} sx={{ p: 2, bgcolor: "#e0f2fe", borderRadius: 3, border: "1px solid #7dd3fc" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight="bold">Total a pagar</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  ${(() => {
                    const total = asientosSeleccionados.reduce((sum, asiento) => {
                      const precio = Number(asiento?.precio) || 0;
                      return sum + precio;
                    }, 0);
                    return total.toFixed(2);
                  })()}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {asientosSeleccionados.length} asiento{asientosSeleccionados.length !== 1 ? "s" : ""}
              </Typography>
            </Paper>

            {/* Botones de acción */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  localStorage.removeItem("compraEnProceso");
                  navigate("/");
                }}
                sx={{ py: 1.5, borderRadius: 3, flex: 1 }}
              >
                Cancelar compra
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={() => setPaso(1)}
                sx={{ py: 1.5, borderRadius: 3, flex: 2 }}
              >
                Continuar con los datos del pasajero
              </Button>
            </Box>
          </Box>
        )}

      {/* PASO 1: DATOS DEL PASAJERO (CON VALIDACIONES) */}
      {paso === 1 && (
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
                  ? "Ingresa un correo válido (ej: nombre@correo.com)" 
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

      {/* PASO 2: MÉTODO DE PAGO (CON VALIDACIONES) */}
      {paso === 2 && (
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

      {/* PASO 3: SUBIR COMPROBANTE */}
      {paso === 3 && (
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

      {/* PASO 4: CONFIRMACIÓN */}
      {paso === 4 && boletoCreado && (
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
            <Button variant="contained" onClick={() => {
                    localStorage.removeItem("compraEnProceso"); // Limpiar flag
                    navigate("/");
                  }}
                >
              Adquirir otro boleto
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}