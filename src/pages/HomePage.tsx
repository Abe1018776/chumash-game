import { useNavigate } from 'react-router-dom';
import { COURSE } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import AppShell from '../components/layout/AppShell';
import StarRating from '../components/gamification/StarRating';

const GOAL_LESSONS = ['pasuk-1', 'pasuk-2', 'pasuk-3'];
const MAX_STARS = GOAL_LESSONS.length * 3; // 9

function MagicianGoal() {
  const { getLessonProgress } = useProgress();
  const totalStars = GOAL_LESSONS.reduce((s, id) => s + (getLessonProgress(id)?.stars ?? 0), 0);
  const done = totalStars >= MAX_STARS;
  const pct = Math.round((totalStars / MAX_STARS) * 100);

  return (
    <div style={{
      background: done ? 'linear-gradient(135deg, #FFF9C4, #FFFDE7)' : '#fff',
      border: `2px solid ${done ? '#F9A825' : '#D7CCC8'}`,
      borderRadius: 16,
      padding: '14px 18px',
      marginBottom: 20,
      direction: 'rtl',
      boxShadow: done ? '0 4px 16px rgba(249,168,37,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 32 }}>{done ? '🎩✨' : '🎩'}</span>
        <div>
          <div style={{ fontWeight: 900, fontSize: 15, color: '#3E2723' }}>
            {done ? '!מזל טוב — ער האט פארדינט א מאגישן שפּיל' : 'ציל: לערן די ערשטע 3 פסוקים 100%'}
          </div>
          <div style={{ fontSize: 13, color: '#795548', marginTop: 1 }}>
            {done ? 'איצט קומט א פּריוואטע שפּיל מיט א מאגישן!' : `${totalStars} פון ${MAX_STARS} שטערן — ${pct}% גרייט`}
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ background: '#EFEBE9', borderRadius: 999, height: 10, overflow: 'hidden' }}>
        <div style={{
          background: done ? '#F9A825' : '#009688',
          height: '100%',
          width: `${pct}%`,
          borderRadius: 999,
          transition: 'width 0.5s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: '#9E9E9E' }}>
        {GOAL_LESSONS.map((id, i) => {
          const prog = getLessonProgress(id);
          return (
            <span key={id}>
              {['א', 'ב', 'ג'][i]} {'⭐'.repeat(prog?.stars ?? 0)}{'☆'.repeat(3 - (prog?.stars ?? 0))}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { isLessonUnlocked, getLessonProgress } = useProgress();

  return (
    <AppShell>
      <div style={{ padding: '16px 16px 24px', direction: 'rtl' }}>
        <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 900, color: '#3E2723', margin: '16px 0 16px' }}>
          📖 פרשת ויקרא
        </h1>

        <MagicianGoal />

        {COURSE.map((unit) => (
          <div key={unit.id} style={{ marginBottom: 32 }}>
            {/* Unit header */}
            <div style={{
              background: unit.color,
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 20, direction: 'rtl' }}>
                {unit.title}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginTop: 4, direction: 'rtl' }}>
                {unit.description}
              </div>
            </div>

            {/* Lessons */}
            {unit.lessons.map((lesson) => {
              const unlocked = isLessonUnlocked(lesson.id);
              const prog = getLessonProgress(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => unlocked && navigate(`/lesson/${lesson.id}`)}
                  style={{
                    background: '#fff',
                    border: `3px solid ${unlocked ? unit.color : '#D7CCC8'}`,
                    borderRadius: 16,
                    padding: '16px 20px',
                    marginBottom: 12,
                    cursor: unlocked ? 'pointer' : 'not-allowed',
                    opacity: unlocked ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    boxShadow: unlocked ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    transition: 'transform 0.15s',
                    direction: 'rtl',
                  }}
                >
                  {/* Circle */}
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: prog?.passed ? unit.color : unlocked ? '#F5F5F5' : '#EEEEEE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                    boxShadow: unlocked && !prog?.passed ? `0 0 0 3px ${unit.color}40` : 'none',
                    animation: unlocked && !prog?.passed ? 'pulse 2s infinite' : 'none',
                    color: prog?.passed ? '#fff' : '#3E2723',
                  }}>
                    {prog?.passed ? '✓' : unlocked ? String(lesson.pasukNumber) : '🔒'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 17, color: '#3E2723' }}>{lesson.title}</div>
                    <div style={{ color: '#795548', fontSize: 14, marginTop: 2, fontFamily: "'Noto Serif Hebrew', serif" }}>{lesson.description}</div>
                    <div style={{ color: '#9E9E9E', fontSize: 12, marginTop: 2 }}>{lesson.wordIds.length} ווערטער</div>
                    {prog?.passed && <div style={{ marginTop: 4 }}><StarRating stars={prog.stars} size={18} /></div>}
                  </div>

                  {unlocked && (
                    <div style={{ color: unit.color, fontSize: 24 }}>▶</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <style>{`
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 3px rgba(0,150,136,0.4); }
            50% { box-shadow: 0 0 0 8px rgba(0,150,136,0.2); }
          }
        `}</style>
      </div>
    </AppShell>
  );
}
