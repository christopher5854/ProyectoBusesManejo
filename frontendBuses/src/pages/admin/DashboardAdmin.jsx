import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Card, CardContent } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PeopleIcon from "@mui/icons-material/People";
import api from "../../services/api";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    totalVentas: 0,
    ingresosMes: 0,
    totalBuses: 0,
    totalUsuarios: 0
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const res = await api.get("/estadisticas");
      setStats(res.data);
    } catch (error) {
      // Datos de ejemplo mientras no hay endpoint
      setStats({
        totalVentas: 1250,
        ingresosMes: 15430,
        totalBuses: 15,
        totalUsuarios: 342
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#C62828">
        Dashboard General
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "#666" }}>
        Bienvenido al panel de administración. Visualiza las métricas principales del sistema.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#ffebee", textAlign: "center", p: 2 }}>
            <ConfirmationNumberIcon sx={{ fontSize: 40, color: "#C62828" }} />
            <Typography variant="h4" fontWeight="bold">{stats.totalVentas}</Typography>
            <Typography color="text.secondary">Boletos Vendidos</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#e8f5e9", textAlign: "center", p: 2 }}>
            <TrendingUpIcon sx={{ fontSize: 40, color: "#2e7d32" }} />
            <Typography variant="h4" fontWeight="bold">${stats.ingresosMes}</Typography>
            <Typography color="text.secondary">Ingresos del Mes</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#e3f2fd", textAlign: "center", p: 2 }}>
            <DirectionsBusIcon sx={{ fontSize: 40, color: "#1565c0" }} />
            <Typography variant="h4" fontWeight="bold">{stats.totalBuses}</Typography>
            <Typography color="text.secondary">Buses en Flota</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#f3e5f5", textAlign: "center", p: 2 }}>
            <PeopleIcon sx={{ fontSize: 40, color: "#6a1b9a" }} />
            <Typography variant="h4" fontWeight="bold">{stats.totalUsuarios}</Typography>
            <Typography color="text.secondary">Usuarios Registrados</Typography>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Rutas más vendidas</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <span>Quito → Ambato</span>
              <span style={{ color: "#C62828", fontWeight: "bold" }}>450 ventas</span>
            </Box>
            <Box sx={{ width: "100%", bgcolor: "#e0e0e0", borderRadius: 2, height: 10 }}>
              <Box sx={{ width: "75%", bgcolor: "#C62828", borderRadius: 2, height: 10 }} />
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <span>Ambato → Quito</span>
              <span style={{ color: "#C62828", fontWeight: "bold" }}>320 ventas</span>
            </Box>
            <Box sx={{ width: "100%", bgcolor: "#e0e0e0", borderRadius: 2, height: 10 }}>
              <Box sx={{ width: "53%", bgcolor: "#C62828", borderRadius: 2, height: 10 }} />
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <span>Quito → Latacunga</span>
              <span style={{ color: "#C62828", fontWeight: "bold" }}>210 ventas</span>
            </Box>
            <Box sx={{ width: "100%", bgcolor: "#e0e0e0", borderRadius: 2, height: 10 }}>
              <Box sx={{ width: "35%", bgcolor: "#C62828", borderRadius: 2, height: 10 }} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}