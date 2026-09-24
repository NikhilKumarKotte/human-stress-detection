export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
  };
  crossValidationScores: number[];
  trainTestSplit: { train: number; test: number };
}

export const MODEL_METRICS: ModelMetrics[] = [
  {
    name: "Text Analysis",
    accuracy: 0.8742,
    precision: 0.8891,
    recall: 0.8634,
    f1Score: 0.8761,
    confusionMatrix: { tp: 145, fp: 18, fn: 20, tn: 117 },
    crossValidationScores: [
      0.861, 0.883, 0.87, 0.868, 0.881, 0.874, 0.869, 0.876, 0.88, 0.865,
    ],
    trainTestSplit: { train: 80, test: 20 },
  },
  {
    name: "Facial Expression",
    accuracy: 0.8124,
    precision: 0.8267,
    recall: 0.7983,
    f1Score: 0.8123,
    confusionMatrix: { tp: 132, fp: 27, fn: 32, tn: 109 },
    crossValidationScores: [
      0.801, 0.815, 0.82, 0.798, 0.813, 0.809, 0.818, 0.821, 0.805, 0.81,
    ],
    trainTestSplit: { train: 80, test: 20 },
  },
  {
    name: "Voice Analysis",
    accuracy: 0.8456,
    precision: 0.8612,
    recall: 0.8301,
    f1Score: 0.8454,
    confusionMatrix: { tp: 139, fp: 22, fn: 28, tn: 111 },
    crossValidationScores: [
      0.835, 0.848, 0.851, 0.839, 0.843, 0.85, 0.842, 0.838, 0.849, 0.851,
    ],
    trainTestSplit: { train: 80, test: 20 },
  },
];

export const CHART_COLORS = {
  text: "#0d9488",
  facial: "#059669",
  voice: "#0891b2",
};
