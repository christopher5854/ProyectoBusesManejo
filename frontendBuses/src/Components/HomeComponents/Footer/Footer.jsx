"use client";
import { Box, Typography } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import './Footer.css';

const links = {
  empresa: [
    { label: "Sobre nosotros" },
    { label: "Nuestras rutas" },
    { label: "Horarios" },
    { label: "Cooperativa" },
  ],
  soporte: [
    { label: "Centro de ayuda" },
    { label: "Contacto" },
    { label: "Política de reembolso" },
    { label: "Preguntas frecuentes" },
  ],
  legal: [
    { label: "Términos de uso" },
    { label: "Privacidad" },
    { label: "Cookies" },
  ],
};

const Footer = () => {
  return (
    <footer className="footer">

      {/* Parte superior */}
      <Box className="footer__top">

        {/* Logo y descripción */}
        <Box className="footer__brand">
          <Box className="footer__logo">
            <Box className="footer__logo-icon">
              <DirectionsBusIcon className="footer__logo-bus" />
            </Box>
            <Typography className="footer__logo-name">Flota Pelileo</Typography>
          </Box>
          <Typography className="footer__brand-desc">
            Conectando ciudades del Ecuador con comodidad, puntualidad y seguridad
            desde hace más de 30 años.
          </Typography>
          {/* Redes sociales */}
          <Box className="footer__socials">
            <Box className="footer__social-btn">
              <FacebookIcon className="footer__social-icon" />
            </Box>
            <Box className="footer__social-btn">
              <InstagramIcon className="footer__social-icon" />
            </Box>
            <Box className="footer__social-btn">
              <WhatsAppIcon className="footer__social-icon" />
            </Box>
          </Box>
        </Box>

        {/* Links empresa */}
        <Box className="footer__col">
          <Typography className="footer__col-title">Empresa</Typography>
          {links.empresa.map((link) => (
            <Typography key={link.label} className="footer__link">
              {link.label}
            </Typography>
          ))}
        </Box>

        {/* Links soporte */}
        <Box className="footer__col">
          <Typography className="footer__col-title">Soporte</Typography>
          {links.soporte.map((link) => (
            <Typography key={link.label} className="footer__link">
              {link.label}
            </Typography>
          ))}
        </Box>

        {/* Links legal */}
        <Box className="footer__col">
          <Typography className="footer__col-title">Legal</Typography>
          {links.legal.map((link) => (
            <Typography key={link.label} className="footer__link">
              {link.label}
            </Typography>
          ))}
        </Box>

      </Box>

      {/* Divider */}
      <Box className="footer__divider" />

      {/* Parte inferior */}
      <Box className="footer__bottom">
        <Typography className="footer__copy">
          © 2025 Cooperativa Flota Pelileo · Ecuador. Todos los derechos reservados.
        </Typography>
        <Typography className="footer__powered">
          Regulada por la ANT · Ecuador
        </Typography>
      </Box>

    </footer>
  );
};

Footer.propTypes = {};

export default Footer;