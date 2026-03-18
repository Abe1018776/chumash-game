import { useState, useEffect } from 'react';
import { VocabWord } from '../../types';
import { audioManager } from '../../lib/audioManager';

interface FlashcardProps {
  word: VocabWord;
  onAnswer: (correct: boolean) => void; // "know it" = correct, "don't know" = incorrect
}

export default function Flashcard({ word, onAnswer }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    // Auto-speak the Hebrew word when card appears
    audioManager.speak(word.hebrew);
  }, [word.hebrew]);

  return (
    <div style={{ padding: '24px 16px', direction: 'rtl' }}>
      <div style={{ textAlign: 'center', marginBottom: 16, color: '#795548', fontSize: 16, fontWeight: 600 }}>
        {flipped ? 'דאס איז דער טייטש:' : 'דריק אויף דעם קארטל צו זען דעם טייטש'}
      </div>

      {/* Card */}
      <div
        onClick={() => { if (!flipped) { setFlipped(true); } }}
        style={{
          background: flipped ? '#E8F5E9' : '#fff',
          border: `3px solid ${flipped ? '#4CAF50' : '#009688'}`,
          borderRadius: 20,
          padding: '40px 24px',
          textAlign: 'center',
          cursor: flipped ? 'default' : 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'all 0.3s',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        {word.emoji && <div style={{ fontSize: 56 }}>{word.emoji}</div>}

        <div style={{
          fontSize: 42,
          fontFamily: "'Noto Serif Hebrew', serif",
          fontWeight: 700,
          color: '#3E2723',
          direction: 'rtl',
          lineHeight: 1.4,
        }}>
          {word.hebrew}
        </div>

        {flipped && (
          <div style={{
            fontSize: 22,
            color: '#2E7D32',
            fontWeight: 600,
            direction: 'rtl',
            marginTop: 8,
          }}>
            {word.yiddish}
          </div>
        )}

        {!flipped && (
          <div style={{ color: '#9E9E9E', fontSize: 14 }}>
            🔊 דריק אויף דעם קארטל
          </div>
        )}
      </div>

      {/* Replay audio button */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button
          onClick={() => audioManager.speak(word.hebrew)}
          style={{
            background: 'none',
            border: '2px solid #009688',
            borderRadius: 999,
            padding: '6px 20px',
            color: '#009688',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          🔊 נאכאמאל הערן
        </button>
      </div>

      {/* Know / Don't know buttons */}
      {flipped && (
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={() => onAnswer(false)}
            style={{
              flex: 1,
              background: '#FFF3E0',
              border: '2px solid #FF9800',
              borderRadius: 14,
              padding: '14px',
              fontSize: 16,
              fontWeight: 700,
              color: '#E65100',
              cursor: 'pointer',
            }}
          >
            😕 ניט גוט
          </button>
          <button
            onClick={() => onAnswer(true)}
            style={{
              flex: 1,
              background: '#E8F5E9',
              border: '2px solid #4CAF50',
              borderRadius: 14,
              padding: '14px',
              fontSize: 16,
              fontWeight: 700,
              color: '#2E7D32',
              cursor: 'pointer',
            }}
          >
            😊 איך ווייס!
          </button>
        </div>
      )}
    </div>
  );
}
