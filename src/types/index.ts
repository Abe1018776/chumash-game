export interface VocabWord {
  id: string;
  hebrew: string;
  yiddish: string;
  emoji?: string;
  category: 'olah' | 'minchah' | 'shelamim' | 'general';
  pasukId?: string;      // e.g. 'pasuk-1'
  highlight?: string;    // exact substring to highlight in pasuk text
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;          // Yiddish
  description: string;
  pasukNumber: number;    // 1, 2, 3...
  pasukText: string;      // full Hebrew text of the pasuk
  wordIds: string[];      // ordered vocab words for this pasuk
  unlocked: boolean;
}

export interface Unit {
  id: string;
  title: string;
  hebrewTitle: string;
  description: string;
  lessons: Lesson[];
  color: string;
}

export interface WordMastery {
  correct: number;
  total: number;
  needsReview: boolean;
}

export interface LessonProgress {
  completed: boolean;
  passed: boolean;        // 80%+ accuracy achieved
  stars: number;
  bestScore: number;
  attempts: number;
}

export interface UserProgress {
  points: number;
  streak: number;
  lastStudyDate: string;
  lessonProgress: Record<string, LessonProgress>;
  unlockedLessons: string[];
  earnedBadges: string[];
  level: number;
  wordMastery: Record<string, WordMastery>;
  reviewQueue: Record<string, string[]>; // lessonId -> wordIds that need review
}

export interface ExerciseResult {
  wordId: string;
  correct: boolean;
  firstTry: boolean;
  pointsEarned: number;
}
