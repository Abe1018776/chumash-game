interface HeartsBarProps {
  hearts: number;
  maxHearts: number;
}

export default function HeartsBar({ hearts, maxHearts }: HeartsBarProps) {
  return (
    <div style={{
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      padding: '4px 0',
    }}>
      {Array.from({ length: maxHearts }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: 26,
            filter: i < hearts ? 'none' : 'grayscale(1) opacity(0.25)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: i >= hearts ? 'scale(0.75)' : 'scale(1)',
            display: 'inline-block',
            textShadow: i < hearts ? '0 2px 4px rgba(255,75,75,0.4)' : 'none',
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
