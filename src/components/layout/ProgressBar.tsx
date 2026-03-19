export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total === 0 ? 0 : (current / total) * 100;
  return (
    <div style={{ padding: '10px 16px 0' }}>
      <div style={{
        background: '#E5E5E5',
        borderRadius: 999,
        height: 16,
        overflow: 'visible',
        position: 'relative',
      }}>
        <div style={{
          background: 'linear-gradient(90deg, #58CC02, #89E219)',
          height: '100%',
          width: `${Math.max(pct, pct > 0 ? 4 : 0)}%`,
          borderRadius: 999,
          transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 3px 0 #46A302',
          position: 'relative',
        }}>
          {pct > 5 && (
            <div style={{
              position: 'absolute',
              top: 3,
              right: 8,
              width: 6,
              height: 4,
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 999,
            }} />
          )}
        </div>
      </div>
    </div>
  );
}
