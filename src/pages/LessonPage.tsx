import { useParams, useNavigate } from 'react-router-dom';
import { COURSE } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import ExerciseRunner from '../components/exercises/ExerciseRunner';
import { ExerciseResult } from '../types';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { completeLesson } = useProgress();

  let lesson = null;
  for (const unit of COURSE) {
    const found = unit.lessons.find(l => l.id === lessonId);
    if (found) { lesson = found; break; }
  }

  if (!lesson) return (
    <div style={{ padding: 24, textAlign: 'center', color: '#3E2723' }}>
      <div>שיעור נישט געפונן</div>
      <button onClick={() => navigate('/')} style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}>צוריק</button>
    </div>
  );

  const handleComplete = (
    results: ExerciseResult[],
    passed: boolean,
    stars: number,
    wrongWordIds: string[],
  ) => {
    const totalWords = lesson!.wordIds.length;
    const correctWords = lesson!.wordIds.filter(id =>
      results.some(r => r.wordId === id && r.correct)
    ).length;
    const totalPoints = results.reduce((s, r) => s + r.pointsEarned, 0);

    completeLesson(lesson!.id, totalWords, correctWords, wrongWordIds, totalPoints);

    navigate('/lesson-complete', {
      state: {
        lessonId: lesson!.id,
        totalPoints,
        stars,
        passed,
        wrongWordIds,
        totalWords,
        correctWords,
      },
    });
  };

  return (
    <div style={{ background: '#FDF6E3', minHeight: '100vh' }}>
      {/* Back bar */}
      <div style={{
        background: '#fff',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '2px solid #EFEBE9',
        direction: 'rtl',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#9E9E9E' }}
        >
          ✕
        </button>
        <span style={{ fontWeight: 800, fontSize: 18, color: '#3E2723' }}>{lesson.title}</span>
      </div>

      <ExerciseRunner lesson={lesson} onComplete={handleComplete} />
    </div>
  );
}
