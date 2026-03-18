import { useProgress } from '../context/ProgressContext';
import { getLevelForPoints, LEVELS } from '../lib/scoring';
import AppShell from '../components/layout/AppShell';

export default function ProfilePage() {
  const { progress } = useProgress();
  const level = getLevelForPoints(progress.points);
  const nextLevel = LEVELS.find(l => l.minPoints > progress.points);
  const pct = nextLevel
    ? ((progress.points - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100
    : 100;

  return (
    <AppShell>
      <div style={{ padding: '24px 16px', direction: 'rtl' }}>
        <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 900, color: '#3E2723', marginBottom: 24 }}>
          👤 מיין פּראָפיל
        </h1>

        {/* Level card */}
        <div style={{
          background: '#009688',
          borderRadius: 20,
          padding: '24px',
          color: '#fff',
          textAlign: 'center',
          marginBottom: 20,
          boxShadow: '0 4px 16px rgba(0,150,136,0.3)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{level.title}</div>
          <div style={{ fontSize: 16, opacity: 0.9, marginTop: 4 }}>
            {progress.points} נקודות
          </div>
          {nextLevel && (
            <div style={{ marginTop: 12 }}>
              <div style={{
                background: 'rgba(255,255,255,0.3)',
                borderRadius: 999,
                height: 10,
                overflow: 'hidden',
              }}>
                <div style={{
                  background: '#fff',
                  height: '100%',
                  width: `${pct}%`,
                  borderRadius: 999,
                }} />
              </div>
              <div style={{ fontSize: 13, marginTop: 6, opacity: 0.8 }}>
                {nextLevel.minPoints - progress.points} נקודות ביז {nextLevel.title}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '🔥', label: 'טעגליכע רצף', value: progress.streak },
            { icon: '⭐', label: 'נקודות', value: progress.points },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#fff',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 36 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#3E2723' }}>{stat.value}</div>
              <div style={{ color: '#795548', fontSize: 14 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        {progress.earnedBadges.length > 0 && (
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{ margin: '0 0 12px', color: '#3E2723', fontSize: 18 }}>🎖️ מיינע באדזשעס</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {progress.earnedBadges.map(badge => (
                <div key={badge} style={{
                  background: '#FDF6E3',
                  border: '2px solid #F9A825',
                  borderRadius: 12,
                  padding: '8px 16px',
                  fontWeight: 700,
                  color: '#3E2723',
                  fontSize: 14,
                }}>
                  {badge === 'first-korban' ? '🐂 ערשטן קרבן' : badge}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
