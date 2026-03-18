import { useEffect, useState } from 'react';

export default function PointsPopup({ points, show }: { points: number; show: boolean }) {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (show && points > 0) {
      setKey(k => k + 1);
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 1200);
      return () => clearTimeout(t);
    }
  }, [show, points]);

  if (!visible) return null;
  return (
    <div key={key} style={{
      position: 'fixed',
      top: '30%',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: 28,
      fontWeight: 900,
      color: '#F9A825',
      textShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 500,
      animation: 'floatUp 1.2s ease-out forwards',
      pointerEvents: 'none',
    }}>
      +{points}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-60px); }
        }
      `}</style>
    </div>
  );
}
