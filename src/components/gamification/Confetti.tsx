import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  r: number;
  rSpeed: number;
  speed: number;
  drift: number;
}

export default function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(undefined);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#009688', '#F9A825', '#4CAF50', '#FF9800', '#E91E63', '#3F51B5'];
    particlesRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      r: Math.random() * Math.PI * 2,
      rSpeed: (Math.random() - 0.5) * 0.15,
      speed: Math.random() * 3 + 2,
      drift: (Math.random() - 0.5) * 1.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speed;
        p.x += p.drift;
        p.r += p.rSpeed;
      });
      particlesRef.current = particlesRef.current.filter(p => p.y < canvas.height + 20);
      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(draw);
      }
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000 }}
    />
  );
}
