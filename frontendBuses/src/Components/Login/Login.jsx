import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { UserContext } from '../../Context/UserContext';
import api from '../../services/api';
import './Login.css';

const Login = () => {
  const { setUsuario } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const redirigirPorRol = (rol) => {
    switch (rol) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'oficinista':
        navigate('/oficinista/dashboard');
        break;
      case 'cliente':
        navigate('/home');
        break;
      case 'personal_bus':
        navigate('/bus/escaneo');
        break;
      case 'cooperativa':
        navigate('/cooperativa/dashboard');
        break;
      default:
        navigate('/home');
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      setUsuario({
        id: data.usuario.id,
        nombre: data.usuario.nombres,
        apellido: data.usuario.apellidos,
        correo: data.usuario.email,
        rol: data.usuario.rol,
        cooperativa: data.usuario.cooperativa_id,
      });

      redirigirPorRol(data.usuario.rol);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'No se pudo conectar con el servidor';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login">
      <Box className="login__card">
        <Box className="login__logo">
          <Box className="login__logo-icon">BUS</Box>
          <Typography className="login__logo-name">Flota Pelileo</Typography>
          <Typography className="login__logo-sub">Cooperativa de transporte</Typography>
        </Box>

        <Typography className="login__title">Iniciar sesion</Typography>
        <Typography className="login__subtitle">
          Ingresa tus credenciales para continuar
        </Typography>

        {error && (
          <Alert severity="error" className="login__alert">{error}</Alert>
        )}

        <Box className="login__form">
          <Box className="login__field">
            <Typography className="login__label">Correo electronico</Typography>
            <TextField
              name="email"
              type="email"
              placeholder="ejemplo@correo.com"
              size="small"
              fullWidth
              value={form.email}
              onChange={handleChange}
              className="login__input"
            />
          </Box>

          <Box className="login__field">
            <Typography className="login__label">Contrasena</Typography>
            <TextField
              name="password"
              type="password"
              placeholder="........"
              size="small"
              fullWidth
              value={form.password}
              onChange={handleChange}
              className="login__input"
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            className="login__btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
