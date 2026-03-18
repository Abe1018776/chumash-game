import { useState, useEffect } from 'react';
import { VocabWord } from '../../types';
import { audioManager } from '../../lib/audioManager';

interface ListenChoiceProps {
  word: VocabWord;
  options: VocabWord[]; // 4 options including the correct word
  onAnswer: (correct: boolean) => void;
}

export default function ListenChoice({ word, options, onAnswer }: ListenChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    // Auto-play on mount
    audioManager.speakWord(word.id, word.hebrew);
    setPlayed(true);
  }, [word.id, word.hebrew]);

  const replay = () => {
    audioManager.speakWord(word.id, word.hebrew);
    setPlayed(true);
  };

  const handleSelect = (optionId: string) => {
    if (answered) return;
    setSelected(optionId);
    setAnswered(true);
    const correct = optionId === word.id;
    if (correct) audioManager.playCorrect();
    else audioManager.playWrong();
    setTimeout(() => onAnswer(correct), 800);
  };

  return (
    <div style={{ padding: '24px 16px', direction: 'rtl' }}>
      {/* Instruction */}
      <div style={{ textAlign: 'center', color: '#795548', fontSize: 16, fontWeight: 600, marginBottom: 24 }}>
        וואָס האסטו געהערט?
      </div>

      {/* Big audio button */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <button
          onClick={replay}
          style={{
            background: played ? '#E0F2F1' : '#009688',
            border: `3px solid #009688`,
            borderRadius: '50%',
            width: 100,
            height: 100,
            fontSize: 44,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,150,136,0.3)',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          🔊
        </button>
        <div style={{ color: '#9E9E9E', fontSize: 13, marginTop: 8 }}>
          דריק צו נאכאמאל הערן
        </div>
      </div>

      {/* Options — Yiddish choices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {options.map(opt => {
          const isSelected = selected === opt.id;
          const isCorrect = opt.id === word.id;
          let bg = '#fff';
          let border = '2.5px solid #D7CCC8';
          let color = '#3E2723';
          if (answered && isSelected && isCorrect) { bg = '#E8F5E9'; border = '2.5px solid #4CAF50'; color = '#2E7D32'; }
          else if (answered && isSelected && !isCorrect) { bg = '#FFF3E0'; border = '2.5px solid #FF9800'; color = '#E65100'; }
          else if (answered && isCorrect) { bg = '#E8F5E9'; border = '2.5px solid #4CAF50'; color = '#2E7D32'; }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={answered}
              style={{
                background: bg, border, borderRadius: 14,
                padding: '16px 20px',
                fontSize: 18, fontWeight: 600, color,
                cursor: answered ? 'default' : 'pointer',
                textAlign: 'center',
                direction: 'rtl',
                transition: 'all 0.2s',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                minHeight: 56,
              }}
            >
              {answered && isCorrect ? '✓ ' : ''}{opt.yiddish}
              {answered && isSelected && !isCorrect ? ' ✗' : ''}
            </button>
          );
        })}
      </div>

      {/* Show the word after answering */}
      {answered && (
        <div style={{
          marginTop: 20,
          textAlign: 'center',
          fontFamily: "'Noto Serif Hebrew', serif",
          fontSize: 32,
          fontWeight: 700,
          color: '#3E2723',
        }}>
          {word.hebrew}
        </div>
      )}
    </div>
  );
}
