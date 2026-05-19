import SidebarAdmin from "./SidebarAdmin";
import SidebarOficinista from "./SidebarOficinista";
import SidebarBus from "./SidebarBus";

// Zustand
import { useAuthStore } from "../store/authStore";

function SidebarByRole() {

   const { usuario } = useAuthStore();

   if(usuario?.rol === "ADMIN"){
      return <SidebarAdmin />
   }

   if(usuario?.rol === "OFICINISTA"){
      return <SidebarOficinista />
   }

   if(usuario?.rol === "BUS"){
      return <SidebarBus />
   }

   return null;
}

export default SidebarByRole;