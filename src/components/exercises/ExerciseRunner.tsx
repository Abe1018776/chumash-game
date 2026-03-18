import { useState, useCallback, useMemo } from 'react';
import { Lesson, VocabWord, ExerciseResult } from '../../types';
import { getWordById, getDistractors } from '../../data/vocabulary';
import { calculatePoints } from '../../lib/scoring';
import { useProgress } from '../../context/ProgressContext';
import MultipleChoice from './MultipleChoice';
import ListenChoice from './ListenChoice';
import PasukBanner from './PasukBanner';
import ProgressBar from '../layout/ProgressBar';
import PointsPopup from '../gamification/PointsPopup';
import HeartsBar from './HeartsBar';

const MAX_HEARTS = 3;
type QuizType = 'mc' | 'listen' | 'reverse';

interface QuizStep { wordId: string; type: QuizType; isReview: boolean; }

interface ExerciseRunnerProps {
  lesson: Lesson;
  onComplete: (results: ExerciseResult[], passed: boolean, stars: number, wrongWordIds: string[]) => void;
}

type Phase = 'introduce' | 'quiz' | 'no-hearts';

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
    } else if (pts > 0) {
      setLastPoints(pts);
      setShowPoints(true);
      setTimeout(() => setShowPoints(false), 1200);
    }

    const newResults = [...results, result];
    setResults(newResults);

    const finish = () => {
      const correctCount = lesson.wordIds.filter(id =>
        newResults.some(r => r.wordId === id && r.correct)
      ).length;
      const wrongWordIds = lesson.wordIds.filter(id =>
        !newResults.some(r => r.wordId === id && r.correct)
      );
      const accuracy = lesson.wordIds.length > 0 ? correctCount / lesson.wordIds.length : 0;
      const passed = accuracy >= 0.8;
      const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1;
      onComplete(newResults, passed, stars, wrongWordIds);
    };

    const advance = () => {
      if (newHearts <= 0) { setPhase('no-hearts'); return; }
      const next = quizIdx + 1;
      if (next >= quizPlan.length) {
        finish();
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
  }, [quizWord, step, quizFirstTry, hearts, results, quizIdx, quizPlan.length, lesson.wordIds, updateWordMastery, onComplete]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === 'introduce') {
    if (!introduceWord) return null;
    return (
      <div style={{ direction: 'rtl', minHeight: '100vh', background: '#FDF6E3' }}>
        <PasukBanner pasukNumber={lesson.pasukNumber} pasukText={lesson.pasukText} highlight={introduceWord.highlight} />
        <div style={{ textAlign: 'center', padding: '6px 16px 0', color: '#795548', fontSize: 13, fontWeight: 600 }}>
          לערן — {introduceIdx + 1} פון {lesson.wordIds.length}
        </div>
        <ProgressBar current={introduceIdx} total={lesson.wordIds.length} />
        <IntroCard word={introduceWord} onNext={handleIntroNext} isLast={introduceIdx === lesson.wordIds.length - 1} />
      </div>
    );
  }

  if (phase === 'no-hearts') {
    return (
      <div style={{
        minHeight: '100vh', background: '#FDF6E3', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 24, direction: 'rtl',
      }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>💔</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#3E2723', marginBottom: 8 }}>אויס הערצלעך!</div>
        <div style={{ fontSize: 16, color: '#795548', marginBottom: 32 }}>פּרוביר נאכאמאל — דו קענסט עס!</div>
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
            background: '#009688', color: '#fff', border: 'none', borderRadius: 16,
            padding: '16px 40px', fontSize: 18, fontWeight: 800, cursor: 'pointer',
          }}
        >
          🔄 פּרובירן נאכאמאל
        </button>
      </div>
    );
  }

  if (!quizWord || !step) return null;

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh', background: '#FDF6E3' }}>
      <PasukBanner pasukNumber={lesson.pasukNumber} pasukText={lesson.pasukText} highlight={quizWord.highlight} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px 0' }}>
        <HeartsBar hearts={hearts} maxHearts={MAX_HEARTS} />
        {step.isReview && (
          <span style={{ fontSize: 12, color: '#E65100', fontWeight: 700 }}>🔁 חזרה</span>
        )}
        <div style={{ color: '#795548', fontSize: 12, fontWeight: 600 }}>
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
    <div style={{ padding: '16px 16px 0', direction: 'rtl' }}>
      <div style={{ textAlign: 'center', marginBottom: 12, color: '#795548', fontSize: 15, fontWeight: 600 }}>
        {flipped ? 'דאס איז דער טייטש:' : 'דריק צו זען דעם טייטש'}
      </div>

      <div
        onClick={() => { if (!flipped) setFlipped(true); }}
        style={{
          background: flipped ? '#E8F5E9' : '#fff',
          border: `3px solid ${flipped ? '#4CAF50' : '#009688'}`,
          borderRadius: 20, padding: '32px 24px', textAlign: 'center',
          cursor: flipped ? 'default' : 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', transition: 'all 0.3s',
          minHeight: 180, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10,
        }}
      >
        {word.emoji && <div style={{ fontSize: 48 }}>{word.emoji}</div>}
        <div style={{ fontSize: 44, fontFamily: "'Noto Serif Hebrew', serif", fontWeight: 700, color: '#3E2723', lineHeight: 1.4 }}>
          {word.hebrew}
        </div>
        {flipped && <div style={{ fontSize: 22, color: '#2E7D32', fontWeight: 600, marginTop: 6 }}>{word.yiddish}</div>}
        {!flipped && <div style={{ color: '#9E9E9E', fontSize: 13 }}>🔊 דריק אויף דעם קארטל</div>}
      </div>

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <button
          onClick={() => import('../../lib/audioManager').then(m => m.audioManager.speakWord(word.id, word.hebrew))}
          style={{ background: 'none', border: '2px solid #009688', borderRadius: 999, padding: '5px 18px', color: '#009688', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
        >
          🔊 נאכאמאל הערן
        </button>
      </div>

      {flipped && (
        <button
          onClick={onNext}
          style={{
            marginTop: 20, width: '100%', background: '#009688', color: '#fff',
            border: 'none', borderRadius: 16, padding: '16px',
            fontSize: 18, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,150,136,0.3)',
          }}
        >
          {isLast ? '!איצט גייט דער קוויז ←' : 'הבא ←'}
        </button>
      )}
    </div>
  );
}
