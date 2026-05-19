import { Container, Typography, Paper } from "@mui/material";

export default function BusquedaPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Buscar Rutas
        </Typography>
      </Paper>
    </Container>
  );
}