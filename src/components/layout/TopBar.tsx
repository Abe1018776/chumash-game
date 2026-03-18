import { useProgress } from '../../context/ProgressContext';
import { getLevelForPoints } from '../../lib/scoring';

export default function TopBar() {
  const { progress } = useProgress();
  const level = getLevelForPoints(progress.points);
  return (
    <div style={{
      background: '#fff',
      borderBottom: '2px solid #EFEBE9',
      padding: '10px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      direction: 'rtl',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 32, width: 32, objectFit: 'contain' }} />
        <span style={{ fontWeight: 800, fontSize: 18, color: '#3E2723' }}>חומש שפּיל</span>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FF9800', fontWeight: 700 }}>
          🔥 {progress.streak}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F9A825', fontWeight: 700 }}>
          ⭐ {progress.points}
        </div>
        <div style={{
          background: '#009688',
          color: '#fff',
          borderRadius: 999,
          padding: '2px 10px',
          fontSize: 13,
          fontWeight: 700,
        }}>
          {level.title}
        </div>
      </div>
    </div>
  );
}
