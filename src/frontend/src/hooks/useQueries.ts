import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import { createActor } from "../backend";

export interface StressPrediction {
  stressed: boolean;
  confidence: number;
  method: string;
}

export function useProcessTextAnalysis() {
  const { actor } = useActor(createActor);

  return useMutation<
    StressPrediction,
    Error,
    { isStressed: boolean; confidence: number }
  >({
    mutationFn: async ({ isStressed, confidence }) => {
      if (!actor) {
        return { stressed: isStressed, confidence, method: "text" };
      }
      try {
        return await actor.processTextAnalysisResult(isStressed, confidence);
      } catch {
        return { stressed: isStressed, confidence, method: "text" };
      }
    },
  });
}

export function useProcessFacialAnalysis() {
  const { actor } = useActor(createActor);

  return useMutation<
    StressPrediction,
    Error,
    { isStressed: boolean; confidence: number }
  >({
    mutationFn: async ({ isStressed, confidence }) => {
      if (!actor) {
        return { stressed: isStressed, confidence, method: "facial" };
      }
      try {
        return await actor.processFacialAnalysisResult(isStressed, confidence);
      } catch {
        return { stressed: isStressed, confidence, method: "facial" };
      }
    },
  });
}

export function useProcessVoiceAnalysis() {
  const { actor } = useActor(createActor);

  return useMutation<
    StressPrediction,
    Error,
    { isStressed: boolean; confidence: number }
  >({
    mutationFn: async ({ isStressed, confidence }) => {
      if (!actor) {
        return { stressed: isStressed, confidence, method: "voice" };
      }
      try {
        return await actor.processVoiceAnalysisResult(isStressed, confidence);
      } catch {
        return { stressed: isStressed, confidence, method: "voice" };
      }
    },
  });
}
