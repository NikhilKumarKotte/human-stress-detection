import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StressPrediction {
    method: string;
    stressed: boolean;
    confidence: number;
}
export interface backendInterface {
    getStressDetectionMethods(): Promise<Array<string>>;
    processFacialAnalysisResult(isStressed: boolean, confidence: number): Promise<StressPrediction>;
    processTextAnalysisResult(isStressed: boolean, confidence: number): Promise<StressPrediction>;
    processVoiceAnalysisResult(isStressed: boolean, confidence: number): Promise<StressPrediction>;
}
