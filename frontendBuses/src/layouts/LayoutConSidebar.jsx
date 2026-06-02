import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar, Box, Toolbar, Typography, IconButton,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, Avatar
} from "@mui/material";
import {
  Menu as MenuIcon, Dashboard, DirectionsBus, People,
  Schedule, Payment, QrCodeScanner, Logout, ConfirmationNumber, EventNote
} from "@mui/icons-material";

const drawerWidth = 260;

const menus = {
admin: [
  { texto: "Dashboard", icono: <Dashboard />, ruta: "/admin/dashboard" },
  { texto: "Buses", icono: <DirectionsBus />, ruta: "/admin/buses" },
  { texto: "Usuarios", icono: <People />, ruta: "/admin/usuarios" },
  { texto: "Frecuencias", icono: <Schedule />, ruta: "/admin/frecuencias" },
  { texto: "Hoja de Ruta", icono: <EventNote />, ruta: "/admin/hoja-ruta" },
],
  oficinista: [
    { texto: "Dashboard", icono: <Dashboard />, ruta: "/oficinista/dashboard" },
    { texto: "Vender Boleto", icono: <ConfirmationNumber />, ruta: "/oficinista/venta-boletos" },
    { texto: "Pagos Pendientes", icono: <Payment />, ruta: "/oficinista/pagos-pendientes" },
  ],
  personal_bus: [
    { texto: "Escanear QR", icono: <QrCodeScanner />, ruta: "/bus/escaneo" },
  ],
  cliente: [
    { texto: "Mis Boletos", icono: <ConfirmationNumber />, ruta: "/historial" },
  ]
};

export default function LayoutConSidebar({ rol, children }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const menuItems = menus[rol] || menus.cliente;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: "#C62828" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setOpen(!open)} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flota Pelileo - {rol?.toUpperCase() || "CLIENTE"}
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {usuario.nombres} {usuario.apellidos}
          </Typography>
          <Avatar sx={{ bgcolor: "#FFC107", color: "#333" }}>
            {usuario.nombres?.charAt(0) || "U"}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 73,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 73,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            mt: 8
          },
        }}
      >
        <Box sx={{ mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.texto}
                onClick={() => navigate(item.ruta)}
                sx={{
                  '&:hover': { backgroundColor: "#ffebee" },
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  justifyContent: open ? 'initial' : 'center',
                  px: open ? 2 : 1
                }}
              >
                <ListItemIcon sx={{ color: "#C62828", minWidth: open ? 40 : 'auto', justifyContent: 'center' }}>
                  {item.icono}
                </ListItemIcon>
                {open && <ListItemText primary={item.texto} />}
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                '&:hover': { backgroundColor: "#ffebee" },
                borderRadius: 2,
                mx: 1,
                justifyContent: open ? 'initial' : 'center',
                px: open ? 2 : 1
              }}
            >
              <ListItemIcon sx={{ color: "#C62828", minWidth: open ? 40 : 'auto', justifyContent: 'center' }}>
                <Logout />
              </ListItemIcon>
              {open && <ListItemText primary="Cerrar Sesión" />}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}