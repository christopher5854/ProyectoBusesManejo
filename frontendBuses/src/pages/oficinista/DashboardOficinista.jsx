import { Card, CardContent, Grid, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PaymentIcon from "@mui/icons-material/Payment";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

export default function DashboardOficinista() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
        Panel de Oficinista
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => navigate('/oficinista/pagos-pendientes')}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <PaymentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">Validar Pagos</Typography>
              <Typography variant="body2" color="text.secondary">
                Revisar y aprobar comprobantes de pago
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={() => navigate('/oficinista/venta-boletos')}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <ConfirmationNumberIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">Vender Boletos</Typography>
              <Typography variant="body2" color="text.secondary">
                Venta de boletos en ventanilla
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}