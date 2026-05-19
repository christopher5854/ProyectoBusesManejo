import { useState } from "react";
import { Container, Typography, Box, Stepper, Step, StepLabel } from "@mui/material";

const PASOS = ["Datos pasajero", "Método de pago", "Comprobante", "Confirmación"];

export default function PagoPage() {
  const [paso, setPaso] = useState(0);

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
    </Container>
  );
}