import { Box, Container, Typography } from "@mui/material";

export default function ResultadosPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Resultados de búsqueda
        </Typography>
      </Box>
    </Container>
  );
}