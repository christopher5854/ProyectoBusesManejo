import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import scannerService from '../../services/scannerService';

export default function ScannerQR() {
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } });
    
    scanner.render(async (qrCode) => {
      scanner.clear();
      try {
        await scannerService.validarAcceso({ qr: qrCode });
        setEstado('verde');
      } catch (err) {
        console.error(err);
        setEstado('rojo');
      }
    }, (error) => {
        console.warn(error);
    });

    return () => scanner.clear();
  }, []);

  return (
    <div>
      <div id="reader" style={{ width: '100%', maxWidth: '400px' }}></div>
      {estado === 'verde' && <h1 style={{ color: 'green', backgroundColor: 'lightgreen' }}>ACCESO PERMITIDO</h1>}
      {estado === 'rojo' && <h1 style={{ color: 'red', backgroundColor: 'pink' }}>INVÁLIDO / USADO</h1>}
    </div>
  );
}