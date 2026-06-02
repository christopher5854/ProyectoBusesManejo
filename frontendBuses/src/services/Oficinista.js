const API = "http://localhost:3000/api";

const Oficinista = {
  buscarCliente: async (cedula) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API}/usuarios/cedula/${cedula}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Cliente no encontrado");
    return response.json();
  },
  
  getPagos: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API}/boletos/pendientes`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
  },
  
  actualizarPago: async (id, estado) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API}/boletos/${id}/validar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ estado })
    });
    return response.json();
  }
};

export default Oficinista;