import { ReactNode } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#FDF6E3',
      fontFamily: "'Noto Sans Hebrew', sans-serif",
      color: '#3E2723',
      direction: 'rtl',
    }}>
      <TopBar />
      <main style={{ paddingBottom: 80, maxWidth: 600, margin: '0 auto' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
