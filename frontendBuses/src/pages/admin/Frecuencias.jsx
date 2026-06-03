import { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import api from "../../services/api";

export default function Frecuencias() {
  const [frecuencias, setFrecuencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [ciudades, setCiudades] = useState([]);
  const [nuevaFrecuencia, setNuevaFrecuencia] = useState({
    origen: "",
    destino: "",
    hora_salida: "",
    precio: 0,
    tipo_viaje: "ordinario"
  });

  const cargarFrecuencias = async () => {
    setLoading(true);
    try {
      const res = await api.get("/frecuencias");
      setFrecuencias(res.data);
    } catch (error) {
      console.error("Error cargando frecuencias:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarCiudades = async () => {
    try {
      const res = await api.get("/ciudades");
      setCiudades(res.data);
    } catch (error) {
      console.error("Error cargando ciudades:", error);
    }
  };

  const crearFrecuencia = async () => {
    try {
      await api.post("/frecuencias", nuevaFrecuencia);
      setOpen(false);
      cargarFrecuencias();
      setNuevaFrecuencia({ origen: "", destino: "", hora_salida: "", precio: 0, tipo_viaje: "ordinario" });
    } catch (error) {
      console.error("Error creando frecuencia:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await cargarFrecuencias();
      await cargarCiudades();
    };
    init();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#C62828">
        Gestión de Frecuencias
      </Typography>
      <Button variant="contained" sx={{ bgcolor: "#C62828", mb: 2 }} onClick={() => setOpen(true)}>
        + Nueva Frecuencia
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#ffebee" }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Origen</b></TableCell>
              <TableCell><b>Destino</b></TableCell>
              <TableCell><b>Hora Salida</b></TableCell>
              <TableCell><b>Precio</b></TableCell>
              <TableCell><b>Tipo Viaje</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {frecuencias.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.id}</TableCell>
                <TableCell>{f.ciudad_origen || f.origen}</TableCell>
                <TableCell>{f.ciudad_destino || f.destino}</TableCell>
                <TableCell>{f.hora_salida}</TableCell>
                <TableCell>${f.precio}</TableCell>
                <TableCell>{f.tipo_viaje}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Frecuencia</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Origen"
            margin="dense"
            value={nuevaFrecuencia.origen}
            onChange={(e) => setNuevaFrecuencia({...nuevaFrecuencia, origen: e.target.value})}
            SelectProps={{ native: true }}
          >
            <option value="">Seleccione origen</option>
            {ciudades.map(c => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Destino"
            margin="dense"
            value={nuevaFrecuencia.destino}
            onChange={(e) => setNuevaFrecuencia({...nuevaFrecuencia, destino: e.target.value})}
            SelectProps={{ native: true }}
          >
            <option value="">Seleccione destino</option>
            {ciudades.map(c => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Hora Salida"
            margin="dense"
            type="time"
            value={nuevaFrecuencia.hora_salida}
            onChange={(e) => setNuevaFrecuencia({...nuevaFrecuencia, hora_salida: e.target.value})}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Precio"
            margin="dense"
            type="number"
            value={nuevaFrecuencia.precio}
            onChange={(e) => setNuevaFrecuencia({...nuevaFrecuencia, precio: parseFloat(e.target.value)})}
          />
          <TextField
            select
            fullWidth
            label="Tipo Viaje"
            margin="dense"
            value={nuevaFrecuencia.tipo_viaje}
            onChange={(e) => setNuevaFrecuencia({...nuevaFrecuencia, tipo_viaje: e.target.value})}
            SelectProps={{ native: true }}
          >
            <option value="ordinario">Ordinario</option>
            <option value="directo">Directo</option>
            <option value="ejecutivo">Ejecutivo</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor: "#C62828" }} onClick={crearFrecuencia}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}