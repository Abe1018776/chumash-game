import { useState } from 'react';
import { VocabWord } from '../../types';
import { audioManager } from '../../lib/audioManager';

interface MultipleChoiceProps {
  word: VocabWord;
  options: VocabWord[]; // includes the correct word
  reversed?: boolean; // if true: show yiddish, pick hebrew
  onAnswer: (correct: boolean) => void;
}

export default function MultipleChoice({ word, options, reversed = false, onAnswer }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const prompt = reversed ? word.yiddish : word.hebrew;

  const handleSelect = (optionId: string) => {
    if (answered) return;
    setSelected(optionId);
    setAnswered(true);
    const correct = optionId === word.id;
    if (correct) {
      audioManager.playCorrect();
    } else {
      audioManager.playWrong();
    }
    setTimeout(() => onAnswer(correct), 800);
  };

  return (
    <div style={{ padding: '24px 16px', direction: 'rtl' }}>
      {/* Prompt */}
      <div style={{
        textAlign: 'center',
        marginBottom: 32,
      }}>
        {word.emoji && <div style={{ fontSize: 56, marginBottom: 8 }}>{word.emoji}</div>}
        <button
          onClick={() => audioManager.speak(word.hebrew)}
          style={{
            background: '#F5F5F5',
            border: 'none',
            borderRadius: 16,
            padding: '16px 32px',
            cursor: 'pointer',
            fontSize: reversed ? 20 : 36,
            fontFamily: reversed ? 'inherit' : "'Noto Serif Hebrew', serif",
            fontWeight: 700,
            color: '#3E2723',
            direction: 'rtl',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            lineHeight: 1.4,
          }}
        >
          {prompt}
          {!reversed && <span style={{ fontSize: 14, display: 'block', color: '#9E9E9E', fontFamily: 'sans-serif' }}>🔊 דריק צו הערן</span>}
        </button>
        <div style={{ marginTop: 12, color: '#795548', fontSize: 16, fontWeight: 600 }}>
          {reversed ? 'וואָס איז דאס אויף לשון קודש?' : 'וואָס מיינט דאס?'}
        </div>
      </div>

      {/* Options */}
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

          const displayText = reversed ? opt.hebrew : opt.yiddish;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={answered}
              style={{
                background: bg,
                border,
                borderRadius: 14,
                padding: '16px 20px',
                fontSize: reversed ? 28 : 18,
                fontFamily: reversed ? "'Noto Serif Hebrew', serif" : 'inherit',
                fontWeight: 600,
                color,
                cursor: answered ? 'default' : 'pointer',
                textAlign: 'center',
                direction: 'rtl',
                transition: 'all 0.2s',
                transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                lineHeight: 1.4,
                minHeight: 56,
              }}
            >
              {answered && isCorrect ? '✓ ' : ''}{displayText}
              {answered && isSelected && !isCorrect ? ' ✗' : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}
