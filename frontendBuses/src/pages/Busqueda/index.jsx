import { useState } from "react";
import { Box, Container, TextField, Typography, Paper, Grid } from "@mui/material";

export default function BusquedaPage() {
  const [form, setForm] = useState({
    origen: "",
    destino: "",
    fecha: "",
    pasajeros: 1,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
          Buscar Rutas
        </Typography>
        <Box component="form">
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
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}