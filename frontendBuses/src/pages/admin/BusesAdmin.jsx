import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Chip, Alert, InputAdornment, Tooltip
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import api from "../../services/api";

const MAX_CAPACIDAD = 100;

export default function BusesAdmin() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [nuevoBus, setNuevoBus] = useState({
    placa: "",
    numero_interno: "",
    capacidad_total: 40,
    marca_chasis: "",
  });

  const cargarBuses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/buses");
      setBuses(res.data);
    } catch (error) {
      console.error("Error cargando buses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCapacidadChange = (e) => {
    let val = parseInt(e.target.value) || 0;
    if (val > MAX_CAPACIDAD) val = MAX_CAPACIDAD;
    if (val < 1) val = 1;
    setNuevoBus({ ...nuevoBus, capacidad_total: val });
  };

  const crearBus = async () => {
    setError("");
    if (!nuevoBus.placa || !nuevoBus.numero_interno || !nuevoBus.marca_chasis) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (nuevoBus.capacidad_total > MAX_CAPACIDAD) {
      setError(`La capacidad máxima permitida es ${MAX_CAPACIDAD} asientos.`);
      return;
    }
    try {
      await api.post("/buses", nuevoBus);
      setOpen(false);
      cargarBuses();
      setNuevoBus({ placa: "", numero_interno: "", capacidad_total: 40, marca_chasis: "" });
    } catch (error) {
      setError("Error al crear el bus: " + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        const res = await api.get("/buses");
        setBuses(res.data);
      } catch (error) {
        console.error("Error cargando buses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <CircularProgress color="error" />
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ p: 1, bgcolor: "#ffebee", borderRadius: 2 }}>
            <DirectionsBusIcon sx={{ color: "#C62828", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#C62828">Gestión de Buses</Typography>
            <Typography variant="body2" color="text.secondary">
              {buses.length} bus{buses.length !== 1 ? "es" : ""} registrado{buses.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{ bgcolor: "#C62828", "&:hover": { bgcolor: "#b71c1c" }, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          onClick={() => { setError(""); setOpen(true); }}
          startIcon={<span>+</span>}
        >
          Nuevo Bus
        </Button>
      </Box>

      {/* Alerta de límite */}
      <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }} icon={<InfoOutlinedIcon />}>
        La capacidad máxima permitida por bus es de <strong>{MAX_CAPACIDAD} asientos</strong>.
      </Alert>

      {/* Tabla */}
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f3f4f6", borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fff5f5" }}>
            <TableRow>
              {["ID", "Placa", "N.º Interno", "Capacidad", "Marca Chasis"].map((col) => (
                <TableCell key={col} sx={{ fontWeight: 700, color: "#7f1d1d", fontSize: 13 }}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {buses.map((bus) => (
              <TableRow key={bus.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                <TableCell sx={{ color: "text.secondary", fontSize: 13 }}>#{bus.id}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{bus.placa}</TableCell>
                <TableCell>{bus.numero_interno}</TableCell>
                <TableCell>
                  <Chip
                    label={`${bus.capacidad_total} asientos`}
                    size="small"
                    sx={{
                      bgcolor: bus.capacidad_total > MAX_CAPACIDAD ? "#fef2f2" : "#f0fdf4",
                      color: bus.capacidad_total > MAX_CAPACIDAD ? "#991b1b" : "#166534",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  />
                </TableCell>
                <TableCell>{bus.marca_chasis}</TableCell>
              </TableRow>
            ))}
            {buses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No hay buses registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Registrar nuevo bus</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth label="Placa" margin="dense" value={nuevoBus.placa}
            onChange={(e) => setNuevoBus({ ...nuevoBus, placa: e.target.value })}
            placeholder="Ej: ABC-1234"
          />
          <TextField
            fullWidth label="Número Interno" margin="dense" value={nuevoBus.numero_interno}
            onChange={(e) => setNuevoBus({ ...nuevoBus, numero_interno: e.target.value })}
            placeholder="Ej: 042"
          />
          <TextField
            fullWidth label="Capacidad Total" margin="dense" type="number"
            value={nuevoBus.capacidad_total}
            onChange={handleCapacidadChange}
            inputProps={{ min: 1, max: MAX_CAPACIDAD }}
            helperText={`Máximo ${MAX_CAPACIDAD} asientos permitidos`}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={`El sistema limita la capacidad a ${MAX_CAPACIDAD} asientos por bus.`}>
                    <InfoOutlinedIcon fontSize="small" sx={{ color: "text.disabled", cursor: "help" }} />
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth label="Marca Chasis" margin="dense" value={nuevoBus.marca_chasis}
            onChange={(e) => setNuevoBus({ ...nuevoBus, marca_chasis: e.target.value })}
            placeholder="Ej: Mercedes-Benz"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: "none" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#C62828", "&:hover": { bgcolor: "#b71c1c" }, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
            onClick={crearBus}
          >
            Guardar bus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
    