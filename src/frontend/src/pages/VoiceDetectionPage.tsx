import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Square,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import StressManagementSuggestions from "../components/StressManagementSuggestions";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useProcessVoiceAnalysis } from "../hooks/useQueries";
import {
  type VoiceAnalysisResult,
  analyzeVoiceStress,
} from "../utils/voiceAnalysis";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Normalise a feature value into 0–100 for the progress bar */
function featureToPercent(value: number, max: number): number {
  return Math.min(100, Math.max(0, (value / max) * 100));
}

const PIPELINE_STEPS = [
  "1. Audio Capture",
  "2. Signal Processing",
  "3. MFCC Extraction",
  "4. Feature Normalization",
  "5. LR Classification",
];

export default function VoiceDetectionPage() {
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    blob: Blob;
    url: string;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processVoiceMutation = useProcessVoiceAnalysis();

  const {
    recordingState,
    audioBlob,
    audioUrl,
    duration,
    error: recordingError,
    isRecording,
    isStopped,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const activeAudioBlob = audioBlob ?? uploadedFile?.blob ?? null;
  const hasAudio = activeAudioBlob !== null;
  const isRequestingPermission = recordingState === "requesting";
  const hasRecordingError = recordingState === "error";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedFile({ blob: file, url, name: file.name });
    setResult(null);
    setAnalyzeError(null);
    resetRecording();
  };

  const handleAnalyze = async () => {
    if (!activeAudioBlob) return;

    // Guard against extremely small / empty blobs
    if (activeAudioBlob.size < 500) {
      setAnalyzeError(
        "The recording appears to be silent or too short. Please record at least 2 seconds of audio.",
      );
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setAnalyzeError(null);

    try {
      // Brief pause for UX feedback
      await new Promise((r) => setTimeout(r, 800));
      const analysis = await analyzeVoiceStress(activeAudioBlob);
      setResult(analysis);

      try {
        await processVoiceMutation.mutateAsync({
          isStressed: analysis.isStressed,
          confidence: analysis.confidence,
        });
      } catch {
        // Silent fail — backend result is non-critical
      }
    } catch {
      setAnalyzeError(
        "Failed to analyze audio. Please try recording again or upload a different file.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    resetRecording();
    if (uploadedFile) URL.revokeObjectURL(uploadedFile.url);
    setUploadedFile(null);
    setResult(null);
    setAnalyzeError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center shadow-sm border border-cyan-100 dark:border-cyan-800">
            <Mic className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "oklch(0.08 0 0)" }}
            >
              Voice Stress Detection
            </h1>
            <p className="text-sm text-muted-foreground">
              Record your voice to detect stress using MFCC features and
              Logistic Regression
            </p>
          </div>
        </div>

        {/* Pipeline steps */}
        <div className="flex flex-wrap gap-2 mt-4">
          {PIPELINE_STEPS.map((step) => (
            <span
              key={step}
              className="text-xs px-3 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 rounded-full font-medium"
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Input Panel ── */}
        <div className="space-y-4">
          {/* Microphone Recording Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mic className="w-4 h-4 text-cyan-500" />
              Microphone Recording
            </h3>

            {/* Visual area */}
            <div
              className={`flex items-center justify-center h-32 rounded-xl mb-4 transition-all ${
                isRecording
                  ? "bg-red-50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-700"
                  : hasRecordingError
                    ? "bg-destructive/5 border-2 border-destructive/30"
                    : isStopped && audioUrl
                      ? "bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800"
                      : "bg-muted/40 border-2 border-dashed border-border"
              }`}
            >
              {isRecording && (
                <div className="flex flex-col items-center gap-2">
                  {/* Animated waveform bars */}
                  <div className="flex items-end gap-1">
                    {(
                      ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const
                    ).map((id, i) => (
                      <div
                        key={id}
                        className="w-1.5 bg-red-500 rounded-full"
                        style={{
                          height: `${12 + Math.abs(Math.sin(i * 2.3 + 0.7)) * 24}px`,
                          animation: `pulse 0.${6 + (i % 4)}s ease-in-out infinite alternate`,
                          animationDelay: `${i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-red-600 dark:text-red-400 font-mono text-xl font-bold tracking-widest">
                    {formatDuration(duration)}
                  </span>
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                    Recording...
                  </span>
                </div>
              )}

              {isRequestingPermission && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                  <span className="text-xs">Requesting microphone access…</span>
                </div>
              )}

              {hasRecordingError && (
                <div className="flex flex-col items-center gap-1 text-destructive px-4 text-center">
                  <MicOff className="w-7 h-7 mb-1" />
                  <span className="text-xs font-medium">
                    {recordingError ?? "Microphone error"}
                  </span>
                </div>
              )}

              {isStopped && audioUrl && (
                <div className="flex flex-col items-center gap-2 w-full px-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-sm text-foreground font-medium">
                    Recorded — {formatDuration(duration)}
                  </span>
                  {/* biome-ignore lint/a11y/useMediaCaption: user's own recorded audio */}
                  <audio src={audioUrl} controls className="w-full h-8 mt-1" />
                </div>
              )}

              {recordingState === "idle" && !uploadedFile && (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Mic className="w-9 h-9 opacity-30" />
                  <span className="text-xs">Press record to start</span>
                </div>
              )}

              {recordingState === "idle" && uploadedFile && (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <CheckCircle className="w-6 h-6 text-cyan-400 mb-1" />
                  <span className="text-xs text-center px-3 truncate max-w-full">
                    {uploadedFile.name}
                  </span>
                </div>
              )}
            </div>

            {/* Recording controls */}
            <div className="flex gap-2">
              {(recordingState === "idle" || hasRecordingError) && (
                <Button
                  data-ocid="voice.record-start"
                  onClick={startRecording}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  <Mic className="w-3.5 h-3.5 mr-1.5" />
                  {hasRecordingError ? "Try Again" : "Start Recording"}
                </Button>
              )}

              {isRequestingPermission && (
                <Button disabled className="flex-1" size="sm">
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Requesting permission…
                </Button>
              )}

              {isRecording && (
                <Button
                  data-ocid="voice.record-stop"
                  onClick={stopRecording}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <Square className="w-3.5 h-3.5 mr-1.5" />
                  Stop Recording
                </Button>
              )}

              {isStopped && (
                <Button
                  data-ocid="voice.record-again"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Record Again
                </Button>
              )}
            </div>
          </div>

          {/* Upload Alternative */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-500" />
              Upload Audio File
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
            />
            {uploadedFile ? (
              <div className="space-y-2">
                {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded audio */}
                <audio src={uploadedFile.url} controls className="w-full h-8" />
                <p className="text-xs text-muted-foreground truncate">
                  {uploadedFile.name}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    URL.revokeObjectURL(uploadedFile.url);
                    setUploadedFile(null);
                    setResult(null);
                    setAnalyzeError(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="w-full"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Change File
                </Button>
              </div>
            ) : (
              <label
                htmlFor="audio-upload"
                className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 transition-all"
              >
                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">
                  Click to upload (MP3, WAV, OGG, WebM)
                </p>
              </label>
            )}
          </div>

          {/* Analyze Button — only show when audio is ready */}
          {hasAudio && !isRecording && !isRequestingPermission && (
            <Button
              data-ocid="voice.analyze"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-semibold py-5 text-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting MFCC Features…
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Analyze Voice
                </>
              )}
            </Button>
          )}

          {analyzeError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
              {analyzeError}
            </div>
          )}
        </div>

        {/* ── Right: Results Panel ── */}
        <div className="space-y-4">
          {!result && !isAnalyzing && (
            <div
              data-ocid="voice.empty-state"
              className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[220px]"
            >
              <Mic className="w-12 h-12 text-muted-foreground/25 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No analysis yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Record or upload audio to see stress detection results
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
              <p className="text-sm font-semibold text-foreground">
                Extracting MFCC features…
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Applying Logistic Regression classifier
              </p>
            </div>
          )}

          {result && !isAnalyzing && (
            <>
              {/* Stress Classification Result */}
              <div
                data-ocid="voice.result-card"
                className={`rounded-2xl border-2 p-5 ${
                  result.isStressed
                    ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                    : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    {result.isStressed ? (
                      <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                        Voice Analysis
                      </p>
                      <Badge
                        className={`text-sm font-bold px-3 py-1 ${
                          result.isStressed
                            ? "bg-red-500 hover:bg-red-500 text-white"
                            : "bg-green-500 hover:bg-green-500 text-white"
                        }`}
                      >
                        {result.isStressed ? "STRESSED" : "NOT STRESSED"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Confidence
                    </p>
                    <span
                      className={`text-3xl font-extrabold ${
                        result.isStressed
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={result.confidence * 100}
                  className={`h-2 ${result.isStressed ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
                />
              </div>

              {/* Extracted MFCC Features with bar indicators */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Extracted Features
                </p>
                <div className="space-y-3">
                  {[
                    {
                      label: "RMS Energy",
                      value: result.features.energy,
                      display: result.features.energy.toFixed(4),
                      max: 0.3,
                      color: "bg-cyan-500",
                    },
                    {
                      label: "Zero Crossing Rate",
                      value: result.features.zeroCrossingRate,
                      display: result.features.zeroCrossingRate.toFixed(4),
                      max: 0.3,
                      color: "bg-violet-500",
                    },
                    {
                      label: "Spectral Centroid",
                      value: result.features.spectralCentroid,
                      display: `${result.features.spectralCentroid} Hz`,
                      max: 4000,
                      color: "bg-amber-500",
                    },
                    {
                      label: "MFCC Mean",
                      value: result.features.mfccMean,
                      display: result.features.mfccMean.toFixed(3),
                      max: 2,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Pitch Variance",
                      value: result.features.pitchVariance,
                      display: result.features.pitchVariance.toFixed(5),
                      max: 0.01,
                      color: "bg-rose-500",
                    },
                  ].map((feat) => (
                    <div key={feat.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">
                          {feat.label}
                        </span>
                        <span className="text-xs font-mono font-semibold text-foreground">
                          {feat.display}
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${feat.color}`}
                          style={{
                            width: `${featureToPercent(feat.value, feat.max)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stress Indicators */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Stress Indicators
                </p>
                <div className="space-y-1.5">
                  {result.stressIndicators.map((indicator) => (
                    <div
                      key={indicator}
                      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                        result.isStressed
                          ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300"
                          : "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300"
                      }`}
                    >
                      {result.isStressed ? "⚠" : "✓"} {indicator}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset &amp; Analyze Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Stress Management Suggestions ── */}
      {result && !isAnalyzing && (
        <StressManagementSuggestions
          isStressed={result.isStressed}
          method="voice"
          confidence={result.confidence}
        />
      )}
    </div>
  );
}
