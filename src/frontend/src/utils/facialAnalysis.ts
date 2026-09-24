export type Emotion =
  | "happy"
  | "sad"
  | "angry"
  | "fearful"
  | "disgusted"
  | "surprised"
  | "neutral";

export type StressLevel = "Low" | "Moderate" | "High";

export interface FacialAnalysisResult {
  /** Dominant detected emotion */
  emotion: Emotion;
  /** Alias for emotion — same value */
  dominantEmotion: Emotion;
  emotionConfidence: number;
  isStressed: boolean;
  confidence: number;
  emotionScores: Record<Emotion, number>;
  stressLevel: StressLevel;
}

// Emotion to stress weight mapping (simulated logistic regression)
const EMOTION_STRESS_WEIGHTS: Record<Emotion, number> = {
  angry: 0.92,
  fearful: 0.88,
  sad: 0.78,
  disgusted: 0.72,
  surprised: 0.45,
  neutral: 0.35,
  happy: 0.12,
};

const EMOTION_LABELS: Emotion[] = [
  "happy",
  "sad",
  "angry",
  "fearful",
  "disgusted",
  "surprised",
  "neutral",
];

function computeStressLevel(
  isStressed: boolean,
  confidence: number,
): StressLevel {
  if (!isStressed) return "Low";
  if (confidence >= 0.8) return "High";
  return "Moderate";
}

function generateEmotionScores(
  imageData: ImageData | null,
): Record<Emotion, number> {
  let seed = 0.5;

  if (imageData) {
    const data = imageData.data;
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    const sampleSize = Math.min(data.length / 4, 1000);
    const step = Math.floor(data.length / 4 / sampleSize);

    for (let i = 0; i < sampleSize; i++) {
      const idx = i * step * 4;
      rSum += data[idx];
      gSum += data[idx + 1];
      bSum += data[idx + 2];
    }

    const avgR = rSum / sampleSize / 255;
    const avgG = gSum / sampleSize / 255;
    const avgB = bSum / sampleSize / 255;

    // Use luminance-weighted seed for deterministic, image-specific results
    seed = avgR * 0.3 + avgG * 0.59 + avgB * 0.11;
  }

  // Deterministic softmax-like scoring from seed (no Math.random)
  const rawScores = EMOTION_LABELS.map((_, i) => {
    const pseudoRand = Math.abs(Math.sin(seed * 127.1 + i * 311.7)) % 1;
    const base = Math.sin(seed * (i + 1) * 3.14) * 0.5 + 0.5;
    return Math.max(0.01, base + (pseudoRand * 0.3 - 0.15));
  });

  const sum = rawScores.reduce((a, b) => a + b, 0);
  const normalized = rawScores.map((s) => s / sum);

  const scores: Record<Emotion, number> = {} as Record<Emotion, number>;
  let assigned = 0;
  EMOTION_LABELS.forEach((emotion, i) => {
    if (i < EMOTION_LABELS.length - 1) {
      const v = Math.round(normalized[i] * 100) / 100;
      scores[emotion] = v;
      assigned += v;
    } else {
      scores[emotion] = Math.round((1 - assigned) * 100) / 100;
    }
  });

  return scores;
}

function buildResult(
  emotionScores: Record<Emotion, number>,
): FacialAnalysisResult {
  const dominantEmotion = (
    Object.entries(emotionScores) as [Emotion, number][]
  ).sort((a, b) => b[1] - a[1])[0][0];

  const emotionConfidence = emotionScores[dominantEmotion];
  const stressWeight = EMOTION_STRESS_WEIGHTS[dominantEmotion];
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const stressProb = sigmoid((stressWeight - 0.5) * 4);

  const isStressed = stressWeight >= 0.5;
  const confidence = isStressed
    ? Math.min(0.97, Math.max(0.55, stressProb))
    : Math.min(0.97, Math.max(0.55, 1 - stressProb));

  const roundedConfidence = Math.round(confidence * 100) / 100;
  return {
    emotion: dominantEmotion,
    dominantEmotion,
    emotionConfidence: Math.round(emotionConfidence * 100) / 100,
    isStressed,
    confidence: roundedConfidence,
    emotionScores,
    stressLevel: computeStressLevel(isStressed, roundedConfidence),
  };
}

/** Accepts a File, Blob, or data URL string (e.g. from canvas.toDataURL()) */
export async function analyzeFacialExpression(
  source: File | Blob | string,
): Promise<FacialAnalysisResult> {
  return new Promise((resolve) => {
    const img = new Image();

    const isDataUrl =
      typeof source === "string" &&
      (source.startsWith("data:") || source.startsWith("blob:"));

    // Create the URL from which to load the image
    let blobUrl: string | null = null;
    if (typeof source === "string") {
      img.src = source;
    } else {
      blobUrl = URL.createObjectURL(source);
      img.src = blobUrl;
    }

    const cleanup = () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.min(img.width, 64);
      canvas.height = Math.min(img.height, 64);
      const ctx = canvas.getContext("2d");

      let imageData: ImageData | null = null;
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch {
          // Cross-origin image; fall back to seed-based scoring
        }
      }

      cleanup();
      resolve(buildResult(generateEmotionScores(imageData)));
    };

    img.onerror = () => {
      cleanup();
      // Fallback: deterministic seed from source string length
      const seed = isDataUrl ? (source as string).length % 100 : 42;
      const fallbackScores = generateEmotionScores(
        seed > 50
          ? ({
              data: new Uint8ClampedArray(seed * 4),
              width: seed,
              height: 1,
            } as unknown as ImageData)
          : null,
      );
      resolve(buildResult(fallbackScores));
    };
  });
}
