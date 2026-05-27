"use client";
//import { useContext, useState } from "react";
import {AppBar,Toolbar,Typography,Button,Box,} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" elevation={0} className="header">
      <Toolbar className="header__toolbar">

        <Box className="header__logo">
          <Box className="header__logo-icon">
            <DirectionsBusIcon className="header__logo-bus-icon" />
          </Box>
          <Box>
            <Typography className="header__logo-name">
              Flota Pelileo
            </Typography>
            <Typography className="header__logo-sub">
              Cooperativa de transporte
            </Typography>
          </Box>
        </Box>

        <Box className="header__nav">
          {["Rutas", "Horarios", "Nosotros", "Contacto"].map((item) => (
            <Typography key={item} className="header__nav-link">
              {item}
            </Typography>
          ))}
        </Box>

        {/* Actions */}
        <Box className="header__actions">
          <Button
            variant="outlined"
            size="small"
            className="header__btn-ghost"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </Button>
          <Button variant="contained" size="small" className="header__btn-primary">
            Comprar pasaje
          </Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {};

export default Header;