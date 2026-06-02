import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  {
    section: 'General',
    items: [
      { label: 'Dashboard', icon: 'ti-layout-dashboard', path: '/admin/dashboard' },
      { label: 'Métricas', icon: 'ti-chart-bar', path: '/admin/metricas' },
    ]
  },
  {
    section: 'Gestión',
    items: [
      { label: 'Buses', icon: 'ti-bus', path: '/admin/buses' },
      { label: 'Usuarios', icon: 'ti-users', path: '/admin/usuarios' },
      { label: 'Frecuencias', icon: 'ti-route', path: '/admin/frecuencias' },
      { label: 'Hoja de ruta', icon: 'ti-calendar', path: '/admin/hoja-ruta' },
    ]
  },
  {
    section: 'Sistema',
    items: [
      { label: 'Configuración', icon: 'ti-settings', path: '/admin/configuracion' },
    ]
  }
];

export default function SidebarAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside style={{
      width: collapsed ? '64px' : '220px',
      minHeight: '100vh',
      backgroundColor: '#111827',
      borderRight: '1px solid #1f2937',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      overflow: 'hidden',
      flexShrink: 0,
    }}>

      {/* LOGO + TOGGLE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '18px 0' : '18px 16px',
        borderBottom: '1px solid #1f2937',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              backgroundColor: '#D85A30', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="ti ti-bus" style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#f9fafb' }}>Flota Pelileo</p>
              <p style={{ margin: 0, fontSize: '10px', color: '#6b7280' }}>Admin</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6b7280', padding: '4px', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <i className={`ti ${collapsed ? 'ti-layout-sidebar-right' : 'ti-layout-sidebar'}`}
            style={{ fontSize: '18px' }} />
        </button>
      </div>

      {/* MENÚ */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {menuItems.map((group) => (
          <div key={group.section} style={{ marginBottom: '4px' }}>

            {/* Sección label */}
            {!collapsed && (
              <p style={{
                margin: '12px 16px 4px',
                fontSize: '10px', fontWeight: 500,
                color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.06em'
              }}>
                {group.section}
              </p>
            )}

            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  title={collapsed ? item.label : ''}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: '10px', padding: collapsed ? '10px 0' : '9px 16px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: isActive ? '#1f2937' : 'none',
                    border: 'none',
                    borderLeft: isActive ? '3px solid #D85A30' : '3px solid transparent',
                    cursor: 'pointer', borderRadius: '0',
                    transition: 'background 0.15s',
                  }}
                >
                  <i className={`ti ${item.icon}`} style={{
                    fontSize: '18px',
                    color: isActive ? '#D85A30' : '#9ca3af',
                    flexShrink: 0,
                  }} />
                  {!collapsed && (
                    <span style={{
                      fontSize: '13px',
                      color: isActive ? '#f9fafb' : '#9ca3af',
                      fontWeight: isActive ? 500 : 400,
                      whiteSpace: 'nowrap',
                    }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div style={{
        borderTop: '1px solid #1f2937',
        padding: collapsed ? '14px 0' : '14px 16px',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '10px',
      }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          backgroundColor: '#D85A30', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <i className="ti ti-user" style={{ color: '#fff', fontSize: '14px' }} />
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 500, color: '#f9fafb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Administrador</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>admin@pelileo.ec</p>
          </div>
        )}
        {!collapsed && (
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}>
            <i className="ti ti-logout" style={{ fontSize: '16px' }} />
          </button>
        )}
      </div>

    </aside>
  );
}