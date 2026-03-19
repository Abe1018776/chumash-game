import { useState } from 'react';
import { VocabWord } from '../../types';
import { audioManager } from '../../lib/audioManager';

interface MultipleChoiceProps {
  word: VocabWord;
  options: VocabWord[];
  reversed?: boolean;
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
    <div style={{ padding: '20px 16px', direction: 'rtl' }}>
      {/* Question label */}
      <div style={{
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 700,
        color: '#777',
        marginBottom: 16,
        letterSpacing: '0.03em',
      }}>
        {reversed ? 'וואָס איז דאס אויף לשון קודש?' : 'וואָס מיינט דאס?'}
      </div>

      {/* Prompt card */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        {word.emoji && (
          <div style={{ fontSize: 60, marginBottom: 10, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>
            {word.emoji}
          </div>
        )}
        <button
          onClick={() => audioManager.speak(word.hebrew)}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)',
            border: '3px solid #E5E5E5',
            borderRadius: 20,
            padding: reversed ? '16px 32px' : '20px 40px',
            cursor: 'pointer',
            fontSize: reversed ? 20 : 38,
            fontFamily: reversed ? 'inherit' : "'Noto Serif Hebrew', serif",
            fontWeight: 700,
            color: '#3E2723',
            direction: 'rtl',
            boxShadow: '0 4px 0 #D5D5D5',
            lineHeight: 1.4,
            display: 'inline-block',
            transition: 'transform 0.1s, box-shadow 0.1s',
            minWidth: 160,
          }}
        >
          {prompt}
          {!reversed && (
            <div style={{ fontSize: 13, color: '#AAA', fontFamily: 'sans-serif', marginTop: 4, fontWeight: 600 }}>
              🔊 דריק צו הערן
            </div>
          )}
        </button>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map(opt => {
          const isSelected = selected === opt.id;
          const isCorrect = opt.id === word.id;

          let bg = 'linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)';
          let border = '3px solid #E5E5E5';
          let color = '#3E2723';
          let shadow = '0 4px 0 #D5D5D5';
          let icon = '';

          if (answered && isCorrect) {
            bg = 'linear-gradient(180deg, #D7F5A0 0%, #C2EC7A 100%)';
            border = '3px solid #58CC02';
            color = '#2A6600';
            shadow = '0 4px 0 #46A302';
            icon = '✓ ';
          } else if (answered && isSelected && !isCorrect) {
            bg = 'linear-gradient(180deg, #FFE5E5 0%, #FFCCCC 100%)';
            border = '3px solid #FF4B4B';
            color = '#CC0000';
            shadow = '0 4px 0 #CC3333';
            icon = '✗ ';
          }

          const displayText = reversed ? opt.hebrew : opt.yiddish;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={answered}
              style={{
                background: bg,
                border,
                borderRadius: 16,
                padding: '16px 20px',
                fontSize: reversed ? 26 : 17,
                fontFamily: reversed ? "'Noto Serif Hebrew', serif" : 'inherit',
                fontWeight: 700,
                color,
                cursor: answered ? 'default' : 'pointer',
                textAlign: 'center',
                direction: 'rtl',
                transition: 'transform 0.1s, box-shadow 0.1s',
                transform: isSelected && answered ? 'translateY(2px)' : 'translateY(0)',
                boxShadow: isSelected && answered ? '0 2px 0 #ccc' : shadow,
                lineHeight: 1.4,
                minHeight: 58,
              }}
            >
              {icon}{displayText}
            </button>
          );
        })}
      </div>
    </div>
  );
}
