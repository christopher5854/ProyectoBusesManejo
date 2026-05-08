"use client";
import { useContext } from "react";
import { Box, Typography, Button, TextField, MenuItem, Select, FormControl } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SearchIcon from "@mui/icons-material/Search";
import { UserContext } from "../../../Context/UserContext";
import './Hero.css';


const rutasFrecuentes = [
  "Ambato → Quito",
  "Pelileo → Quito",
  "Ambato → Guayaquil",
  "Baños → Quito",
  "Ambato → Riobamba",
];

const Hero = () => {
  const { cooperativa } = useContext(UserContext);

  return (
    <section className="hero">

      {/* Tag superior */}
      <Box className="hero__tag">
        <span>📍</span>
        <Typography className="hero__tag-text">
          Rutas interprovinciales · Ecuador
        </Typography>
      </Box>

      {/* Título */}
      <Typography className="hero__title">
        Viaja con <span className="hero__title-accent">
          {cooperativa.nombre || "Flota Pelileo"}
        </span><br />desde donde estés
      </Typography>

      {/* Subtítulo */}
      <Typography className="hero__subtitle">
        Compra tu pasaje en línea, elige tu asiento y recibe tu código QR al instante.
        Sin filas, sin complicaciones.
      </Typography>

      {/* Buscador */}
      <Box className="hero__search">

        {/* Fila origen / swap / destino */}
        <Box className="hero__search-grid">
          <Box className="hero__field">
            <Typography className="hero__field-label">Origen</Typography>
            <TextField
              placeholder="Ciudad de salida..."
              size="small"
              fullWidth
              className="hero__input"
            />
          </Box>

          <Box className="hero__swap">
            <SwapHorizIcon className="hero__swap-icon" />
          </Box>

          <Box className="hero__field">
            <Typography className="hero__field-label">Destino</Typography>
            <TextField
              placeholder="Ciudad de llegada..."
              size="small"
              fullWidth
              className="hero__input"
            />
          </Box>
        </Box>

        {/* Fila fecha / pasajeros / tipo asiento / botón */}
        <Box className="hero__search-bottom">
          <Box className="hero__field">
            <Typography className="hero__field-label">Fecha</Typography>
            <TextField
              type="date"
              size="small"
              fullWidth
              className="hero__input"
            />
          </Box>

          <Box className="hero__field">
            <Typography className="hero__field-label">Pasajeros</Typography>
            <FormControl size="small" fullWidth>
              <Select defaultValue={1} className="hero__select">
                <MenuItem value={1}>1 pasajero</MenuItem>
                <MenuItem value={2}>2 pasajeros</MenuItem>
                <MenuItem value={3}>3 pasajeros</MenuItem>
                <MenuItem value={4}>4+ pasajeros</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box className="hero__field">
            <Typography className="hero__field-label">Tipo de asiento</Typography>
            <FormControl size="small" fullWidth>
              <Select defaultValue="cualquiera" className="hero__select">
                <MenuItem value="cualquiera">Cualquiera</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="vip">VIP</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            className="hero__btn-search"
            startIcon={<SearchIcon />}
          >
            Buscar
          </Button>
        </Box>
      </Box>

      {/* Pills rutas frecuentes */}
      <Box className="hero__pills-wrap">
        <Typography className="hero__pills-label">Rutas frecuentes:</Typography>
        <Box className="hero__pills">
          {rutasFrecuentes.map((ruta) => (
            <Box key={ruta} className="hero__pill">
              {ruta}
            </Box>
          ))}
        </Box>
      </Box>

    </section>
  );
};

Hero.propTypes = {};

export default Hero;