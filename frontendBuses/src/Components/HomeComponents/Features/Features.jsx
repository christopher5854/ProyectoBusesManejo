"use client";
import { Box, Typography } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PlaceIcon from "@mui/icons-material/Place";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HistoryIcon from "@mui/icons-material/History";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import QrCodeIcon from "@mui/icons-material/QrCode";
import './Features.css';


const features = [
  {
    icon: <LocalOfferIcon className="features__icon" />,
    colorBg: "#FEF2F2",
    colorIcon: "#B91C1C",
    titulo: "Descuentos especiales",
    descripcion: "Tercera edad, discapacidad y menores con validación automática por cédula.",
  },
  {
    icon: <PlaceIcon className="features__icon" />,
    colorBg: "#F0FDF4",
    colorIcon: "#16a34a",
    titulo: "Paradas intermedias",
    descripcion: "Sube o baja en cualquier parada de la ruta, no solo en los extremos.",
  },
  {
    icon: <NotificationsIcon className="features__icon" />,
    colorBg: "#FFF7ED",
    colorIcon: "#d97706",
    titulo: "Notificaciones",
    descripcion: "Recibe confirmación y recordatorio de tu viaje por correo electrónico.",
  },
  {
    icon: <HistoryIcon className="features__icon" />,
    colorBg: "#EFF6FF",
    colorIcon: "#1D4ED8",
    titulo: "Historial de boletos",
    descripcion: "Accede y descarga tus pasajes anteriores cuando los necesites.",
  },
  {
    icon: <DirectionsBusIcon className="features__icon" />,
    colorBg: "#F5F3FF",
    colorIcon: "#7c3aed",
    titulo: "Info del bus",
    descripcion: "Consulta placa, carrocería, chasis y fotografía antes de comprar.",
  },
  {
    icon: <QrCodeIcon className="features__icon" />,
    colorBg: "#ECFEFF",
    colorIcon: "#0891b2",
    titulo: "Acceso por QR",
    descripcion: "El personal escanea tu código al abordar. Rápido y sin papel.",
  },
];

const Features = () => {
  return (
    <section className="features">

      {/* Encabezado */}
      <Box className="features__header">
        <Typography className="features__eyebrow">Beneficios</Typography>
        <Typography className="features__title">Por qué viajar con nosotros</Typography>
      </Box>

      {/* Grid */}
      <Box className="features__grid">
        {features.map((feat, index) => (
          <Box key={index} className="features__card">

            {/* Ícono */}
            <Box
              className="features__icon-wrap"
              style={{ backgroundColor: feat.colorBg }}
            >
              <Box style={{ color: feat.colorIcon, display: "flex" }}>
                {feat.icon}
              </Box>
            </Box>

            {/* Texto */}
            <Typography className="features__card-titulo">{feat.titulo}</Typography>
            <Typography className="features__card-desc">{feat.descripcion}</Typography>

          </Box>
        ))}
      </Box>

    </section>
  );
};

Features.propTypes = {};

export default Features;