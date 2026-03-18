import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProgress, LessonProgress, WordMastery } from '../types';
import { getLevelForPoints } from '../lib/scoring';
import { LESSON_ORDER } from '../data/course';

const DEFAULT_PROGRESS: UserProgress = {
  points: 0,
  streak: 0,
  lastStudyDate: '',
  lessonProgress: {},
  unlockedLessons: ['pasuk-1'],
  earnedBadges: [],
  level: 1,
  wordMastery: {},
  reviewQueue: {},
};

interface ProgressContextType {
  progress: UserProgress;
  addPoints: (pts: number) => void;
  completeLesson: (
    lessonId: string,
    totalWords: number,
    correctWords: number,
    wrongWordIds: string[],
    points: number,
  ) => { passed: boolean; stars: number };
  isLessonUnlocked: (lessonId: string) => boolean;
  getLessonProgress: (lessonId: string) => LessonProgress | null;
  getReviewWords: (lessonId: string) => string[];
  updateWordMastery: (wordId: string, correct: boolean) => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem('chumash_progress_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PROGRESS, ...parsed };
      }
    } catch { /* ignore */ }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem('chumash_progress_v2', JSON.stringify(progress));
  }, [progress]);

  // Reset streak if more than 1 day gap
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]!;
    if (!progress.lastStudyDate) return;
    const diff = Math.floor(
      (new Date(today).getTime() - new Date(progress.lastStudyDate).getTime()) / 86400000
    );
    if (diff > 1) setProgress(p => ({ ...p, streak: 0 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPoints = (pts: number) => {
    setProgress(p => {
      const newPoints = p.points + pts;
      const level = getLevelForPoints(newPoints);
      const today = new Date().toISOString().split('T')[0]!;
      let streak = p.streak;
      if (p.lastStudyDate !== today) {
        const lastDate = p.lastStudyDate ? new Date(p.lastStudyDate) : null;
        const diff = lastDate
          ? Math.floor((new Date(today).getTime() - lastDate.getTime()) / 86400000)
          : 0;
        streak = diff === 1 ? streak + 1 : 1;
      }
      return { ...p, points: newPoints, level: level.level, lastStudyDate: today, streak };
    });
  };

  const completeLesson = (
    lessonId: string,
    totalWords: number,
    correctWords: number,
    wrongWordIds: string[],
    points: number,
  ): { passed: boolean; stars: number } => {
    const accuracy = totalWords > 0 ? correctWords / totalWords : 0;
    const passed = accuracy >= 0.8;
    const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1;

    setProgress(p => {
      const existing = p.lessonProgress[lessonId];
      const bestScore = Math.max(existing?.bestScore ?? 0, points);
      const bestStars = Math.max(existing?.stars ?? 0, stars);

      // Unlock next lesson if passed
      let newUnlocked = [...p.unlockedLessons];
      if (passed) {
        const idx = LESSON_ORDER.indexOf(lessonId);
        const next = idx >= 0 ? LESSON_ORDER[idx + 1] : null;
        if (next && !newUnlocked.includes(next)) newUnlocked.push(next);
      }

      // Save wrong words for next round
      const newReviewQueue = { ...p.reviewQueue };
      if (wrongWordIds.length > 0) {
        newReviewQueue[lessonId] = wrongWordIds;
      } else {
        delete newReviewQueue[lessonId]; // cleared if perfect
      }

      // Badges
      const newBadges = [...p.earnedBadges];
      if (!newBadges.includes('first-korban')) newBadges.push('first-korban');

      return {
        ...p,
        points: p.points + points,
        level: getLevelForPoints(p.points + points).level,
        lastStudyDate: new Date().toISOString().split('T')[0]!,
        lessonProgress: {
          ...p.lessonProgress,
          [lessonId]: {
            completed: true,
            passed: passed || (existing?.passed ?? false),
            stars: bestStars,
            bestScore,
            attempts: (existing?.attempts ?? 0) + 1,
          },
        },
        unlockedLessons: newUnlocked,
        reviewQueue: newReviewQueue,
        earnedBadges: newBadges,
      };
    });

    return { passed, stars };
  };

  const updateWordMastery = (wordId: string, correct: boolean) => {
    setProgress(p => {
      const existing: WordMastery = p.wordMastery[wordId] ?? { correct: 0, total: 0, needsReview: false };
      return {
        ...p,
        wordMastery: {
          ...p.wordMastery,
          [wordId]: {
            correct: existing.correct + (correct ? 1 : 0),
            total: existing.total + 1,
            needsReview: !correct,
          },
        },
      };
    });
  };

  const isLessonUnlocked = (lessonId: string) => progress.unlockedLessons.includes(lessonId);
  const getLessonProgress = (lessonId: string) => progress.lessonProgress[lessonId] ?? null;
  const getReviewWords = (lessonId: string) => progress.reviewQueue[lessonId] ?? [];

  return (
    <ProgressContext.Provider value={{
      progress,
      addPoints,
      completeLesson,
      isLessonUnlocked,
      getLessonProgress,
      getReviewWords,
      updateWordMastery,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
