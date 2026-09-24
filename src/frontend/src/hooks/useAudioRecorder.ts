import { useCallback, useRef, useState } from "react";

export type RecordingState =
  | "idle"
  | "requesting"
  | "recording"
  | "stopped"
  | "error";

export interface AudioRecorderState {
  recordingState: RecordingState;
  audioBlob: Blob | null;
  audioUrl: string | null;
  duration: number;
  error: string | null;
  isRecording: boolean;
  isStopped: boolean;
}

export interface AudioRecorderControls {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
}

export function useAudioRecorder(): AudioRecorderState & AudioRecorderControls {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      setRecordingState("requesting");
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordingState("stopped");

        // Stop all tracks
        if (streamRef.current) {
          for (const track of streamRef.current.getTracks()) track.stop();
          streamRef.current = null;
        }
      };

      mediaRecorder.start(100);
      startTimeRef.current = Date.now();
      setRecordingState("recording");

      // Update duration every second
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.name === "NotAllowedError"
            ? "Microphone permission denied. Please allow microphone access."
            : err.name === "NotFoundError"
              ? "No microphone found. Please connect a microphone."
              : err.message
          : "Failed to start recording";
      setError(message);
      setRecordingState("error");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const resetRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setRecordingState("idle");
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setError(null);
    chunksRef.current = [];
  }, [audioUrl]);

  return {
    recordingState,
    audioBlob,
    audioUrl,
    duration,
    error,
    isRecording: recordingState === "recording",
    isStopped: recordingState === "stopped",
    startRecording,
    stopRecording,
    resetRecording,
  };
}
