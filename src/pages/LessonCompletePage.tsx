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
        ? 'linear-gradient(135deg, #FDF6E3 0%, #E8F5E9 100%)'
        : 'linear-gradient(135deg, #FDF6E3 0%, #FFF3E0 100%)',
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
        borderRadius: 24,
        padding: '32px 24px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        maxWidth: 400,
        width: '100%',
      }}>
        {passed ? (
          <>
            <div style={{ fontSize: 64, marginBottom: 4 }}>🎉</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#3E2723', margin: '0 0 12px' }}>{msg}</h2>
            <StarRating stars={stars} size={38} />
            <div style={{
              background: '#FDF6E3',
              borderRadius: 12,
              padding: '10px 20px',
              margin: '16px 0',
              fontSize: 20,
              fontWeight: 700,
              color: '#F9A825',
            }}>
              ⭐ +{totalPoints} נקודות
            </div>
            <div style={{ color: '#4CAF50', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
              ✓ {correctWords} פון {totalWords} ווערטער — דער קומענדיקער פּסוק איז פרייגעשלאסן!
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, marginBottom: 4 }}>📚</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#3E2723', margin: '0 0 8px' }}>
              כּמעט! {correctWords} פון {totalWords} ריכטיק
            </h2>
            <div style={{ color: '#E65100', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
              דו דארפסט 80% כּדי צו קומען צום קומענדיקן פּסוק
            </div>
            {wrongWordIds.length > 0 && (
              <div style={{
                background: '#FFF3E0',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 12,
                textAlign: 'right',
              }}>
                <div style={{ fontWeight: 700, color: '#E65100', marginBottom: 6, fontSize: 13 }}>
                  🔁 קומט ווידער נאכסטן מאל:
                </div>
                {wrongWordIds.map(id => {
                  const w = getWordById(id);
                  return w ? (
                    <div key={id} style={{
                      fontFamily: "'Noto Serif Hebrew', serif",
                      fontSize: 18,
                      color: '#3E2723',
                      margin: '3px 0',
                    }}>
                      {w.hebrew} — {w.yiddish}
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
              background: '#009688',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '15px',
              fontSize: 17,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,150,136,0.35)',
            }}
          >
            {passed ? '!ווייטער ▶' : '!צוריק צום מאפּ'}
          </button>
          <button
            onClick={() => navigate(`/lesson/${lessonId}`)}
            style={{
              background: 'none',
              border: '2px solid #D7CCC8',
              borderRadius: 14,
              padding: '13px',
              fontSize: 15,
              fontWeight: 700,
              color: '#795548',
              cursor: 'pointer',
            }}
          >
            🔄 {passed ? 'נאכאמאל שפּילן' : 'פּרובירן נאכאמאל'}
          </button>
        </div>
      </div>
    </div>
  );
}
