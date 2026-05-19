import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Paper, Grid, MenuItem } from "@mui/material";

export default function BusquedaPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    origen: "",
    destino: "",
    fecha: "",
    pasajeros: 1,
  });
  const [filtros, setFiltros] = useState({
    tipoAsiento: "",
    tipoViaje: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFiltro = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ ...form, ...filtros });
    navigate(`/buscar/resultados?${params.toString()}`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
          Buscar Rutas
        </Typography>
        <Box component="form" onSubmit={handleSearch}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Origen" name="origen"
                value={form.origen} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Destino" name="destino"
                value={form.destino} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Fecha" name="fecha" type="date"
                value={form.fecha} onChange={handleChange}
                required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Pasajeros" name="pasajeros"
                type="number" value={form.pasajeros} onChange={handleChange}
                inputProps={{ min: 1, max: 10 }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Tipo de asiento"
                name="tipoAsiento" value={filtros.tipoAsiento} onChange={handleFiltro}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="VIP">VIP</MenuItem>
                <MenuItem value="Ejecutivo">Ejecutivo</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Tipo de viaje"
                name="tipoViaje" value={filtros.tipoViaje} onChange={handleFiltro}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="directo">Directo</MenuItem>
                <MenuItem value="paradas">Con paradas</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth type="submit" variant="contained" size="large">
                Buscar rutas
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}