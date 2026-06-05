import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  Email,
  CheckCircle,
} from '@mui/icons-material';
import api from '../../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  // Paso actual: 1 = formulario de datos, 2 = verificación de código
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Solo permitir números en cédula
    if (name === 'cedula' && value !== '' && !/^\d*$/.test(value)) return;
    if (name === 'cedula' && value.length > 10) return;

    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
    setError('');
  };

  const validateStep1 = () => {
    if (!form.cedula || !form.nombres || !form.apellidos || !form.email || !form.password || !form.confirmPassword) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    if (form.cedula.length !== 10) {
      setError('La cédula debe tener exactamente 10 dígitos');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Ingresa un correo electrónico válido');
      return false;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSendCode = async () => {
    if (!validateStep1()) return;

    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/register/send-code', {
        cedula: form.cedula,
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        password: form.password,
      });
      setSuccess(data.message);
      setStep(2);
    } catch (err) {
      const message = err.response?.data?.message || 'Error al enviar el código de verificación';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/register/verify', {
        email: form.email,
        code,
      });
      setSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      const message = err.response?.data?.message || 'Error al verificar el código';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/register/resend-code', {
        email: form.email,
      });
      setSuccess(data.message);
    } catch (err) {
      const message = err.response?.data?.message || 'Error al reenviar el código';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="register">
      <Box className="register__card">
        {/* Logo */}
        <Box className="register__logo">
          <Box className="register__logo-icon">BUS</Box>
          <Typography className="register__logo-name">Flota Pelileo</Typography>
          <Typography className="register__logo-sub">Cooperativa de transporte</Typography>
        </Box>

        {/* Stepper visual */}
        <Box className="register__stepper">
          <Box className={`register__step ${step >= 1 ? 'register__step--active' : ''}`}>
            <Box className="register__step-circle">1</Box>
            <Typography className="register__step-label">Datos</Typography>
          </Box>
          <Box className={`register__step-line ${step >= 2 ? 'register__step-line--active' : ''}`} />
          <Box className={`register__step ${step >= 2 ? 'register__step--active' : ''}`}>
            <Box className="register__step-circle">2</Box>
            <Typography className="register__step-label">Verificar</Typography>
          </Box>
        </Box>

        {/* Alertas */}
        {error && (
          <Alert severity="error" className="register__alert">{error}</Alert>
        )}
        {success && (
          <Alert severity="success" className="register__alert">{success}</Alert>
        )}

        {/* ─── PASO 1: Formulario de datos ─── */}
        {step === 1 && (
          <Box className="register__form">
            <Typography className="register__title">Crear cuenta</Typography>
            <Typography className="register__subtitle">
              Completa tus datos para registrarte
            </Typography>

            <Box className="register__field">
              <Typography className="register__label">Cédula</Typography>
              <TextField
                name="cedula"
                placeholder="1234567890"
                size="small"
                fullWidth
                value={form.cedula}
                onChange={handleChange}
                className="register__input"
                slotProps={{ htmlInput: { maxLength: 10, inputMode: 'numeric' } }}
              />
            </Box>

            <Box className="register__row">
              <Box className="register__field register__field--half">
                <Typography className="register__label">Nombres</Typography>
                <TextField
                  name="nombres"
                  placeholder="Juan Carlos"
                  size="small"
                  fullWidth
                  value={form.nombres}
                  onChange={handleChange}
                  className="register__input"
                />
              </Box>
              <Box className="register__field register__field--half">
                <Typography className="register__label">Apellidos</Typography>
                <TextField
                  name="apellidos"
                  placeholder="Pérez López"
                  size="small"
                  fullWidth
                  value={form.apellidos}
                  onChange={handleChange}
                  className="register__input"
                />
              </Box>
            </Box>

            <Box className="register__field">
              <Typography className="register__label">Correo electrónico</Typography>
              <TextField
                name="email"
                type="email"
                placeholder="ejemplo@gmail.com"
                size="small"
                fullWidth
                value={form.email}
                onChange={handleChange}
                className="register__input"
              />
            </Box>

            <Box className="register__row">
              <Box className="register__field register__field--half">
                <Typography className="register__label">Contraseña</Typography>
                <TextField
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  size="small"
                  fullWidth
                  value={form.password}
                  onChange={handleChange}
                  className="register__input"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
              <Box className="register__field register__field--half">
                <Typography className="register__label">Confirmar</Typography>
                <TextField
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  size="small"
                  fullWidth
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="register__input"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              className="register__btn"
              onClick={handleSendCode}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Email />}
            >
              {loading ? 'Enviando código...' : 'Enviar código de verificación'}
            </Button>

            <Box className="register__footer">
              <Typography className="register__footer-text">
                ¿Ya tienes una cuenta?{' '}
                <span className="register__link" onClick={() => navigate('/login')}>
                  Inicia sesión
                </span>
              </Typography>
            </Box>
          </Box>
        )}

        {/* ─── PASO 2: Verificación de código ─── */}
        {step === 2 && (
          <Box className="register__form">
            <Box className="register__verify-icon">
              <Email sx={{ fontSize: 48, color: '#C62828' }} />
            </Box>

            <Typography className="register__title">Verifica tu correo</Typography>
            <Typography className="register__subtitle">
              Hemos enviado un código de 6 dígitos a<br />
              <strong>{form.email}</strong>
            </Typography>

            <Box className="register__field">
              <Typography className="register__label">Código de verificación</Typography>
              <TextField
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                size="small"
                fullWidth
                className="register__input register__input--code"
                slotProps={{
                  htmlInput: {
                    maxLength: 6,
                    inputMode: 'numeric',
                    style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 700 },
                  }
                }}
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              className="register__btn"
              onClick={handleVerify}
              disabled={loading || code.length !== 6}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            >
              {loading ? 'Verificando...' : 'Completar registro'}
            </Button>

            <Box className="register__footer">
              <Typography className="register__footer-text">
                ¿No recibiste el código?{' '}
                <span className="register__link" onClick={handleResendCode}>
                  Reenviar código
                </span>
              </Typography>
              <Typography
                className="register__footer-text register__back"
                onClick={() => { setStep(1); setError(''); setSuccess(''); setCode(''); }}
              >
                <ArrowBack sx={{ fontSize: 16, mr: 0.5 }} />
                Volver a los datos
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Register;
