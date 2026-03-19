import { useNavigate } from 'react-router-dom';
import { COURSE } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import AppShell from '../components/layout/AppShell';
import StarRating from '../components/gamification/StarRating';

const GOAL_LESSONS = ['pasuk-1', 'pasuk-2', 'pasuk-3'];
const MAX_STARS = GOAL_LESSONS.length * 3;

function MagicianGoal() {
  const { getLessonProgress } = useProgress();
  const totalStars = GOAL_LESSONS.reduce((s, id) => s + (getLessonProgress(id)?.stars ?? 0), 0);
  const done = totalStars >= MAX_STARS;
  const pct = Math.round((totalStars / MAX_STARS) * 100);

  return (
    <div style={{
      background: done
        ? 'linear-gradient(135deg, #FFF9C4 0%, #FFF176 100%)'
        : 'linear-gradient(135deg, #E8F4FF 0%, #D6EEFF 100%)',
      border: `3px solid ${done ? '#FFC800' : '#1CB0F6'}`,
      borderRadius: 20,
      padding: '16px 20px',
      marginBottom: 24,
      direction: 'rtl',
      boxShadow: done ? '0 4px 0 #E6B400' : '0 4px 0 #0E9FE6',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 36, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
          {done ? '🎩✨' : '🎩'}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 15, color: '#3E2723' }}>
            {done ? '!מזל טוב — ער האט פארדינט א מאגישן שפּיל' : 'ציל: לערן די ערשטע 3 פסוקים 100%'}
          </div>
          <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>
            {done
              ? 'איצט קומט א פּריוואטע שפּיל מיט א מאגישן!'
              : `${totalStars} / ${MAX_STARS} שטערן — ${pct}%`}
          </div>
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 999, height: 14, overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{
          background: done
            ? 'linear-gradient(90deg, #FFC800, #FFE033)'
            : 'linear-gradient(90deg, #1CB0F6, #5BD5FF)',
          height: '100%',
          width: `${pct}%`,
          borderRadius: 999,
          transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: done ? '0 2px 0 #E6B400' : '0 2px 0 #0E9FE6',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, fontWeight: 700 }}>
        {GOAL_LESSONS.map((id, i) => {
          const prog = getLessonProgress(id);
          const s = prog?.stars ?? 0;
          return (
            <span key={id} style={{ color: s > 0 ? '#FFC800' : '#CCC' }}>
              {'⭐'.repeat(s)}{'☆'.repeat(3 - s)} {['א', 'ב', 'ג'][i]}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const LESSON_COLORS = ['#58CC02', '#1CB0F6', '#CE82FF'];
const LESSON_SHADOWS = ['#46A302', '#0E9FE6', '#A855F7'];
const LESSON_LIGHT = ['#E9FFC0', '#D6F5FF', '#F3E5FF'];

export default function HomePage() {
  const navigate = useNavigate();
  const { isLessonUnlocked, getLessonProgress } = useProgress();

  return (
    <AppShell>
      <div style={{ padding: '16px 16px 32px', background: '#F7F7F7', minHeight: '100vh', direction: 'rtl' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 20,
          padding: '12px 0 8px',
        }}>
          <div style={{ fontSize: 40, marginBottom: 4, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }}>📖</div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 900,
            color: '#3E2723',
            margin: 0,
            fontFamily: "'Noto Serif Hebrew', serif",
          }}>
            פרשת ויקרא
          </h1>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4, fontWeight: 600 }}>לערן מיט שמחה!</div>
        </div>

        <MagicianGoal />

        {COURSE.map((unit) => (
          <div key={unit.id}>
            {/* Unit header */}
            <div style={{
              background: 'linear-gradient(135deg, #009688 0%, #00BCD4 100%)',
              borderRadius: 20,
              padding: '16px 20px',
              marginBottom: 20,
              boxShadow: '0 4px 0 #007A6E',
              direction: 'rtl',
            }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>{unit.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 2 }}>{unit.description}</div>
            </div>

            {/* Lesson path */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              {unit.lessons.map((lesson, idx) => {
                const unlocked = isLessonUnlocked(lesson.id);
                const prog = getLessonProgress(lesson.id);
                const color = LESSON_COLORS[idx % LESSON_COLORS.length]!;
                const shadow = LESSON_SHADOWS[idx % LESSON_SHADOWS.length]!;
                const light = LESSON_LIGHT[idx % LESSON_LIGHT.length]!;
                const isLeft = idx % 2 === 0;

                return (
                  <div key={lesson.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: isLeft ? 'flex-start' : 'flex-end', marginBottom: 8 }}>
                    {/* Connector line */}
                    {idx > 0 && (
                      <div style={{
                        width: 4,
                        height: 24,
                        background: '#D5D5D5',
                        borderRadius: 2,
                        marginRight: isLeft ? 0 : 38,
                        marginLeft: isLeft ? 38 : 0,
                        marginBottom: -4,
                      }} />
                    )}

                    <div
                      onClick={() => unlocked && navigate(`/lesson/${lesson.id}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        background: unlocked ? '#fff' : '#F0F0F0',
                        border: `3px solid ${unlocked ? color : '#D5D5D5'}`,
                        borderRadius: 20,
                        padding: '14px 18px',
                        cursor: unlocked ? 'pointer' : 'not-allowed',
                        opacity: unlocked ? 1 : 0.6,
                        boxShadow: unlocked ? `0 4px 0 ${shadow}` : '0 3px 0 #C0C0C0',
                        transition: 'transform 0.1s, box-shadow 0.1s',
                        direction: 'rtl',
                        width: '85%',
                        maxWidth: 360,
                        position: 'relative',
                      }}
                    >
                      {/* Big circle */}
                      <div style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: prog?.passed
                          ? `linear-gradient(135deg, ${color}, ${color}CC)`
                          : unlocked
                          ? light
                          : '#E5E5E5',
                        border: `3px solid ${unlocked ? color : '#D5D5D5'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 26,
                        flexShrink: 0,
                        boxShadow: unlocked && !prog?.passed
                          ? `0 0 0 4px ${color}30, 0 3px 0 ${shadow}`
                          : prog?.passed
                          ? `0 3px 0 ${shadow}`
                          : 'none',
                        color: prog?.passed ? '#fff' : unlocked ? color : '#999',
                        fontWeight: 900,
                        animation: unlocked && !prog?.passed ? 'lessonPulse 2s infinite' : 'none',
                      }}>
                        {prog?.passed ? '✓' : unlocked ? `פ${lesson.pasukNumber === 1 ? 'א' : lesson.pasukNumber === 2 ? 'ב' : 'ג'}` : '🔒'}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 900, fontSize: 17, color: '#3E2723' }}>{lesson.title}</div>
                        <div style={{ color: '#888', fontSize: 13, marginTop: 2, fontFamily: "'Noto Serif Hebrew', serif" }}>
                          {lesson.description}
                        </div>
                        <div style={{ color: '#AAA', fontSize: 12, marginTop: 3, fontWeight: 600 }}>
                          {lesson.wordIds.length} ווערטער
                        </div>
                        {prog?.passed && (
                          <div style={{ marginTop: 4 }}>
                            <StarRating stars={prog.stars} size={16} />
                          </div>
                        )}
                      </div>

                      {unlocked && !prog?.passed && (
                        <div style={{
                          background: color,
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 900,
                          borderRadius: 999,
                          padding: '6px 14px',
                          boxShadow: `0 3px 0 ${shadow}`,
                          flexShrink: 0,
                        }}>
                          שטארט
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes lessonPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(88,204,2,0.3), 0 3px 0 #46A302; }
          50% { box-shadow: 0 0 0 10px rgba(88,204,2,0.1), 0 3px 0 #46A302; }
        }
      `}</style>
    </AppShell>
  );
}
