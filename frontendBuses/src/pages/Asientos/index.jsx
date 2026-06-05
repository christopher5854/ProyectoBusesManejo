import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Button, CircularProgress, Chip, Paper, Alert
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api from "../../services/api";

const MAX_ASIENTOS = 100;

// Colores del sistema
const COLORES = {
  disponible: { bg: "#22c55e", hover: "#16a34a", label: "Disponible" },
  seleccionado: { bg: "#2563eb", hover: "#1d4ed8", label: "Seleccionado" },
  ocupado: { bg: "#e5e7eb", hover: "#e5e7eb", text: "#9ca3af", label: "Ocupado/Vendido" },
};

function SeatIcon({ estado, numero, isSelected, isLleno, onClick }) {
  const getStyle = () => {
    if (estado === "ocupado") return { bg: COLORES.ocupado.bg, text: COLORES.ocupado.text, cursor: "not-allowed", border: "2px solid #d1d5db" };
    if (isSelected) return { bg: COLORES.seleccionado.bg, text: "#fff", cursor: "pointer", border: "2px solid #1d4ed8" };
    if (isLleno) return { bg: "#f3f4f6", text: "#9ca3af", cursor: "not-allowed", border: "2px dashed #d1d5db" };
    return { bg: COLORES.disponible.bg, text: "#fff", cursor: "pointer", border: "2px solid #16a34a" };
  };

  const s = getStyle();
  const disabled = estado === "ocupado" || isLleno;

  return (
    <Box
      onClick={!disabled ? onClick : undefined}
      title={estado === "ocupado" ? "Asiento ocupado" : isLleno ? "Selecciona menos asientos" : `Asiento ${numero}`}
      sx={{
        width: 48,
        height: 52,
        bgcolor: s.bg,
        border: s.border,
        borderRadius: "8px 8px 4px 4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: s.cursor,
        color: s.text,
        transition: "all 0.15s ease",
        position: "relative",
        userSelect: "none",
        "&:hover": !disabled ? {
          transform: "scale(1.08)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        } : {},
        "&::before": {
          content: '""',
          position: "absolute",
          top: -6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 28,
          height: 6,
          bgcolor: estado === "ocupado" ? "#d1d5db" : isSelected ? "#1e40af" : isLleno ? "#e5e7eb" : "#15803d",
          borderRadius: "4px 4px 0 0",
        }
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>
        {numero}
      </Typography>
    </Box>
  );
}

export default function AsientosPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const rutaId = params.get("rutaId");
  const pasajeros = Math.min(Number(params.get("pasajeros")) || 1, MAX_ASIENTOS);

  const [asientos, setAsientos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [error, setError] = useState("");

  // UN SOLO useEffect que maneja todo
  useEffect(() => {
    // Si hay una compra en proceso, redirigir al resumen
    const compraEnProceso = localStorage.getItem("compraEnProceso");
    if (compraEnProceso === "true") {
      navigate("/pago");
      return;
    }
    
    const loadAsientos = async () => {
      try {
        const routeData = JSON.parse(localStorage.getItem("rutaSeleccionada") || "null");
        setRutaSeleccionada(routeData);
        
        const { data } = await api.get(`/buses/${rutaId}/asientos`);
        const lista = Array.isArray(data) ? data.slice(0, MAX_ASIENTOS) : [];
        setAsientos(lista);
        
        // Siempre empezar sin asientos seleccionados
        setSeleccionados([]);
      } catch (err) {
        console.error("Error cargando asientos:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAsientos();
  }, [rutaId, navigate]);

  const toggleAsiento = (asiento) => {
    if (asiento.estado === "ocupado") return;
    setSeleccionados((prev) =>
      prev.includes(asiento.id)
        ? prev.filter((id) => id !== asiento.id)
        : prev.length < pasajeros
        ? [...prev, asiento.id]
        : prev
    );
    // Limpiar error cuando el usuario selecciona/deselecciona
    if (error) setError("");
  };

  const pisos = [...new Set(asientos.map((a) => a.piso))].sort();

  const totalPrecio = asientos
    .filter((a) => seleccionados.includes(a.id))
    .reduce((acc, a) => acc + Number(a.precio || 0), 0);

  const disponibles = asientos.filter((a) => a.estado !== "ocupado").length;
  const ocupados = asientos.filter((a) => a.estado === "ocupado").length;

  const handleContinuar = () => {
    const asientosSeleccionados = asientos.filter((a) => seleccionados.includes(a.id));
    
    // Verificar que haya seleccionado la cantidad correcta
    if (asientosSeleccionados.length !== pasajeros) {
      setError(`Debes seleccionar exactamente ${pasajeros} asiento${pasajeros > 1 ? "s" : ""}`);
      return;
    }
    
    // Calcular precio total
    const precioUnitario = asientosSeleccionados[0]?.precio || rutaSeleccionada?.precio || 0;
    const precioTotal = precioUnitario * asientosSeleccionados.length;
    
    localStorage.setItem("asientosSeleccionados", JSON.stringify(asientosSeleccionados));
    localStorage.setItem("rutaId", rutaId);
    
    if (rutaSeleccionada) {
      const rutaConPrecio = {
        ...rutaSeleccionada,
        precio: rutaSeleccionada.precio || precioUnitario
      };
      localStorage.setItem("rutaSeleccionada", JSON.stringify(rutaConPrecio));
    }
    
    localStorage.setItem("precioTotal", precioTotal);
    localStorage.setItem("precioUnitario", precioUnitario);
    localStorage.setItem("compraEnProceso", "true");
    
    navigate("/pago");
  };

  // Organizar asientos en filas de 4 (2 + pasillo + 2)
  const organizarFila = (asientosPiso) => {
    const filas = [];
    for (let i = 0; i < asientosPiso.length; i += 4) {
      filas.push(asientosPiso.slice(i, i + 4));
    }
    return filas;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3, mb: 6 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box sx={{ p: 1, bgcolor: "primary.main", borderRadius: 2, display: "flex" }}>
          <DirectionsBusIcon sx={{ color: "white", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800} color="primary.dark" lineHeight={1.1}>
            Selecciona tu asiento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Debes seleccionar {pasajeros} asiento{pasajeros > 1 ? "s" : ""}
          </Typography>
        </Box>
      </Box>

      {/* Mensaje de error */}
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Info de la ruta */}
      {rutaSeleccionada && (
        <Paper elevation={0} sx={{ mb: 3, p: 2, bgcolor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
              {rutaSeleccionada.origen}
            </Typography>
            <ArrowForwardIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
              {rutaSeleccionada.destino}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="caption" color="text.secondary">
              📅 {rutaSeleccionada.fecha ? new Date(rutaSeleccionada.fecha).toLocaleDateString("es-EC", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Fecha no disponible"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              🕐 Salida: {rutaSeleccionada.hora_salida || "Hora no disponible"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              💵 ${Number(rutaSeleccionada.precio || 0).toFixed(2)} por asiento
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Estadísticas rápidas */}
      {!loading && asientos.length > 0 && (
        <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
          <Chip
            size="small"
            label={`${disponibles} disponibles`}
            sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 600, fontSize: 12 }}
          />
          <Chip
            size="small"
            label={`${ocupados} ocupados`}
            sx={{ bgcolor: "#f1f5f9", color: "#64748b", fontWeight: 600, fontSize: 12 }}
          />
          <Chip
            size="small"
            label={`${asientos.length} asientos en total`}
            sx={{ bgcolor: "#f0f9ff", color: "#0369a1", fontWeight: 600, fontSize: 12 }}
          />
        </Box>
      )}

      {/* Leyenda */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, p: 2, bgcolor: "#f8fafc", borderRadius: 2, flexWrap: "wrap" }}>
        {Object.entries(COLORES).map(([key, val]) => (
          <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box sx={{
              width: 18,
              height: 18,
              bgcolor: val.bg,
              borderRadius: 0.5,
              border: key === "ocupado" ? "1.5px solid #d1d5db" : "none"
            }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {val.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 6, flexDirection: "column", gap: 2 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Cargando asientos...</Typography>
        </Box>
      )}

      {/* Mapa de asientos por piso */}
      {!loading && pisos.map((piso) => {
        const asientosPiso = asientos.filter((a) => a.piso === piso);
        const filas = organizarFila(asientosPiso);

        return (
          <Box key={piso} sx={{ mb: 4 }}>
            {pisos.length > 1 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Box sx={{ height: 1, flex: 1, bgcolor: "divider" }} />
                <Chip label={`Piso ${piso}`} size="small" color="primary" variant="outlined" />
                <Box sx={{ height: 1, flex: 1, bgcolor: "divider" }} />
              </Box>
            )}

            {/* Representación del bus */}
            <Paper elevation={1} sx={{
              p: 2.5,
              borderRadius: 3,
              border: "2px solid #e2e8f0",
              background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
            }}>
              {/* Frente del bus */}
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                pb: 1.5,
                borderBottom: "2px dashed #e2e8f0"
              }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                  🚌 Frente
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Box sx={{ width: 32, height: 24, bgcolor: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ fontSize: 10 }}>🚪</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">Puerta</Typography>
                </Box>
              </Box>

              {/* Filas de asientos */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {filas.map((fila, filaIdx) => (
                  <Box key={filaIdx} sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>
                    {fila.slice(0, 2).map((asiento) => (
                      <SeatIcon
                        key={asiento.id}
                        estado={asiento.estado}
                        numero={asiento.numero}
                        isSelected={seleccionados.includes(asiento.id)}
                        isLleno={seleccionados.length >= pasajeros && !seleccionados.includes(asiento.id)}
                        onClick={() => toggleAsiento(asiento)}
                      />
                    ))}
                    {/* Pasillo */}
                    <Box sx={{ width: 20 }} />
                    {fila.slice(2, 4).map((asiento) => (
                      <SeatIcon
                        key={asiento.id}
                        estado={asiento.estado}
                        numero={asiento.numero}
                        isSelected={seleccionados.includes(asiento.id)}
                        isLleno={seleccionados.length >= pasajeros && !seleccionados.includes(asiento.id)}
                        onClick={() => toggleAsiento(asiento)}
                      />
                    ))}
                    {/* Número de fila */}
                    <Typography variant="caption" color="text.disabled" sx={{ ml: 0.5, minWidth: 16 }}>
                      {filaIdx + 1}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Parte trasera del bus */}
              <Box sx={{ mt: 2, pt: 1.5, borderTop: "2px dashed #e2e8f0", textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                  🔙 Parte trasera
                </Typography>
              </Box>
            </Paper>
          </Box>
        );
      })}

      {!loading && asientos.length === 0 && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <EventSeatIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
          <Typography color="text.secondary">No hay asientos disponibles para esta ruta.</Typography>
        </Box>
      )}

      {/* Panel de resumen pegado abajo */}
      <Box sx={{ position: "sticky", bottom: 16, zIndex: 10 }}>
        {/* Resumen de selección */}
        {seleccionados.length > 0 && (
          <Paper elevation={4} sx={{
            p: 2,
            mb: 1.5,
            borderRadius: 3,
            bgcolor: "#eff6ff",
            border: "1.5px solid #93c5fd",
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" fontWeight={600} color="primary.dark">
                  Asientos seleccionados
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {asientos.filter(a => seleccionados.includes(a.id)).map(a => `Asiento ${a.numero}`).join(", ")}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" color="text.secondary">Total</Typography>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                  ${totalPrecio.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ flex: 1, height: 6, bgcolor: "#bfdbfe", borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{
                  height: "100%",
                  width: `${(seleccionados.length / pasajeros) * 100}%`,
                  bgcolor: "primary.main",
                  borderRadius: 3,
                  transition: "width 0.3s ease"
                }} />
              </Box>
              <Typography variant="caption" color="primary.dark" fontWeight={600}>
                {seleccionados.length}/{pasajeros}
              </Typography>
            </Box>
          </Paper>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={seleccionados.length !== pasajeros}
          onClick={handleContinuar}
          sx={{
            py: 1.8,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: 16,
            textTransform: "none",
            boxShadow: seleccionados.length === pasajeros ? "0 4px 20px rgba(37,99,235,0.4)" : "none",
          }}
          endIcon={<ArrowForwardIcon />}
        >
          {seleccionados.length < pasajeros
            ? `Selecciona ${pasajeros - seleccionados.length} asiento${pasajeros - seleccionados.length > 1 ? "s" : ""} más`
            : seleccionados.length > pasajeros
            ? `Has seleccionado ${seleccionados.length - pasajeros} asiento${seleccionados.length - pasajeros > 1 ? "s" : ""} de más`
            : "Continuar con la compra"}
        </Button>
      </Box>
    </Container>
  );
}