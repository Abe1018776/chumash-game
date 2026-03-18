export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total === 0 ? 0 : (current / total) * 100;
  return (
    <div style={{ padding: '12px 16px 0', direction: 'rtl' }}>
      <div style={{
        background: '#E0E0E0',
        borderRadius: 999,
        height: 12,
        overflow: 'hidden',
      }}>
        <div style={{
          background: 'linear-gradient(90deg, #009688, #4CAF50)',
          height: '100%',
          width: `${pct}%`,
          borderRadius: 999,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <div style={{
        textAlign: 'center',
        fontSize: 13,
        color: '#795548',
        marginTop: 4,
        fontWeight: 600,
        direction: 'rtl',
      }}>
        {current} / {total}
      </div>
    </div>
  );
}
