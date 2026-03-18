export function calculateStars(correctFirstTry: number, total: number): number {
  const pct = total === 0 ? 0 : correctFirstTry / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  return 1;
}

export function calculatePoints(correct: boolean, firstTry: boolean, _perfect: boolean = false): number {
  if (!correct) return 0;
  if (firstTry) return 10;
  return 5;
}

export const LEVELS = [
  { level: 1, title: 'תלמיד', minPoints: 0 },
  { level: 2, title: 'חבר', minPoints: 50 },
  { level: 3, title: 'בחור', minPoints: 150 },
  { level: 4, title: 'למדן', minPoints: 300 },
  { level: 5, title: 'חכם', minPoints: 500 },
  { level: 6, title: "ר׳", minPoints: 750 },
  { level: 7, title: 'גדול הדור', minPoints: 1000 },
];

export function getLevelForPoints(points: number) {
  let current = LEVELS[0]!;
  for (const lvl of LEVELS) {
    if (points >= lvl.minPoints) current = lvl;
  }
  return current;
}
