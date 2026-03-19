interface PasukBannerProps {
  pasukNumber: number;
  pasukText: string;
  highlight?: string;
}

const PASUK_LETTERS = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'];

export default function PasukBanner({ pasukNumber, pasukText, highlight }: PasukBannerProps) {
  const letter = PASUK_LETTERS[pasukNumber] ?? String(pasukNumber);

  let before = pasukText;
  let mid = '';
  let after = '';
  if (highlight) {
    const idx = pasukText.indexOf(highlight);
    if (idx !== -1) {
      before = pasukText.slice(0, idx);
      mid = pasukText.slice(idx, idx + highlight.length);
      after = pasukText.slice(idx + highlight.length);
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF3CC 100%)',
      borderBottom: '3px solid #FFC800',
      padding: '10px 16px 12px',
      direction: 'rtl',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative dots */}
      <div style={{ position: 'absolute', top: -8, left: -8, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,200,0,0.15)' }} />
      <div style={{ position: 'absolute', bottom: -10, right: -10, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,200,0,0.1)' }} />

      <div style={{
        display: 'inline-block',
        background: '#FFC800',
        color: '#3E2723',
        fontSize: 11,
        fontWeight: 900,
        borderRadius: 999,
        padding: '2px 10px',
        marginBottom: 6,
        letterSpacing: '0.05em',
        boxShadow: '0 2px 0 #E6B400',
      }}>
        📖 פּסוק {letter}
      </div>

      <div style={{
        fontFamily: "'Noto Serif Hebrew', serif",
        fontSize: 15,
        lineHeight: 2,
        color: '#4A3000',
        direction: 'rtl',
        textAlign: 'right',
      }}>
        {mid ? (
          <>
            <span>{before}</span>
            <span style={{
              background: '#FFC800',
              color: '#3E2723',
              borderRadius: 6,
              padding: '0 4px',
              fontWeight: 900,
              boxShadow: '0 2px 0 #E6B400',
              display: 'inline-block',
              lineHeight: 1.6,
            }}>{mid}</span>
            <span>{after}</span>
          </>
        ) : (
          <span>{before}</span>
        )}
      </div>
    </div>
  );
}
