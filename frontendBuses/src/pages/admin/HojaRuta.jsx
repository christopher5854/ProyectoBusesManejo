import { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from "@mui/material";
import api from "../../services/api";

export default function HojaRuta() {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRutas = async () => {
      setLoading(true);
      try {
        const res = await api.get("/rutas");
        console.log("Datos recibidos:", res.data);
        setRutas(res.data);
      } catch (error) {
        console.error("Error cargando rutas:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarRutas();
  }, []);

  const getEstadoColor = (estado) => {
    if (estado === "programada") return "warning";
    if (estado === "activa") return "success";
    if (estado === "completada") return "info";
    if (estado === "cancelada") return "error";
    return "default";
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#C62828">
        Hoja de Ruta
      </Typography>

      {rutas.length === 0 ? (
        <Typography>No hay rutas registradas.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#ffebee" }}>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Fecha</b></TableCell>
                <TableCell><b>Estado</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rutas.map((ruta) => (
                <TableRow key={ruta.id}>
                  <TableCell>{ruta.id}</TableCell>
                  <TableCell>{new Date(ruta.fecha_ruta).toLocaleDateString()}</TableCell>
                  <TableCell><Chip label={ruta.estado} color={getEstadoColor(ruta.estado)} size="small" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}