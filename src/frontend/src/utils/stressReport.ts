export function getStressLevel(
  confidence: number,
  isStressed: boolean,
): "Low" | "Medium" | "High" {
  if (!isStressed) return "Low";
  if (confidence < 0.7) return "Medium";
  return "High";
}

export function getPossibleCauses(
  method: string,
  stressLevel: string,
): string[] {
  if (stressLevel === "High") {
    if (method === "voice")
      return [
        "Work pressure",
        "Mental fatigue",
        "Emotional stress",
        "Sleep deprivation",
      ];
    if (method === "facial")
      return [
        "Emotional stress",
        "Anxiety or fear",
        "Work pressure",
        "Interpersonal conflicts",
      ];
    return [
      "Work pressure",
      "Mental fatigue",
      "Emotional stress",
      "Sleep deprivation",
    ];
  }
  if (stressLevel === "Medium") {
    return [
      "Mild work overload",
      "Time pressure",
      "Minor anxieties",
      "Lack of adequate rest",
    ];
  }
  return [
    "Calm and balanced state",
    "Well-rested and energized",
    "Healthy daily routine",
  ];
}

export function getRecommendedActions(stressLevel: string): string[] {
  if (stressLevel === "High") {
    return [
      "Take a short break immediately",
      "Practice deep breathing exercises",
      "Talk with friends or family",
      "Get adequate sleep tonight",
      "Exercise regularly to release tension",
    ];
  }
  if (stressLevel === "Medium") {
    return [
      "Take short breaks during work",
      "Try mindfulness meditation for 10 minutes",
      "Go for a brisk walk outside",
      "Listen to calming music",
    ];
  }
  return [
    "Maintain your healthy routine",
    "Keep up regular exercise habits",
    "Continue mindfulness practices",
  ];
}
