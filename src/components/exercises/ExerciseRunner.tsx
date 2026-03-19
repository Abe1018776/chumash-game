import { useState, useCallback, useMemo } from 'react';
import { Lesson, VocabWord, ExerciseResult } from '../../types';
import { getWordById, getDistractors } from '../../data/vocabulary';
import { calculatePoints } from '../../lib/scoring';
import { useProgress } from '../../context/ProgressContext';
import MultipleChoice from './MultipleChoice';
import ListenChoice from './ListenChoice';
import TeitschMatch from './TeitschMatch';
import PasukBanner from './PasukBanner';
import ProgressBar from '../layout/ProgressBar';
import PointsPopup from '../gamification/PointsPopup';
import HeartsBar from './HeartsBar';
import RecordButton from './RecordButton';

const MAX_HEARTS = 3;
type QuizType = 'mc' | 'listen' | 'reverse';

interface QuizStep { wordId: string; type: QuizType; isReview: boolean; }

interface ExerciseRunnerProps {
  lesson: Lesson;
  onComplete: (results: ExerciseResult[], passed: boolean, stars: number, wrongWordIds: string[]) => void;
}

type Phase = 'introduce' | 'quiz' | 'match' | 'no-hearts';

export default function ExerciseRunner({ lesson, onComplete }: ExerciseRunnerProps) {
  const { getReviewWords, updateWordMastery } = useProgress();
  const reviewWords = getReviewWords(lesson.id);

  // Build quiz word list: original + review extras
  const quizWordIds = useMemo(() => {
    const extras = reviewWords.filter(id => !lesson.wordIds.includes(id));
    return [...lesson.wordIds, ...extras];
  }, [lesson.wordIds, reviewWords]);

  // Build quiz plan — cycle through mc/listen/reverse
  const TYPES: QuizType[] = ['mc', 'listen', 'reverse'];
  const quizPlan = useMemo<QuizStep[]>(() => {
    const plan = quizWordIds.map((wordId, i) => ({
      wordId,
      type: TYPES[i % TYPES.length]!,
      isReview: !lesson.wordIds.includes(wordId),
    }));
    // Shuffle while keeping review words together at the end
    const originals = plan.filter(s => !s.isReview).sort(() => Math.random() - 0.5);
    const extras = plan.filter(s => s.isReview);
    return [...originals, ...extras];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizWordIds.join(',')]);

  const [phase, setPhase] = useState<Phase>('introduce');
  const [introduceIdx, setIntroduceIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [lastPoints, setLastPoints] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [quizFirstTry, setQuizFirstTry] = useState(true);

  const finish = useCallback((resultsToUse: ExerciseResult[]) => {
    const correctCount = lesson.wordIds.filter(id =>
      resultsToUse.some(r => r.wordId === id && r.correct)
    ).length;
    const wrongWordIds = lesson.wordIds.filter(id =>
      !resultsToUse.some(r => r.wordId === id && r.correct)
    );
    const accuracy = lesson.wordIds.length > 0 ? correctCount / lesson.wordIds.length : 0;
    const passed = accuracy >= 0.8;
    const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1;
    onComplete(resultsToUse, passed, stars, wrongWordIds);
  }, [lesson.wordIds, onComplete]);

  // ── Introduce phase ────────────────────────────────────────────────────────

  const introduceWord = getWordById(lesson.wordIds[introduceIdx] ?? '');

  const handleIntroNext = useCallback(() => {
    const next = introduceIdx + 1;
    if (next >= lesson.wordIds.length) setPhase('quiz');
    else setIntroduceIdx(next);
  }, [introduceIdx, lesson.wordIds.length]);

  // ── Quiz phase ─────────────────────────────────────────────────────────────

  const step = quizPlan[quizIdx];
  const quizWord = step ? getWordById(step.wordId) : undefined;

  const distractors = useMemo(() => {
    if (!quizWord) return [];
    return getDistractors(quizWord.id, quizWord.pasukId, 3);
  }, [quizWord]);

  const options: VocabWord[] = useMemo(() => {
    if (!quizWord) return [];
    return [...distractors, quizWord].sort(() => Math.random() - 0.5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizWord?.id, quizIdx]);

  const handleQuizAnswer = useCallback((correct: boolean) => {
    if (!quizWord || !step) return;

    const pts = correct && quizFirstTry ? calculatePoints(true, true) : correct ? calculatePoints(true, false) : 0;
    const result: ExerciseResult = { wordId: quizWord.id, correct, firstTry: correct && quizFirstTry, pointsEarned: pts };

    updateWordMastery(quizWord.id, correct);

    let newHearts = hearts;
    if (!correct) {
      newHearts = hearts - 1;
      setHearts(newHearts);
      import('../../lib/audioManager').then(m => m.audioManager.playHeartLost());
    } else {
      import('../../lib/audioManager').then(m => m.audioManager.playCorrect());
      if (pts > 0) {
        setLastPoints(pts);
        setShowPoints(true);
        setTimeout(() => setShowPoints(false), 1200);
      }
    }

    const newResults = [...results, result];
    setResults(newResults);

    const advance = () => {
      if (newHearts <= 0) { setPhase('no-hearts'); return; }
      const next = quizIdx + 1;
      if (next >= quizPlan.length) {
        // Go to match game finale before finishing
        setPhase('match');
      } else {
        setQuizIdx(next);
        setQuizFirstTry(true);
      }
    };

    if (correct) setTimeout(advance, 600);
    else {
      setQuizFirstTry(false);
      setTimeout(advance, 1000);
    }
  }, [quizWord, step, quizFirstTry, hearts, results, quizIdx, quizPlan.length, updateWordMastery, finish]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === 'introduce') {
    if (!introduceWord) return null;
    return (
      <div style={{ direction: 'rtl', minHeight: '100vh', background: '#F7F7F7' }}>
        <PasukBanner pasukNumber={lesson.pasukNumber} pasukText={lesson.pasukText} highlight={introduceWord.highlight} />
        <div style={{ textAlign: 'center', padding: '8px 16px 0', color: '#888', fontSize: 13, fontWeight: 700 }}>
          לערן — {introduceIdx + 1} / {lesson.wordIds.length}
        </div>
        <ProgressBar current={introduceIdx} total={lesson.wordIds.length} />
        <IntroCard key={introduceWord.id} word={introduceWord} onNext={handleIntroNext} isLast={introduceIdx === lesson.wordIds.length - 1} />
      </div>
    );
  }

  if (phase === 'no-hearts') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #FFE0E0 0%, #FFF0F0 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 24, direction: 'rtl',
      }}>
        <div style={{ fontSize: 80, marginBottom: 12, filter: 'drop-shadow(0 4px 8px rgba(255,75,75,0.3))' }}>💔</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#CC0000', marginBottom: 8 }}>אויס הערצלעך!</div>
        <div style={{ fontSize: 16, color: '#888', marginBottom: 32, fontWeight: 600 }}>פּרוביר נאכאמאל — דו קענסט עס!</div>
        <button
          onClick={() => {
            setPhase('introduce');
            setIntroduceIdx(0);
            setQuizIdx(0);
            setResults([]);
            setHearts(MAX_HEARTS);
            setQuizFirstTry(true);
          }}
          style={{
            background: 'linear-gradient(180deg, #58CC02 0%, #4DB800 100%)',
            color: '#fff', border: 'none', borderRadius: 18,
            padding: '18px 48px', fontSize: 20, fontWeight: 900, cursor: 'pointer',
            boxShadow: '0 6px 0 #46A302',
          }}
        >
          🔄 פּרובירן נאכאמאל
        </button>
      </div>
    );
  }

  // Match game finale
  if (phase === 'match') {
    const matchWords = lesson.wordIds.map(id => getWordById(id)).filter((w): w is VocabWord => !!w);
    return (
      <div style={{ direction: 'rtl', minHeight: '100vh', background: '#F7F7F7' }}>
        <PasukBanner pasukNumber={lesson.pasukNumber} pasukText={lesson.pasukText} />
        <div style={{
          textAlign: 'center', padding: '12px 16px 4px',
          color: '#CE82FF', fontWeight: 900, fontSize: 16,
        }}>
          🏆 סוף חזרה — פאַרבינד אַלעס!
        </div>
        <TeitschMatch
          words={matchWords}
          onComplete={() => finish(results)}
        />
      </div>
    );
  }

  if (!quizWord || !step) return null;

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh', background: '#F7F7F7' }}>
      <PasukBanner pasukNumber={lesson.pasukNumber} pasukText={lesson.pasukText} highlight={quizWord.highlight} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 0' }}>
        <HeartsBar hearts={hearts} maxHearts={MAX_HEARTS} />
        {step.isReview && (
          <span style={{
            fontSize: 11, color: '#fff', fontWeight: 800,
            background: '#FF9600', borderRadius: 999, padding: '3px 10px',
          }}>🔁 חזרה</span>
        )}
        <div style={{ color: '#999', fontSize: 13, fontWeight: 700 }}>
          {quizIdx + 1} / {quizPlan.length}
        </div>
      </div>

      <ProgressBar current={quizIdx} total={quizPlan.length} />
      <PointsPopup points={lastPoints} show={showPoints} />

      {step.type === 'mc' && (
        <MultipleChoice key={`mc-${quizIdx}`} word={quizWord} options={options} reversed={false} onAnswer={handleQuizAnswer} />
      )}
      {step.type === 'reverse' && (
        <MultipleChoice key={`rv-${quizIdx}`} word={quizWord} options={options} reversed={true} onAnswer={handleQuizAnswer} />
      )}
      {step.type === 'listen' && (
        <ListenChoice key={`ls-${quizIdx}`} word={quizWord} options={options} onAnswer={handleQuizAnswer} />
      )}
    </div>
  );
}

// ── Intro card ──────────────────────────────────────────────────────────────

function IntroCard({ word, onNext, isLast }: { word: VocabWord; onNext: () => void; isLast: boolean }) {
  const [flipped, setFlipped] = useState(false);

  useState(() => {
    import('../../lib/audioManager').then(m => m.audioManager.speakWord(word.id, word.hebrew));
  });

  return (
    <div style={{ padding: '16px 16px 24px', direction: 'rtl' }}>
      {/* Flashcard */}
      <div
        onClick={() => { if (!flipped) setFlipped(true); }}
        style={{
          background: flipped
            ? 'linear-gradient(135deg, #E9FFC0 0%, #D4F5A0 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
          border: `3px solid ${flipped ? '#58CC02' : '#1CB0F6'}`,
          borderRadius: 24,
          padding: '28px 24px',
          textAlign: 'center',
          cursor: flipped ? 'default' : 'pointer',
          boxShadow: flipped ? '0 6px 0 #46A302' : '0 6px 0 #0E9FE6',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          minHeight: 170,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12,
        }}
      >
        {word.emoji && (
          <div style={{ fontSize: 52, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }}>
            {word.emoji}
          </div>
        )}
        <div style={{
          fontSize: 44,
          fontFamily: "'Noto Serif Hebrew', serif",
          fontWeight: 700,
          color: '#3E2723',
          lineHeight: 1.4,
        }}>
          {word.hebrew}
        </div>
        {flipped && (
          <div style={{
            fontSize: 22,
            color: '#2A6600',
            fontWeight: 800,
            marginTop: 4,
            direction: 'rtl',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: 12,
            padding: '6px 16px',
          }}>
            {word.yiddish}
          </div>
        )}
        {!flipped && (
          <div style={{
            color: '#1CB0F6',
            fontSize: 13,
            fontWeight: 700,
            background: '#E6F7FF',
            borderRadius: 999,
            padding: '4px 14px',
          }}>
            tap to see teitsh
          </div>
        )}
      </div>

      {/* Play again */}
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <button
          onClick={() => import('../../lib/audioManager').then(m => m.audioManager.speakWord(word.id, word.hebrew))}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
            border: '3px solid #E5E5E5',
            borderRadius: 999,
            padding: '8px 22px',
            color: '#555',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 14,
            boxShadow: '0 3px 0 #D0D0D0',
          }}
        >
          🔊 play again
        </button>
      </div>

      {/* Record buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <RecordButton wordId={word.id} label="Hebrew" autoPlay />
        </div>
        <div style={{ flex: 1 }}>
          <RecordButton wordId={`${word.id}-teitsh`} label="Teitsh" />
        </div>
      </div>

      {/* Next button */}
      {flipped && (
        <button
          onClick={onNext}
          style={{
            marginTop: 14,
            width: '100%',
            background: 'linear-gradient(180deg, #58CC02 0%, #4DB800 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 18,
            padding: '17px',
            fontSize: 18,
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 6px 0 #46A302',
            letterSpacing: '0.02em',
          }}
        >
          {isLast ? '🚀 Start Quiz!' : 'Next →'}
        </button>
      )}
    </div>
  );
}
