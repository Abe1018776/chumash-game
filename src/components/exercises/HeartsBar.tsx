interface HeartsBarProps {
  hearts: number;
  maxHearts: number;
}

export default function HeartsBar({ hearts, maxHearts }: HeartsBarProps) {
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 0',
    }}>
      {Array.from({ length: maxHearts }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: 22,
            filter: i < hearts ? 'none' : 'grayscale(1) opacity(0.3)',
            transition: 'all 0.3s',
            transform: i >= hearts ? 'scale(0.8)' : 'scale(1)',
            display: 'inline-block',
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
