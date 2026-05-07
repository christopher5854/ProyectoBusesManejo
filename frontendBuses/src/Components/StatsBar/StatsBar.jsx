"use client";
import { Box, Typography } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RouteIcon from "@mui/icons-material/Route";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import './StatsBar.css';


const stats = [
  {
    icon: <RouteIcon className="statsbar__icon" />,
    numero: "18+",
    label: "Rutas activas",
  },
  {
    icon: <DirectionsBusIcon className="statsbar__icon" />,
    numero: "45+",
    label: "Buses en flota",
  },
  {
    icon: <AccessTimeIcon className="statsbar__icon" />,
    numero: "120+",
    label: "Frecuencias diarias",
  },
  {
    icon: <EmojiEventsIcon className="statsbar__icon" />,
    numero: "30 años",
    label: "De experiencia",
  },
];

const StatsBar = () => {
  return (
    <Box className="statsbar">
      {stats.map((stat, index) => (
        <Box key={index} className="statsbar__item">
          {stat.icon}
          <Typography className="statsbar__numero">{stat.numero}</Typography>
          <Typography className="statsbar__label">{stat.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

StatsBar.propTypes = {};

export default StatsBar;