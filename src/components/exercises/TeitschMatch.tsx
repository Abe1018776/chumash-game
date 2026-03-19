import { useState, useRef, useCallback, useEffect } from 'react';
import { VocabWord } from '../../types';
import { audioManager } from '../../lib/audioManager';

interface TeitschMatchProps {
  words: VocabWord[];          // words to match (from current pasuk)
  onComplete: (allCorrect: boolean) => void;
}

const LINE_COLORS = ['#e74c3c', '#2ecc71', '#3498db', '#f39c12', '#9b59b6', '#1abc9c'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TeitschMatch({ words, onComplete }: TeitschMatchProps) {
  const [rightItems] = useState(() => shuffle(words.map((w, i) => ({ ...w, origIdx: i }))));
  const [selected, setSelected] = useState<{ side: 'left' | 'right'; idx: number } | null>(null);
  // leftIdx -> { rightIdx, color }
  const [matches, setMatches] = useState<Record<number, { rightIdx: number; color: string }>>({});
  // rightIdx -> leftIdx
  const [reverseMatches, setReverseMatches] = useState<Record<number, number>>({});
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null);
  const [colorIdx, setColorIdx] = useState(0);
  const [lineCoords, setLineCoords] = useState<Record<number, { x1: number; y1: number; x2: number; y2: number }>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const recalcLines = useCallback(() => {
    if (!containerRef.current) return;
    const cr = containerRef.current.getBoundingClientRect();
    const coords: typeof lineCoords = {};
    Object.entries(matches).forEach(([li, { rightIdx }]) => {
      const lEl = leftRefs.current[Number(li)];
      const rEl = rightRefs.current[rightIdx];
      if (lEl && rEl) {
        const lR = lEl.getBoundingClientRect();
        const rR = rEl.getBoundingClientRect();
        coords[Number(li)] = {
          x1: lR.right - cr.left,
          y1: lR.top + lR.height / 2 - cr.top,
          x2: rR.left - cr.left,
          y2: rR.top + rR.height / 2 - cr.top,
        };
      }
    });
    setLineCoords(coords);
  }, [matches]);

  useEffect(() => {
    recalcLines();
    window.addEventListener('resize', recalcLines);
    return () => window.removeEventListener('resize', recalcLines);
  }, [recalcLines]);

  // Check completion
  useEffect(() => {
    if (Object.keys(matches).length === words.length && words.length > 0) {
      setTimeout(() => onComplete(true), 600);
    }
  }, [matches, words.length, onComplete]);

  const handleClick = (side: 'left' | 'right', idx: number) => {
    if (side === 'left' && matches[idx]) return;
    if (side === 'right' && reverseMatches[idx] !== undefined) return;

    if (!selected) { setSelected({ side, idx }); setWrongPair(null); return; }
    if (selected.side === side) { setSelected({ side, idx }); setWrongPair(null); return; }

    const leftIdx = side === 'left' ? idx : selected.idx;
    const rightIdx = side === 'right' ? idx : selected.idx;
    if (matches[leftIdx] || reverseMatches[rightIdx] !== undefined) { setSelected({ side, idx }); return; }

    const rightOrigIdx = rightItems[rightIdx]!.origIdx;
    if (leftIdx === rightOrigIdx) {
      // Correct match
      const color = LINE_COLORS[colorIdx % LINE_COLORS.length]!;
      setMatches(m => ({ ...m, [leftIdx]: { rightIdx, color } }));
      setReverseMatches(r => ({ ...r, [rightIdx]: leftIdx }));
      setColorIdx(c => c + 1);
      setSelected(null);
      setWrongPair(null);
      audioManager.playCorrect();
    } else {
      // Wrong
      setWrongPair({ left: leftIdx, right: rightIdx });
      setSelected(null);
      audioManager.playWrong();
      setTimeout(() => setWrongPair(null), 700);
    }
  };

  const isAllMatched = Object.keys(matches).length === words.length;

  return (
    <div style={{ padding: '16px', direction: 'rtl' }}>
      <div style={{ textAlign: 'center', color: '#795548', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
        פאַרבינד לשון קודש מיטן טייטש
      </div>

      <div ref={containerRef} style={{ position: 'relative' }}>
        {/* SVG lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          {Object.entries(lineCoords).map(([li, c]) => (
            <line
              key={li}
              x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={matches[Number(li)]?.color ?? '#aaa'}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.8}
            />
          ))}
        </svg>

        <div style={{ display: 'flex', gap: 12 }}>
          {/* Left: Hebrew */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 13, color: '#4e342e', marginBottom: 2, background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '3px 0' }}>
              לשון קודש
            </div>
            {words.map((word, i) => {
              const isMatched = !!matches[i];
              const isSel = selected?.side === 'left' && selected.idx === i;
              const isWrong = wrongPair?.left === i;
              const color = isMatched ? matches[i]!.color : undefined;
              return (
                <div
                  key={word.id}
                  ref={el => { leftRefs.current[i] = el; }}
                  onClick={() => !isMatched && handleClick('left', i)}
                  style={{
                    background: isWrong ? '#ffcdd2' : isMatched ? (color + '22') : isSel ? '#fff9c4' : '#fff',
                    border: `2.5px solid ${isWrong ? '#e53935' : isMatched ? color : isSel ? '#f9a825' : '#d7ccc8'}`,
                    borderRadius: 12, padding: '10px 12px',
                    textAlign: 'center',
                    fontFamily: "'Noto Serif Hebrew', serif",
                    fontSize: 22, fontWeight: 700,
                    color: isMatched ? color : '#3e2723',
                    cursor: isMatched ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    transform: isSel ? 'scale(1.04)' : isWrong ? 'scale(0.96)' : 'scale(1)',
                    opacity: isMatched ? 0.75 : 1,
                    position: 'relative', zIndex: 3,
                    boxShadow: isSel ? `0 0 0 3px #f9a82566` : '0 1px 4px rgba(0,0,0,0.06)',
                    minHeight: 48,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {word.hebrew}
                  {isMatched && <span style={{ marginRight: 4, fontSize: 14 }}>✓</span>}
                </div>
              );
            })}
          </div>

          {/* Right: Yiddish */}
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 13, color: '#4e342e', marginBottom: 2, background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '3px 0' }}>
              טייטש
            </div>
            {rightItems.map((item, i) => {
              const isMatched = reverseMatches[i] !== undefined;
              const isSel = selected?.side === 'right' && selected.idx === i;
              const isWrong = wrongPair?.right === i;
              const color = isMatched ? matches[reverseMatches[i]!]?.color : undefined;
              return (
                <div
                  key={item.id + '-r'}
                  ref={el => { rightRefs.current[i] = el; }}
                  onClick={() => !isMatched && handleClick('right', i)}
                  style={{
                    background: isWrong ? '#ffcdd2' : isMatched ? (color + '22') : isSel ? '#fff9c4' : '#fff',
                    border: `2.5px solid ${isWrong ? '#e53935' : isMatched ? color : isSel ? '#f9a825' : '#d7ccc8'}`,
                    borderRadius: 12, padding: '10px 12px',
                    textAlign: 'center',
                    fontSize: 14, fontWeight: 600,
                    color: isMatched ? color : '#3e2723',
                    cursor: isMatched ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    transform: isSel ? 'scale(1.04)' : isWrong ? 'scale(0.96)' : 'scale(1)',
                    opacity: isMatched ? 0.75 : 1,
                    position: 'relative', zIndex: 3,
                    boxShadow: isSel ? `0 0 0 3px #f9a82566` : '0 1px 4px rgba(0,0,0,0.06)',
                    minHeight: 48,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1.3,
                  }}
                >
                  {item.yiddish}
                  {isMatched && <span style={{ marginRight: 4, fontSize: 14 }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isAllMatched && (
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 32 }}>🎉</div>
      )}
    </div>
  );
}
