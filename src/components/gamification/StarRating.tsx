export default function StarRating({ stars, size = 32 }: { stars: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
      {[1, 2, 3].map(n => (
        <span key={n} style={{ fontSize: size, filter: n <= stars ? 'none' : 'grayscale(1) opacity(0.4)' }}>
          ⭐
        </span>
      ))}
    </div>
  );
}
