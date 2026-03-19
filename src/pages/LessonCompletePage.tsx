import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StarRating from '../components/gamification/StarRating';
import Confetti from '../components/gamification/Confetti';
import { audioManager } from '../lib/audioManager';
import { getWordById } from '../data/vocabulary';

interface LocationState {
  lessonId: string;
  totalPoints: number;
  stars: number;
  passed: boolean;
  wrongWordIds: string[];
  totalWords: number;
  correctWords: number;
}

export default function LessonCompletePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const s = (state as LocationState | null) ?? {} as LocationState;
  const passed = s.passed ?? true;
  const stars = s.stars ?? 1;
  const totalPoints = s.totalPoints ?? 0;
  const correctWords = s.correctWords ?? 0;
  const totalWords = s.totalWords ?? 0;
  const wrongWordIds = s.wrongWordIds ?? [];
  const lessonId = s.lessonId ?? '';

  useEffect(() => {
    if (passed) {
      setShowConfetti(true);
      audioManager.playComplete();
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      audioManager.playWrong();
    }
  }, [passed]);

  const encouragements = ['!זייער גוט', '!יישר כח', '!ווייטער אזוי', '!אַ גרויסע זאך', '!ברעוו'];
  const msg = encouragements[Math.floor(Math.random() * encouragements.length)];

  return (
    <div style={{
      minHeight: '100vh',
      background: passed
        ? 'linear-gradient(160deg, #E8FFC2 0%, #D0F5FF 50%, #E8FFC2 100%)'
        : 'linear-gradient(160deg, #FFF3CD 0%, #FFE0E0 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      direction: 'rtl',
    }}>
      <Confetti active={showConfetti} />

      <div style={{
        background: '#fff',
        borderRadius: 28,
        padding: '36px 24px 28px',
        textAlign: 'center',
        boxShadow: passed
          ? '0 8px 0 #46A302, 0 12px 32px rgba(88,204,2,0.2)'
          : '0 8px 0 #CC3333, 0 12px 32px rgba(255,75,75,0.2)',
        border: `3px solid ${passed ? '#58CC02' : '#FF4B4B'}`,
        maxWidth: 400,
        width: '100%',
      }}>
        {passed ? (
          <>
            <div style={{ fontSize: 72, marginBottom: 8, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))', animation: 'bounce 0.6s ease' }}>
              🎉
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#3E2723', margin: '0 0 16px' }}>{msg}</h2>
            <div style={{ marginBottom: 16 }}>
              <StarRating stars={stars} size={44} />
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #FFF9C4, #FFF176)',
              border: '3px solid #FFC800',
              borderRadius: 16,
              padding: '12px 24px',
              margin: '0 0 16px',
              boxShadow: '0 4px 0 #E6B400',
            }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#3E2723' }}>⭐ +{totalPoints}</div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>נקודות</div>
            </div>
            <div style={{
              background: '#E9FFC0',
              border: '2px solid #58CC02',
              borderRadius: 14,
              padding: '10px 16px',
              marginBottom: 20,
              color: '#2A6600',
              fontWeight: 700,
              fontSize: 14,
            }}>
              ✓ {correctWords} / {totalWords} ווערטער — דער קומענדיקער פּסוק איז פרייגעשלאסן!
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 72, marginBottom: 8 }}>📚</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#3E2723', margin: '0 0 8px' }}>
              כּמעט! {correctWords} / {totalWords} ריכטיק
            </h2>
            <div style={{
              background: '#FFE5E5',
              border: '2px solid #FF4B4B',
              borderRadius: 14,
              padding: '10px 16px',
              marginBottom: 12,
              color: '#CC0000',
              fontWeight: 700,
              fontSize: 14,
            }}>
              דו דארפסט 80% כּדי צו קומען צום קומענדיקן פּסוק
            </div>
            {wrongWordIds.length > 0 && (
              <div style={{
                background: '#FFF9E6',
                border: '2px solid #FFC800',
                borderRadius: 14,
                padding: '12px 16px',
                marginBottom: 16,
                textAlign: 'right',
              }}>
                <div style={{ fontWeight: 900, color: '#CC8800', marginBottom: 8, fontSize: 13 }}>
                  🔁 קומט ווידער נאכסטן מאל:
                </div>
                {wrongWordIds.map(id => {
                  const w = getWordById(id);
                  return w ? (
                    <div key={id} style={{
                      fontFamily: "'Noto Serif Hebrew', serif",
                      fontSize: 17,
                      color: '#3E2723',
                      margin: '4px 0',
                      padding: '4px 8px',
                      background: 'rgba(255,200,0,0.1)',
                      borderRadius: 8,
                    }}>
                      {w.hebrew} — <span style={{ color: '#555' }}>{w.yiddish}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: passed
                ? 'linear-gradient(180deg, #58CC02 0%, #4DB800 100%)'
                : 'linear-gradient(180deg, #FF4B4B 0%, #E63333 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              padding: '16px',
              fontSize: 18,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: passed ? '0 5px 0 #46A302' : '0 5px 0 #CC2222',
              letterSpacing: '0.02em',
            }}
          >
            {passed ? '!ווייטער ▶' : '!צוריק צום מאפּ'}
          </button>
          <button
            onClick={() => navigate(`/lesson/${lessonId}`)}
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
              border: '3px solid #E5E5E5',
              borderRadius: 16,
              padding: '14px',
              fontSize: 16,
              fontWeight: 800,
              color: '#777',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #D0D0D0',
            }}
          >
            🔄 {passed ? 'נאכאמאל שפּילן' : 'פּרובירן נאכאמאל'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
