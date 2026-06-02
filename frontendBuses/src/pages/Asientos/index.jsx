import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Button, CircularProgress
} from "@mui/material";
import api from "../../services/api";

function Asiento({ asiento, seleccionados, onToggle, maxSeleccion }) {
  const isSelected = seleccionados.includes(asiento.id);
  const isOcupado = asiento.estado === "ocupado";
  const lleno = seleccionados.length >= maxSeleccion && !isSelected;

  const getBgColor = () => {
    if (isOcupado) return "error.main";
    if (isSelected) return "primary.main";
    if (lleno) return "grey.300";
    return "success.main";
  };

  return (
    <Box
      onClick={() => !isOcupado && !lleno && onToggle(asiento)}
      sx={{
        width: 40,
        height: 40,
        bgcolor: getBgColor(),
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isOcupado || lleno ? "not-allowed" : "pointer",
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
        transition: "all 0.2s",
        "&:hover": {
          opacity: isOcupado || lleno ? 1 : 0.85,
        },
      }}
    >
      {asiento.numero}
    </Box>
  );
}

export default function AsientosPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const rutaId = params.get("rutaId");
  const pasajeros = Number(params.get("pasajeros")) || 1;

  const [asientos, setAsientos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);

  useEffect(() => {
    const loadAsientos = async () => {
      try {
        const routeData = JSON.parse(localStorage.getItem('rutaSeleccionada') || 'null');
        setRutaSeleccionada(routeData);
        const { data } = await api.get(`/buses/${rutaId}/asientos`);
        setAsientos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando asientos:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAsientos();
  }, [rutaId]);

  const toggleAsiento = (asiento) => {
    setSeleccionados((prev) =>
      prev.includes(asiento.id)
        ? prev.filter((id) => id !== asiento.id)
        : [...prev, asiento.id]
    );
  };

  const pisos = [...new Set(asientos.map((a) => a.piso))].sort();

  const totalPrecio = asientos
    .filter((a) => seleccionados.includes(a.id))
    .reduce((acc, a) => acc + Number(a.precio || 0), 0);

  const handleContinuar = () => {
    const asientosSeleccionados = asientos.filter((a) =>
      seleccionados.includes(a.id)
    );
    localStorage.setItem("asientosSeleccionados", JSON.stringify(asientosSeleccionados));
    localStorage.setItem("rutaId", rutaId);
    if (rutaSeleccionada) {
      localStorage.setItem("rutaSeleccionada", JSON.stringify(rutaSeleccionada));
    }
    navigate("/pago");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={1}>
        Selecciona tu asiento
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Selecciona {pasajeros} asiento(s)
      </Typography>
      {rutaSeleccionada && (
        <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold">Ruta seleccionada</Typography>
          <Typography variant="body2">{rutaSeleccionada.origen} → {rutaSeleccionada.destino}</Typography>
          <Typography variant="body2">Fecha: {new Date(rutaSeleccionada.fecha).toLocaleDateString()}</Typography>
          <Typography variant="body2">Salida: {rutaSeleccionada.hora_salida}</Typography>
          <Typography variant="body2">Precio por asiento: ${Number(rutaSeleccionada.precio || 0).toFixed(2)}</Typography>
        </Box>
      )}

      {/* Leyenda */}
      <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 20, height: 20, bgcolor: "success.main", borderRadius: 1 }} />
          <Typography variant="caption">Disponible</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 20, height: 20, bgcolor: "primary.main", borderRadius: 1 }} />
          <Typography variant="caption">Seleccionado</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 20, height: 20, bgcolor: "error.main", borderRadius: 1 }} />
          <Typography variant="caption">Ocupado</Typography>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Mapa de asientos por piso */}
      {!loading && pisos.map((piso) => (
        <Box key={piso} sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Piso {piso}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 40px)", gap: 1 }}>
            {asientos
              .filter((a) => a.piso === piso)
              .map((a) => (
                <Asiento
                  key={a.id}
                  asiento={a}
                  seleccionados={seleccionados}
                  onToggle={toggleAsiento}
                  maxSeleccion={pasajeros}
                />
              ))}
          </Box>
        </Box>
      ))}

      {!loading && asientos.length === 0 && (
        <Typography color="text.secondary" textAlign="center" mt={4}>
          No hay asientos disponibles.
        </Typography>
      )}

      {/* Resumen */}
      {seleccionados.length > 0 && (
        <Box sx={{ bgcolor: "primary.50", border: "1px solid", borderColor: "primary.200", borderRadius: 2, p: 2, mb: 2 }}>
          <Typography variant="body2">
            Asientos seleccionados: <strong>{seleccionados.length}</strong> / {pasajeros}
          </Typography>
          <Typography variant="body2">
            Total: <strong style={{ color: "#1976d2" }}>${totalPrecio.toFixed(2)}</strong>
          </Typography>
        </Box>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={seleccionados.length < pasajeros}
        onClick={handleContinuar}
        sx={{ mt: 1 }}
      >
        Continuar con la compra
      </Button>
    </Container>
  );
}