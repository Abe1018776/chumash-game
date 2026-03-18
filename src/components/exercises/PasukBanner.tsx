interface PasukBannerProps {
  pasukNumber: number;
  pasukText: string;
  highlight?: string; // exact substring to highlight in the pasuk
}

const PASUK_LETTERS = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'];

export default function PasukBanner({ pasukNumber, pasukText, highlight }: PasukBannerProps) {
  const letter = PASUK_LETTERS[pasukNumber] ?? String(pasukNumber);

  // Split text around the highlight word so we can color it
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
      background: '#FFF8E1',
      borderBottom: '2px solid #F9A825',
      padding: '10px 16px',
      direction: 'rtl',
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: '#F57F17',
        letterSpacing: '0.05em',
        marginBottom: 4,
        textTransform: 'uppercase',
      }}>
        פּסוק {letter}
      </div>
      <div style={{
        fontFamily: "'Noto Serif Hebrew', serif",
        fontSize: 15,
        lineHeight: 1.9,
        color: '#5D4037',
        direction: 'rtl',
        textAlign: 'right',
      }}>
        {mid ? (
          <>
            <span>{before}</span>
            <span style={{
              background: '#F9A825',
              color: '#3E2723',
              borderRadius: 4,
              padding: '1px 3px',
              fontWeight: 800,
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
