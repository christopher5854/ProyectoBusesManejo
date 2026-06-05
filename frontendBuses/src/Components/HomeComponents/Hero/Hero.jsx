"use client";
import { useContext, useState, useEffect } from "react";
import { Box, Typography, Button, TextField, MenuItem, Select, FormControl } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SearchIcon from "@mui/icons-material/Search";
import { UserContext } from "../../../Context/UserContext";
import api from '../../../services/api';
import './Hero.css';
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { cooperativa } = useContext(UserContext);
  const [ciudades, setCiudades] = useState([]);
  const [rutasFrecuentes, setRutasFrecuentes] = useState([]);
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const navigate = useNavigate();
  const [fecha, setFecha] = useState("");
  const [pasajeros, setPasajeros] = useState(1);
  const [tipoAsiento, setTipoAsiento] = useState("cualquiera");

  useEffect(() => {
    const loadCiudades = async () => {
      try {
        const { data } = await api.get('/ciudades');
        setCiudades(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching ciudades:", err);
      }
    };

    const loadRutas = async () => {
      try {
        const { data } = await api.get('/rutas');
        if (!Array.isArray(data)) return;
        const unicas = new Set();
        data.forEach(r => unicas.add(`${r.origen} → ${r.destino}`));
        setRutasFrecuentes(Array.from(unicas).slice(0, 5));
      } catch (err) {
        console.error("Error fetching rutas:", err);
      }
    };

    loadCiudades();
    loadRutas();
  }, []);

  return (
    <section className="hero">

      <Box className="hero__tag">
        <span>📍</span>
        <Typography className="hero__tag-text">
          Rutas interprovinciales · Ecuador
        </Typography>
      </Box>

      <Typography className="hero__title">
        Viaja con <span className="hero__title-accent">
          {cooperativa.nombre || "Flota Pelileo"}
        </span><br />desde donde estés
      </Typography>

      <Typography className="hero__subtitle">
        Compra tu pasaje en línea, elige tu asiento y recibe tu código QR al instante.
        Sin filas, sin complicaciones.
      </Typography>

      <Box className="hero__search">

        <Box className="hero__search-grid">
          <Box className="hero__field">
            <Typography className="hero__field-label">Origen</Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                displayEmpty
                className="hero__select"
              >
                <MenuItem value="" disabled>Ciudad de salida...</MenuItem>
                {ciudades.map(c => (
                  <MenuItem key={c.nombre} value={c.nombre}>{c.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box className="hero__swap">
            <SwapHorizIcon className="hero__swap-icon" />
          </Box>

          <Box className="hero__field">
            <Typography className="hero__field-label">Destino</Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                displayEmpty
                className="hero__select"
              >
                <MenuItem value="" disabled>Ciudad de llegada...</MenuItem>
                {ciudades.map(c => (
                  <MenuItem key={c.nombre} value={c.nombre}>{c.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box className="hero__search-bottom">
          <Box className="hero__field">
            <Typography className="hero__field-label">Fecha</Typography>
            <TextField
              type="date"
              size="small"
              fullWidth
              className="hero__input"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </Box>

          <Box className="hero__field">
            <Typography className="hero__field-label">Pasajeros</Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={pasajeros}
                onChange={(e) => setPasajeros(e.target.value)}
                className="hero__select"
              >
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
              <Select
                value={tipoAsiento}
                onChange={(e) => setTipoAsiento(e.target.value)}
                className="hero__select"
              >
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
            disabled={!origen || !destino || !fecha}
            onClick={() => {
              const busqueda = { origen, destino, fecha, pasajeros, tipoAsiento };
              localStorage.setItem('busquedaRuta', JSON.stringify(busqueda));
              navigate(`/buscar/resultados?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}&fecha=${fecha}&pasajeros=${pasajeros}&tipoAsiento=${encodeURIComponent(tipoAsiento)}`);
            }}
          >
            Buscar
          </Button>
        </Box>
      </Box>

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