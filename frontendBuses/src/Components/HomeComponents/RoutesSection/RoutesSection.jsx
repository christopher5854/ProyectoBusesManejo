"use client";
import { Box, Typography, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChairIcon from "@mui/icons-material/Chair";
import PlaceIcon from "@mui/icons-material/Place";
import './RoutesSection.css';

const rutas = [
  {
    tipo: "directo",
    precio: "$5.00",
    origen: "Ambato",
    destino: "Quito",
    duracion: "2h 30min",
    asiento: "Normal / VIP",
    paradas: null,
  },
  {
    tipo: "paradas",
    precio: "$3.50",
    origen: "Ambato",
    destino: "Guayaquil",
    duracion: "6h 30min",
    asiento: "Normal",
    paradas: "Riobamba · Cuenca",
  },
  {
    tipo: "directo",
    precio: "$3.00",
    origen: "Pelileo",
    destino: "Quito",
    duracion: "2h 00min",
    asiento: "Normal",
    paradas: null,
  },
  {
    tipo: "paradas",
    precio: "$2.50",
    origen: "Baños",
    destino: "Quito",
    duracion: "3h 00min",
    asiento: "Normal",
    paradas: "Ambato · Latacunga",
  },
  {
    tipo: "directo",
    precio: "$4.50",
    origen: "Ambato",
    destino: "Riobamba",
    duracion: "1h 30min",
    asiento: "Normal / VIP",
    paradas: null,
  },
  {
    tipo: "paradas",
    precio: "$6.00",
    origen: "Ambato",
    destino: "Loja",
    duracion: "8h 00min",
    asiento: "Normal",
    paradas: "Riobamba · Cuenca",
  },
];

const RoutesSection = () => {
  return (
    <section className="routes">

      {/* Encabezado */}
      <Box className="routes__header">
        <Typography className="routes__eyebrow">Nuestras rutas</Typography>
        <Typography className="routes__title">Destinos disponibles</Typography>
      </Box>

      {/* Grid de tarjetas */}
      <Box className="routes__grid">
        {rutas.map((ruta, index) => (
          <Box key={index} className="routes__card">

            {/* Top: badge + precio */}
            <Box className="routes__card-top">
              <Chip
                label={ruta.tipo === "directo" ? "Directo" : "Con paradas"}
                size="small"
                className={
                  ruta.tipo === "directo"
                    ? "routes__badge-directo"
                    : "routes__badge-paradas"
                }
              />
              <Typography className="routes__precio">{ruta.precio}</Typography>
            </Box>

            {/* Ruta: origen → destino */}
            <Box className="routes__ruta">
              <Typography className="routes__ciudad">{ruta.origen}</Typography>
              <Typography className="routes__flecha">→</Typography>
              <Typography className="routes__ciudad">{ruta.destino}</Typography>
            </Box>

            {/* Chips de info */}
            <Box className="routes__chips">
              <Box className="routes__chip">
                <AccessTimeIcon className="routes__chip-icon" />
                <Typography className="routes__chip-text">{ruta.duracion}</Typography>
              </Box>
              <Box className="routes__chip">
                <ChairIcon className="routes__chip-icon" />
                <Typography className="routes__chip-text">{ruta.asiento}</Typography>
              </Box>
              {ruta.paradas && (
                <Box className="routes__chip">
                  <PlaceIcon className="routes__chip-icon" />
                  <Typography className="routes__chip-text">{ruta.paradas}</Typography>
                </Box>
              )}
            </Box>

          </Box>
        ))}
      </Box>

    </section>
  );
};

RoutesSection.propTypes = {};

export default RoutesSection;