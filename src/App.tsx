import { HashRouter, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import HomePage from './pages/HomePage';
import LessonPage from './pages/LessonPage';
import LessonCompletePage from './pages/LessonCompletePage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/lesson-complete" element={<LessonCompletePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </HashRouter>
    </ProgressProvider>
  );
}
