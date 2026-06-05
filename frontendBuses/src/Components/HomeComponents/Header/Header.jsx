"use client";
import { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/UserContext';
import { useAuthStore } from '../../../store/authStore';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { resetUsuario } = useContext(UserContext);
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    resetUsuario();
    useAuthStore.getState().logout();
    navigate('/login', { replace: true });
  };

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

        <Box className="header__actions">
          {!isAuthenticated && (
            <Button
              variant="outlined"
              size="small"
              className="header__btn-ghost"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </Button>
          )}
          <Button variant="contained" size="small" className="header__btn-primary">
            Comprar pasaje
          </Button>
          <Button color="inherit" onClick={() => navigate('/historial')}>
            Mi historial
          </Button>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {};

export default Header;