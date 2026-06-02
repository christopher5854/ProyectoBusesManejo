const API = "http://localhost:3000/api";

const scannerService = {
  validarAcceso: async ({ qr }) => {
    const token = localStorage.getItem("token");
    
    // Extraer el ID del boleto del QR (asumiendo que el QR contiene el código o ID)
    let boletoId;
    try {
      const qrData = JSON.parse(qr);
      boletoId = qrData.boleto_id;
    } catch {
      // Si no es JSON, asumimos que es el código del boleto
      boletoId = qr;
    }
    
    const response = await fetch(`${API}/acceso/validar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ qr, boleto_id: boletoId })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Acceso denegado");
    }
    
    return response.json();
  }
};

export default scannerService;