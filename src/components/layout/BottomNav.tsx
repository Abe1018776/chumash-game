import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const loc = useLocation();
  const items = [
    { path: '/', icon: '🏠', label: 'הויפּטזייט' },
    { path: '/profile', icon: '👤', label: 'פּראָפיל' },
  ];
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      borderTop: '2px solid #EFEBE9',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0 env(safe-area-inset-bottom)',
      zIndex: 100,
    }}>
      {items.map(item => {
        const active = loc.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '4px 24px',
              color: active ? '#009688' : '#9E9E9E',
              fontWeight: active ? 700 : 400,
              fontSize: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
