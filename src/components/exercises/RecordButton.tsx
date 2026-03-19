import { useState, useRef, useEffect } from 'react';
import { recordingManager } from '../../lib/recordingManager';
import { audioManager } from '../../lib/audioManager';

interface RecordButtonProps {
  wordId: string;
  label: string;
  onSaved?: () => void;
}

type State = 'idle' | 'recording' | 'saved';

export default function RecordButton({ wordId, label, onSaved }: RecordButtonProps) {
  const [state, setState] = useState<State>('idle');
  const [hasExisting, setHasExisting] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    recordingManager.has(wordId).then(setHasExisting);
  }, [wordId]);

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
        setState('saved');
        setHasExisting(true);
        audioManager.playCorrect();
        onSaved?.();
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

  if (state === 'saved') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0' }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <span style={{ color: '#4CAF50', fontWeight: 700, fontSize: 13 }}>{label}</span>
      </div>
    );
  }

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

  return (
    <button
      onClick={startRecording}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: hasExisting ? '#E8F5E9' : '#FFF3E0',
        border: `2px solid ${hasExisting ? '#4CAF50' : '#FF9800'}`,
        borderRadius: 12, padding: '10px 16px', cursor: 'pointer', width: '100%',
      }}
    >
      <span style={{ fontSize: 20 }}>🎤</span>
      <span style={{ color: hasExisting ? '#2E7D32' : '#E65100', fontWeight: 700, fontSize: 13 }}>
        {hasExisting ? `Re-record ${label}` : `Record ${label}`}
      </span>
    </button>
  );
}
