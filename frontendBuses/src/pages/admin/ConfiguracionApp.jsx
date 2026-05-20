// src/pages/admin/ConfiguracionApp.jsx
import { useState, useEffect } from 'react';
import configService from '../../services/configService';

export default function ConfiguracionApp() {
  const [config, setConfig] = useState({ logo: '', colores: '', soporte: '', redes: '' });

  useEffect(() => {
    configService.getConfig().then(data => setConfig(data));
  }, []);

  const actualizar = (clave) => {
    configService.updateConfig(clave, { valor: config[clave] });
  };

  return (
    <div>
      <h2>Configuración</h2>
      
      <label>URL Logo:</label>
      <input value={config.logo} onChange={e => setConfig({...config, logo: e.target.value})} />
      <button onClick={() => actualizar('logo')}>Guardar Logo</button>
      
      {config.logo && <img src={config.logo} alt="Preview" width="100" />}

      <label>Colores Theme:</label>
      <input value={config.colores} onChange={e => setConfig({...config, colores: e.target.value})} />
      <button onClick={() => actualizar('colores')}>Guardar Color</button>
    </div>
  );
}