# Chumash Game

A gamified Duolingo-style Chumash learning app for Yiddish-speaking children learning Parshas Vayikra.

## Project Overview

This app teaches Hebrew vocabulary from Parshas Vayikra to Yiddish-speaking children using a game-based approach inspired by Duolingo. The design is ADHD/dyslexia-friendly with large touch targets, clear visual feedback, no timers, and audio support.

## Target Audience

- Yiddish-speaking children in traditional Chassidic/Orthodox communities
- Learning Parshas Vayikra vocabulary (korbanos section)
- ADHD and dyslexia accommodations built in

## Tech Stack

- React 18 + Vite + TypeScript
- React Router (HashRouter for Cloudflare Pages compatibility)
- Tailwind CSS v4 (inline styles used extensively for RTL support)
- Web Speech API for Hebrew pronunciation
- Web Audio API for sound effects
- localStorage for progress persistence

## Design System

- Background: `#FDF6E3` (warm parchment)
- Text: `#3E2723` (deep brown)
- Primary: `#009688` (teal)
- Success: `#4CAF50` | Error: `#FF9800` | Selected: `#F9A825`
- Full RTL layout (`dir="rtl"`)
- Min touch targets: 48x48px
- No timers ever
- Fonts: Noto Serif Hebrew (Hebrew text), Noto Sans Hebrew (UI)

## File Structure

```
src/
  types/index.ts          - TypeScript interfaces
  data/vocabulary.ts      - 25 Hebrew/Yiddish word pairs from Parshas Vayikra
  data/course.ts          - Course structure (units, lessons, exercises)
  lib/audioManager.ts     - Web Speech + Web Audio manager
  lib/scoring.ts          - Points, stars, level calculations
  context/ProgressContext.tsx - Global progress state with localStorage
  components/
    layout/               - AppShell, TopBar, BottomNav, ProgressBar
    exercises/            - ExerciseRunner, MultipleChoice, Flashcard
    gamification/         - Confetti, StarRating, PointsPopup
  pages/
    HomePage.tsx          - Unit/lesson map (Duolingo-style path)
    LessonPage.tsx        - Exercise session wrapper
    LessonCompletePage.tsx - Results screen with stars and confetti
    ProfilePage.tsx       - User stats and badges
```

## Deployment

Deployed to Cloudflare Pages. Uses HashRouter so all routes work without server-side configuration.

## Phase 1 Status

- One full lesson playable (lesson-1-1: ערשטע ווערטער)
- 12 exercises: flashcards + multiple choice + reverse choice
- Stars (1-3) based on first-try accuracy
- Points and streak tracking
- Badge system (first-korban)
- Lesson unlock progression
