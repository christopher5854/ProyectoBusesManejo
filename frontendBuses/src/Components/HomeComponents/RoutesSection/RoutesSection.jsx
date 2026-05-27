"use client";
import { Box, Typography, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChairIcon from "@mui/icons-material/Chair";
import PlaceIcon from "@mui/icons-material/Place";
import './RoutesSection.css';



import { useState, useEffect } from "react";

const RoutesSection = () => {
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/rutas")
      .then((res) => res.json())
      .then((data) => setRutas(data))
      .catch((err) => console.error("Error al obtener rutas:", err));
  }, []);

  return (
    <section className="routes">

      {/* Encabezado */}
      <Box className="routes__header">
        <Typography className="routes__eyebrow">Nuestras rutas</Typography>
        <Typography className="routes__title">Destinos disponibles</Typography>
      </Box>

      {/* Grid de tarjetas */}
      <Box className="routes__grid">
        {rutas.length > 0 ? (
          rutas.map((ruta, index) => (
            <Box key={ruta.ruta_id || index} className="routes__card">
  
              {/* Top: badge + precio */}
              <Box className="routes__card-top">
                <Chip
                  label={ruta.estado || "Disponible"}
                  size="small"
                  className={
                    ruta.estado === "Cancelado"
                      ? "routes__badge-paradas"
                      : "routes__badge-directo"
                  }
                />
                <Typography className="routes__precio">${ruta.precio}</Typography>
              </Box>
  
              {/* Ruta: origen → destino */}
              <Box className="routes__ruta">
                <Typography className="routes__ciudad">{ruta.ciudad_origen}</Typography>
                <Typography className="routes__flecha">→</Typography>
                <Typography className="routes__ciudad">{ruta.ciudad_destino}</Typography>
              </Box>
  
              {/* Chips de info */}
              <Box className="routes__chips">
                <Box className="routes__chip">
                  <AccessTimeIcon className="routes__chip-icon" />
                  <Typography className="routes__chip-text">{ruta.hora_salida}</Typography>
                </Box>
                <Box className="routes__chip">
                  <ChairIcon className="routes__chip-icon" />
                  <Typography className="routes__chip-text">{ruta.asientos_libres} libres</Typography>
                </Box>
                <Box className="routes__chip">
                  <PlaceIcon className="routes__chip-icon" />
                  <Typography className="routes__chip-text">{new Date(ruta.fecha_ruta).toLocaleDateString()}</Typography>
                </Box>
              </Box>
  
            </Box>
          ))
        ) : (
          <Typography className="routes__empty">No hay rutas disponibles en este momento.</Typography>
        )}
      </Box>

    </section>
  );
};

RoutesSection.propTypes = {};

export default RoutesSection;