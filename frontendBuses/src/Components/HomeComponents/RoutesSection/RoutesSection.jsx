"use client";
import { Box, Typography, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChairIcon from "@mui/icons-material/Chair";
import PlaceIcon from "@mui/icons-material/Place";
import './RoutesSection.css';
import { useState, useEffect } from "react";
import api from '../../../services/api';

const RoutesSection = () => {
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    const loadRutas = async () => {
      try {
        const { data } = await api.get('/rutas');
        setRutas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al obtener rutas:", err);
      }
    };
    loadRutas();
  }, []);

  return (
    <section className="routes">
      <Box className="routes__header">
        <Typography className="routes__eyebrow">Nuestras rutas</Typography>
        <Typography className="routes__title">Destinos disponibles</Typography>
      </Box>

      <Box className="routes__grid">
        {rutas.length > 0 ? (
          rutas.map((ruta, index) => (
            <Box key={ruta.id || index} className="routes__card">
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
                <Typography className="routes__precio">$0.00</Typography>
              </Box>

              <Box className="routes__ruta">
                <Typography className="routes__ciudad">{ruta.origen}</Typography>
                <Typography className="routes__flecha">→</Typography>
                <Typography className="routes__ciudad">{ruta.destino}</Typography>
              </Box>

              <Box className="routes__chips">
                <Box className="routes__chip">
                  <AccessTimeIcon className="routes__chip-icon" />
                  <Typography className="routes__chip-text">{ruta.hora_salida}</Typography>
                </Box>
                <Box className="routes__chip">
                  <ChairIcon className="routes__chip-icon" />
                  <Typography className="routes__chip-text">20 libres</Typography>
                </Box>
                <Box className="routes__chip">
                  <PlaceIcon className="routes__chip-icon" />
                  <Typography className="routes__chip-text">
                    {new Date(ruta.fecha_ruta).toLocaleDateString()}
                  </Typography>
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