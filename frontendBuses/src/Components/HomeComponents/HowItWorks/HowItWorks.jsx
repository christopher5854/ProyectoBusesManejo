"use client";
import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChairIcon from "@mui/icons-material/Chair";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import QrCodeIcon from "@mui/icons-material/QrCode";
import './HowItWorks.css';

const pasos = [
  {
    numero: "1",
    icon: <SearchIcon className="how__step-icon" />,
    titulo: "Busca tu ruta",
    descripcion: "Selecciona origen, destino y fecha en el buscador.",
  },
  {
    numero: "2",
    icon: <ChairIcon className="how__step-icon" />,
    titulo: "Elige tu asiento",
    descripcion: "Ve el mapa del bus y escoge tu lugar preferido.",
  },
  {
    numero: "3",
    icon: <CreditCardIcon className="how__step-icon" />,
    titulo: "Paga en línea",
    descripcion: "Transfiere y sube tu comprobante para validación.",
  },
  {
    numero: "4",
    icon: <QrCodeIcon className="how__step-icon" />,
    titulo: "¡Listo para viajar!",
    descripcion: "Descarga tu boleto con QR y preséntalo al subir al bus.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how">

      {/* Encabezado */}
      <Box className="how__header">
        <Typography className="how__eyebrow">Proceso</Typography>
        <Typography className="how__title">¿Cómo comprar tu pasaje?</Typography>
      </Box>

      {/* Pasos */}
      <Box className="how__steps">
        {pasos.map((paso, index) => (
          <Box key={index} className="how__step">

            {/* Línea conectora (no se muestra en el último) */}
            {index < pasos.length - 1 && (
              <Box className="how__connector" />
            )}

            {/* Círculo con número */}
            <Box className="how__step-circle">
              <Typography className="how__step-numero">{paso.numero}</Typography>
            </Box>

            {/* Ícono */}
            <Box className="how__step-icon-wrap">
              {paso.icon}
            </Box>

            {/* Texto */}
            <Typography className="how__step-titulo">{paso.titulo}</Typography>
            <Typography className="how__step-desc">{paso.descripcion}</Typography>

          </Box>
        ))}
      </Box>

    </section>
  );
};

HowItWorks.propTypes = {};

export default HowItWorks;