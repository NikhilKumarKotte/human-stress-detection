import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle,
  FlipHorizontal,
  Loader2,
  RotateCcw,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import StressManagementSuggestions from "../components/StressManagementSuggestions";
import { useProcessFacialAnalysis } from "../hooks/useQueries";
import {
  type Emotion,
  type FacialAnalysisResult,
  analyzeFacialExpression,
} from "../utils/facialAnalysis";

/* ─── Constants ─────────────────────────────────────────────────────────── */

const EMOTION_COLORS: Record<Emotion, string> = {
  happy:
    "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300",
  sad: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300",
  angry: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300",
  fearful:
    "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300",
  disgusted:
    "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300",
  surprised: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300",
  neutral:
    "text-muted-foreground bg-muted dark:bg-muted dark:text-muted-foreground",
};

const EMOTION_EMOJIS: Record<Emotion, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  fearful: "😰",
  disgusted: "🤢",
  surprised: "😮",
  neutral: "😐",
};

const STRESS_LEVEL_COLORS = {
  Low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Moderate:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

type InputMode = "upload" | "camera";

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function FacialDetectionPage() {
  const [inputMode, setInputMode] = useState<InputMode>("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<File | Blob | string | null>(
    null,
  );
  const [result, setResult] = useState<FacialAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const facialMutation = useProcessFacialAnalysis();

  /* ── Camera helpers ──────────────────────────────────────────────────── */

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  // Stop camera on unmount
  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  const startCamera = useCallback(
    async (facing: "user" | "environment" = facingMode) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is not supported in this browser.");
        return;
      }
      setCameraLoading(true);
      setCameraError(null);
      stopStream();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing,
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraActive(true);
      } catch (err: unknown) {
        const e = err as { name?: string };
        if (
          e.name === "NotAllowedError" ||
          e.name === "PermissionDeniedError"
        ) {
          setCameraError(
            "Camera permission denied. Please allow camera access in your browser settings and try again.",
          );
        } else if (
          e.name === "NotFoundError" ||
          e.name === "DevicesNotFoundError"
        ) {
          setCameraError("No camera device found on this device.");
        } else {
          setCameraError(
            "Could not start camera. Please check your device and try again.",
          );
        }
      } finally {
        setCameraLoading(false);
      }
    },
    [facingMode, stopStream],
  );

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror front-camera
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setImagePreview(dataUrl);
    setImageSource(dataUrl);
    setResult(null);
    setAnalysisError(null);
    stopStream();
  }, [cameraActive, facingMode, stopStream]);

  const switchCamera = useCallback(async () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    await startCamera(next);
  }, [facingMode, startCamera]);

  /* ── Upload handler ──────────────────────────────────────────────────── */

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setImageSource(file);
    setResult(null);
    setAnalysisError(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setImageSource(file);
    setResult(null);
    setAnalysisError(null);
  };

  /* ── Analysis ────────────────────────────────────────────────────────── */

  const handleAnalyze = async () => {
    if (!imageSource) return;
    setIsAnalyzing(true);
    setResult(null);
    setAnalysisError(null);

    // Brief artificial delay for UX feedback
    await new Promise((r) => setTimeout(r, 800));

    try {
      const analysis = await analyzeFacialExpression(imageSource);
      setResult(analysis);
      try {
        await facialMutation.mutateAsync({
          isStressed: analysis.isStressed,
          confidence: analysis.confidence,
        });
      } catch {
        // Backend error is non-blocking
      }
    } catch {
      setAnalysisError("Analysis failed. Please try a different image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ── Mode switch ─────────────────────────────────────────────────────── */

  const handleModeSwitch = (mode: InputMode) => {
    stopStream();
    setInputMode(mode);
    setImagePreview(null);
    setImageSource(null);
    setResult(null);
    setAnalysisError(null);
    setCameraError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = () => {
    stopStream();
    setImagePreview(null);
    setImageSource(null);
    setResult(null);
    setAnalysisError(null);
    setCameraError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ─── Render ─────────────────────────────────────────────────────────── */

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#000" }}>
              Facial Expression Detection
            </h1>
            <p className="text-sm text-muted-foreground">
              Detect stress from facial expressions using RGB pixel analysis and
              emotion classification
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline steps */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "1. Face Detection",
          "2. RGB Pixel Extraction",
          "3. Emotion Classification",
          "4. Stress Weight Mapping",
          "5. Logistic Regression Output",
        ].map((step) => (
          <span
            key={step}
            className="text-xs px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full font-medium"
          >
            {step}
          </span>
        ))}
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        {(["upload", "camera"] as InputMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            data-ocid={`mode-toggle.${mode}`}
            onClick={() => handleModeSwitch(mode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              inputMode === mode
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {mode === "upload" ? (
              <>
                <Upload className="w-4 h-4" /> Upload Image
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" /> Use Webcam
              </>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Input Panel ──────────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          {inputMode === "upload" ? (
            /* Upload mode */
            <div>
              <input
                ref={fileInputRef}
                id="face-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                data-ocid="upload.file-input"
              />
              {!imagePreview ? (
                <label
                  htmlFor="face-upload"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all"
                  data-ocid="upload.drop-zone"
                >
                  <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    Click or drag image here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP supported
                  </p>
                </label>
              ) : (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Selected face"
                    className="w-full h-64 object-cover rounded-xl border border-border"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="flex-1"
                      data-ocid="upload.change-btn"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Change
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      data-ocid="upload.analyze-btn"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />{" "}
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Expression"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Camera mode */
            <div className="space-y-3">
              {/* Camera / captured preview area */}
              <div
                className="relative rounded-xl overflow-hidden bg-foreground/5"
                style={{ minHeight: "256px" }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                  muted
                  style={{
                    display: cameraActive ? "block" : "none",
                    transform: facingMode === "user" ? "scaleX(-1)" : "none",
                  }}
                />
                <canvas ref={canvasRef} className="hidden" />

                {imagePreview && !cameraActive && (
                  <img
                    src={imagePreview}
                    alt="Captured face"
                    className="w-full h-64 object-cover"
                  />
                )}

                {!cameraActive && !imagePreview && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <Camera className="w-12 h-12 mb-2 opacity-40" />
                    <p className="text-sm opacity-60">Camera preview</p>
                  </div>
                )}
              </div>

              {/* Camera error */}
              {cameraError && (
                <div
                  className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
                  data-ocid="camera.error-msg"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Camera controls */}
              <div className="flex gap-2 flex-wrap">
                {!cameraActive && !imagePreview && (
                  <Button
                    size="sm"
                    onClick={() => startCamera()}
                    disabled={cameraLoading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    data-ocid="camera.start-btn"
                  >
                    {cameraLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />{" "}
                        Starting...
                      </>
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5 mr-1" /> Start Camera
                      </>
                    )}
                  </Button>
                )}

                {cameraActive && (
                  <>
                    <Button
                      size="sm"
                      onClick={capturePhoto}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      data-ocid="camera.capture-btn"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1" /> Capture Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={switchCamera}
                      disabled={cameraLoading}
                      title="Switch camera"
                      data-ocid="camera.switch-btn"
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        stopStream();
                      }}
                      data-ocid="camera.stop-btn"
                    >
                      Stop
                    </Button>
                  </>
                )}

                {imagePreview && !cameraActive && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="flex-1"
                      data-ocid="camera.retake-btn"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retake
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      data-ocid="camera.analyze-btn"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />{" "}
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Expression"
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Result Panel ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Empty state */}
          {!result && !isAnalyzing && !analysisError && (
            <div
              className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]"
              data-ocid="results.empty-state"
            >
              <Camera className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                Upload or capture a photo to see the stress analysis
              </p>
            </div>
          )}

          {/* Loading state */}
          {isAnalyzing && (
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
              <p className="text-sm font-medium text-foreground">
                Analyzing facial expression...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Extracting RGB features and classifying emotions
              </p>
            </div>
          )}

          {/* Error state */}
          {analysisError && !isAnalyzing && (
            <div className="bg-card border border-destructive/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-10 h-10 text-destructive mb-3" />
              <p className="text-sm text-destructive font-medium">
                {analysisError}
              </p>
            </div>
          )}

          {/* Results */}
          {result && !isAnalyzing && (
            <>
              {/* Stress classification card */}
              <div
                className={`rounded-2xl border-2 p-5 ${
                  result.isStressed
                    ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                    : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                }`}
                data-ocid="results.stress-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {result.isStressed ? (
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    <span
                      className={`font-bold text-lg ${
                        result.isStressed
                          ? "text-red-700 dark:text-red-400"
                          : "text-green-700 dark:text-green-400"
                      }`}
                    >
                      {result.isStressed ? "STRESSED" : "NOT STRESSED"}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-2xl font-extrabold ${
                        result.isStressed
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {Math.round(result.confidence * 100)}%
                    </span>
                    <Badge
                      className={`text-xs ${STRESS_LEVEL_COLORS[result.stressLevel]}`}
                    >
                      {result.stressLevel} Stress
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={result.confidence * 100}
                  className={`h-2 ${
                    result.isStressed
                      ? "[&>div]:bg-red-500"
                      : "[&>div]:bg-green-500"
                  }`}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Confidence: {Math.round(result.confidence * 100)}%
                </p>
              </div>

              {/* Dominant emotion card */}
              <div
                className="bg-card border border-border rounded-xl p-4"
                data-ocid="results.emotion-card"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Dominant Emotion
                </p>
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${EMOTION_COLORS[result.dominantEmotion]}`}
                  >
                    <span className="text-xl">
                      {EMOTION_EMOJIS[result.dominantEmotion]}
                    </span>
                    {result.dominantEmotion.charAt(0).toUpperCase() +
                      result.dominantEmotion.slice(1)}
                    <span className="text-xs font-normal opacity-70">
                      ({Math.round(result.emotionConfidence * 100)}%)
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground flex gap-4">
                  <span>
                    Stress weight:{" "}
                    <span className="font-medium text-foreground">
                      {
                        (
                          {
                            angry: "0.92",
                            fearful: "0.88",
                            sad: "0.78",
                            disgusted: "0.72",
                            surprised: "0.45",
                            neutral: "0.35",
                            happy: "0.12",
                          } as Record<string, string>
                        )[result.dominantEmotion]
                      }
                    </span>
                  </span>
                  <span>
                    Stress score:{" "}
                    <span className="font-medium text-foreground">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </span>
                </div>
              </div>

              {/* Emotion distribution */}
              <div
                className="bg-card border border-border rounded-xl p-4"
                data-ocid="results.emotion-distribution"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Emotion Distribution
                </p>
                <div className="space-y-2">
                  {(Object.entries(result.emotionScores) as [Emotion, number][])
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, score]) => (
                      <div key={emotion} className="flex items-center gap-2">
                        <span className="text-sm w-6 text-center">
                          {EMOTION_EMOJIS[emotion]}
                        </span>
                        <span className="text-xs w-16 text-muted-foreground capitalize">
                          {emotion}
                        </span>
                        <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              emotion === result.dominantEmotion
                                ? "bg-emerald-500"
                                : "bg-muted-foreground/30"
                            }`}
                            style={{ width: `${Math.round(score * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-9 text-right">
                          {Math.round(score * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stress Management Suggestions */}
      {result && !isAnalyzing && (
        <StressManagementSuggestions
          isStressed={result.isStressed}
          method="facial"
          confidence={result.confidence}
        />
      )}
    </div>
  );
}
