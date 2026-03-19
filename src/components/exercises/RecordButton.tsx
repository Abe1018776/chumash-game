import { useState, useRef, useEffect } from 'react';
import { recordingManager } from '../../lib/recordingManager';
import { audioManager } from '../../lib/audioManager';

interface RecordButtonProps {
  wordId: string;
  label: string;
  autoPlay?: boolean;
}

type State = 'idle' | 'recording' | 'done';

export default function RecordButton({ wordId, label, autoPlay }: RecordButtonProps) {
  const [state, setState] = useState<State>('idle');
  const [hasExisting, setHasExisting] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    recordingManager.has(wordId).then(exists => {
      setHasExisting(exists);
      if (exists && autoPlay) playback();
    });
  }, [wordId]);

  const playback = async () => {
    const url = await recordingManager.getURL(wordId);
    if (url) new Audio(url).play().catch(() => {});
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await recordingManager.save(wordId, blob);
        streamRef.current?.getTracks().forEach(t => t.stop());
        setHasExisting(true);
        setState('done');
        audioManager.playCorrect();
        // Play it back immediately so they hear what they recorded
        setTimeout(playback, 300);
      };

      mr.start();
      setState('recording');
    } catch {
      // Mic permission denied — skip silently
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  if (state === 'recording') {
    return (
      <button
        onPointerUp={stopRecording}
        onPointerLeave={stopRecording}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: '#FF5252', border: '3px solid #D32F2F',
          borderRadius: 12, padding: '10px 16px', cursor: 'pointer', width: '100%',
          animation: 'recordPulse 1s infinite',
        }}
      >
        <span style={{ fontSize: 20 }}>🎙️</span>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>Recording... release to stop</span>
        <style>{`@keyframes recordPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,82,82,0.4)} 50%{box-shadow:0 0 0 8px rgba(255,82,82,0)} }`}</style>
      </button>
    );
  }

  if (hasExisting) {
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={playback}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: '#E8F5E9', border: '2px solid #4CAF50',
            borderRadius: 12, padding: '10px 8px', cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 18 }}>▶️</span>
          <span style={{ color: '#2E7D32', fontWeight: 700, fontSize: 12 }}>{label}</span>
        </button>
        <button
          onClick={startRecording}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: '#FFF3E0', border: '2px solid #FF9800',
            borderRadius: 12, padding: '10px 8px', cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 18 }}>🎤</span>
          <span style={{ color: '#E65100', fontWeight: 700, fontSize: 12 }}>Re-record</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={startRecording}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: '#FFF3E0', border: '2px solid #FF9800',
        borderRadius: 12, padding: '10px 16px', cursor: 'pointer', width: '100%',
      }}
    >
      <span style={{ fontSize: 20 }}>🎤</span>
      <span style={{ color: '#E65100', fontWeight: 700, fontSize: 13 }}>Record {label}</span>
    </button>
  );
}
