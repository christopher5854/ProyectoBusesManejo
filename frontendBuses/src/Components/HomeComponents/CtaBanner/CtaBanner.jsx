"use client";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import './CtaBanner.css';

const CtaBanner = () => {
  return (
    <Box className="cta">

      {/* Texto */}
      <Box className="cta__text">
        <Typography className="cta__title">
          ¿Listo para tu próximo viaje?
        </Typography>
        <Typography className="cta__subtitle">
          Crea tu cuenta y compra tu primer pasaje en menos de 3 minutos
        </Typography>
      </Box>

      {/* Botones */}
      <Box className="cta__actions">
        <Button
          variant="contained"
          className="cta__btn-primary"
          endIcon={<ArrowForwardIcon />}
        >
          Crear cuenta gratis
        </Button>
        <Button
          variant="outlined"
          className="cta__btn-secondary"
          startIcon={<CalendarMonthIcon />}
        >
          Ver horarios
        </Button>
      </Box>

    </Box>
  );
};

export default CtaBanner;