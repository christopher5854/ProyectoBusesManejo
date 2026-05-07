/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [usuario , setUsuario] = useState({
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
        coperativa:''
    })

    return (
        <UserContext.Provider value={{usuario, setUsuario}}>
            {children}
        </UserContext.Provider>
    );
};
