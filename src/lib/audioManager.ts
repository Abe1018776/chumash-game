// AudioManager — recorded MP3s with TTS fallback + haptics

function vibrate(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch { /* not supported */ }
}

function getAudioCtx() {
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
}

class AudioManager {
  private muted = false;

  // ── Word audio — IndexedDB recording → bundled MP3 → TTS ──────────────────
  async speakWord(wordId: string, hebrewText: string): Promise<void> {
    if (this.muted) return;
    try {
      const { recordingManager } = await import('./recordingManager');
      const url = await recordingManager.getURL(wordId);
      if (url) {
        const audio = new Audio(url);
        audio.play().catch(() => this._speakMP3orTTS(wordId, hebrewText));
        return;
      }
    } catch { /* no IndexedDB */ }
    this._speakMP3orTTS(wordId, hebrewText);
  }

  private _speakMP3orTTS(wordId: string, hebrewText: string): void {
    const audio = new Audio(`/audio/words/${wordId}.mp3`);
    audio.onerror = () => this.speak(hebrewText);
    audio.oncanplay = () => { audio.play().catch(() => this.speak(hebrewText)); };
    audio.load();
  }

  speak(text: string, lang = 'he-IL') {
    if (this.muted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = 0.8;
    utt.pitch = 1.1;
    window.speechSynthesis.speak(utt);
  }

  // ── Correct answer — Duolingo-style bright "ding ding" ────────────────────
  playCorrect() {
    if (this.muted) return;
    vibrate(40); // soft tap
    try {
      const ctx = getAudioCtx();
      // Two-note ascending chime: major third
      this._ding(ctx, 880, 0, 0.18);   // A5
      this._ding(ctx, 1108, 0.13, 0.22); // C#6
    } catch { /* */ }
  }

  private _ding(ctx: AudioContext, freq: number, startDelay: number, duration: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    // Add a tiny 2nd harmonic for "bell" timbre
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc.connect(gain); gain.connect(ctx.destination);
    osc2.connect(gain2); gain2.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = freq;
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2.756; // inharmonic partial = bell character

    const t = ctx.currentTime + startDelay;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.08, t + 0.008);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.5);

    osc.start(t); osc.stop(t + duration);
    osc2.start(t); osc2.stop(t + duration);
  }

  // ── Wrong answer — Duolingo-style deep "bwong" ────────────────────────────
  playWrong() {
    if (this.muted) return;
    vibrate([80, 40, 80]); // double buzz
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);

      osc.type = 'sine';
      // Pitch drops from 180 → 120 Hz (falling "bong")
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    } catch { /* */ }
  }

  // ── Heart lost — heavier buzz + descending two-tone ──────────────────────
  playHeartLost() {
    if (this.muted) return;
    vibrate([120, 60, 180]);
    try {
      const ctx = getAudioCtx();
      const play = (freq: number, start: number) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = freq;
        const t = ctx.currentTime + start;
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.start(t); o.stop(t + 0.25);
      };
      play(300, 0);
      play(200, 0.18);
    } catch { /* */ }
  }

  // ── Lesson complete — ascending fanfare ───────────────────────────────────
  playComplete() {
    if (this.muted) return;
    vibrate([40, 30, 40, 30, 80]);
    try {
      const ctx = getAudioCtx();
      // C major arpeggio: C5 E5 G5 C6
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        this._ding(ctx, freq, i * 0.11, 0.5 - i * 0.04);
      });
    } catch { /* */ }
  }

  setMuted(muted: boolean) { this.muted = muted; }
  toggleMute() { this.muted = !this.muted; return this.muted; }
  isMuted() { return this.muted; }
}

export const audioManager = new AudioManager();
