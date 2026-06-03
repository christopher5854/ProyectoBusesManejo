/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
export const UserContext = createContext();

const initialUsuario = {
    id:'',
    nombre:'',
    apellido:'',
    cedula:'',
    correo:'',
    telefono:'',
    username:'',
    password:'',
    rol:'',
    activo:'',
    tipo:'',
    cooperativa:''
};

export const UserProvider = ({children}) => {
    const [usuario , setUsuario] = useState(initialUsuario);

    const [cooperativa, setCooperativa] = useState({
        nombre: ''
    })

    const resetUsuario = () => setUsuario(initialUsuario);

    return (
        <UserContext.Provider value={{usuario, setUsuario, resetUsuario, cooperativa, setCooperativa}}>
            {children}
        </UserContext.Provider>
    );
};
