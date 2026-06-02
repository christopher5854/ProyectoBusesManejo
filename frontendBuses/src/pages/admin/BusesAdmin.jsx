import { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import api from "../../services/api";

export default function BusesAdmin() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [nuevoBus, setNuevoBus] = useState({ placa: "", numero_interno: "", capacidad_total: 40, marca_chasis: "" });

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

  const crearBus = async () => {
    try {
      await api.post("/buses", nuevoBus);
      setOpen(false);
      cargarBuses();
      setNuevoBus({ placa: "", numero_interno: "", capacidad_total: 40, marca_chasis: "" });
    } catch (error) {
      console.error("Error creando bus:", error);
    }
  };

  useEffect(() => {
    cargarBuses();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#C62828">
        Gestión de Buses
      </Typography>
      <Button variant="contained" sx={{ bgcolor: "#C62828", mb: 2 }} onClick={() => setOpen(true)}>
        + Nuevo Bus
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#ffebee" }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Placa</b></TableCell>
              <TableCell><b>Número Interno</b></TableCell>
              <TableCell><b>Capacidad</b></TableCell>
              <TableCell><b>Marca Chasis</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buses.map((bus) => (
              <TableRow key={bus.id}>
                <TableCell>{bus.id}</TableCell>
                <TableCell>{bus.placa}</TableCell>
                <TableCell>{bus.numero_interno}</TableCell>
                <TableCell>{bus.capacidad_total}</TableCell>
                <TableCell>{bus.marca_chasis}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nuevo Bus</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Placa" margin="dense" value={nuevoBus.placa} onChange={(e) => setNuevoBus({...nuevoBus, placa: e.target.value})} />
          <TextField fullWidth label="Número Interno" margin="dense" value={nuevoBus.numero_interno} onChange={(e) => setNuevoBus({...nuevoBus, numero_interno: e.target.value})} />
          <TextField fullWidth label="Capacidad Total" margin="dense" type="number" value={nuevoBus.capacidad_total} onChange={(e) => setNuevoBus({...nuevoBus, capacidad_total: parseInt(e.target.value)})} />
          <TextField fullWidth label="Marca Chasis" margin="dense" value={nuevoBus.marca_chasis} onChange={(e) => setNuevoBus({...nuevoBus, marca_chasis: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor: "#C62828" }} onClick={crearBus}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}