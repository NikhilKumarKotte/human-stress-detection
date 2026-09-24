import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileSearch,
  FileText,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import StressManagementSuggestions from "../components/StressManagementSuggestions";
import { useProcessTextAnalysis } from "../hooks/useQueries";
import {
  type ClassificationResult,
  classifyText,
} from "../utils/textPreprocessing";

const STRESSED_SAMPLE =
  "I've been feeling incredibly anxious and overwhelmed lately. The deadlines are piling up and I can't stop worrying about everything. My heart races and I feel completely exhausted and burned out.";

const NOT_STRESSED_SAMPLE =
  "Today was a wonderful and peaceful day. I felt calm and relaxed, enjoying the sunshine and spending time with friends. Everything is going smoothly and I'm feeling happy and content.";

const PIPELINE_STEPS = [
  { label: "Tokenize", desc: "Split text into words" },
  { label: "Lowercase", desc: "Normalize case" },
  { label: "Stopword Removal", desc: "Remove common words" },
  { label: "TF-IDF Scoring", desc: "Weight by frequency" },
  { label: "Logistic Regression", desc: "Sigmoid classification" },
];

export default function TextDetectionPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [showPreprocessing, setShowPreprocessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processTextMutation = useProcessTextAnalysis();

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setShowPreprocessing(false);

    // Simulate processing delay for UX feedback
    await new Promise((r) => setTimeout(r, 900));

    try {
      const classification = classifyText(inputText);
      setResult(classification);

      // Backend call — errors handled silently
      try {
        await processTextMutation.mutateAsync({
          isStressed: classification.isStressed,
          confidence: classification.confidence,
        });
      } catch {
        // Backend unavailable — result still displayed
      }
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setResult(null);
    setShowPreprocessing(false);
    setError(null);
  };

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#000000" }}>
              Text Stress Detection
            </h1>
            <p className="text-sm text-muted-foreground">
              TF-IDF Feature Extraction + Logistic Regression
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed text-sm">
          Enter text to analyze for stress indicators using simulated TF-IDF and
          Logistic Regression. The system extracts weighted keyword features and
          applies a sigmoid decision boundary to classify stress.
        </p>
      </div>

      {/* ML Pipeline Visualization */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <p
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ color: "#000000" }}
        >
          ML Pipeline
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1.5">
              <div className="group relative flex flex-col items-center">
                <span className="text-xs px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-semibold whitespace-nowrap cursor-default hover:bg-primary/20 transition-colors">
                  {step.label}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
                  {step.desc}
                </span>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sample Buttons */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Try a sample
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            data-ocid="text.sample_stressed"
            onClick={() => {
              setInputText(STRESSED_SAMPLE);
              setResult(null);
            }}
            className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            Stressed Sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            data-ocid="text.sample_not_stressed"
            onClick={() => {
              setInputText(NOT_STRESSED_SAMPLE);
              setResult(null);
            }}
            className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
            Not Stressed Sample
          </Button>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
        <label
          htmlFor="text-analysis-input"
          className="block text-sm font-semibold text-foreground mb-2"
        >
          Enter Text for Analysis
        </label>
        <Textarea
          id="text-analysis-input"
          data-ocid="text.textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here... (e.g., 'I am feeling very anxious and overwhelmed with work deadlines...')"
          className="min-h-[200px] resize-y text-sm leading-relaxed"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            {inputText.length} characters · {wordCount} words
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isAnalyzing}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
            <Button
              data-ocid="text.submit_button"
              size="sm"
              onClick={handleAnalyze}
              disabled={!inputText.trim() || isAnalyzing}
              className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-5"
              style={{ backgroundColor: "#000000", color: "#ffffff" }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileSearch className="w-3.5 h-3.5 mr-1.5" />
                  Analyze Text
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center mb-6">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">
            Processing text...
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tokenizing → Stopword removal → TF-IDF scoring → Classification
          </p>
        </div>
      )}

      {/* Result Section */}
      {result && !isAnalyzing && (
        <div className="space-y-4">
          {/* Main Result Card */}
          <div
            data-ocid="text.result_card"
            className={`rounded-2xl border-2 p-6 ${
              result.isStressed
                ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
            }`}
          >
            {/* Result Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                {result.isStressed ? (
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}
                <div>
                  <div
                    className={`text-xs font-bold tracking-widest uppercase mb-1 ${
                      result.isStressed
                        ? "text-red-500 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {result.isStressed ? "STRESSED" : "NOT STRESSED"}
                  </div>
                  <h3
                    className={`text-xl font-bold ${result.isStressed ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"}`}
                  >
                    {result.isStressed
                      ? "Stress Detected"
                      : "No Stress Detected"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Logistic Regression via simulated TF-IDF
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div
                  className={`text-4xl font-extrabold leading-none ${result.isStressed ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                >
                  {Math.round(result.confidence * 100)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Confidence
                </div>
              </div>
            </div>

            {/* Confidence Progress */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Confidence Level</span>
                <span>{Math.round(result.confidence * 100)}%</span>
              </div>
              <Progress
                value={result.confidence * 100}
                className={`h-2.5 ${result.isStressed ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
              />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white/60 dark:bg-card/60 rounded-xl p-3 text-center border border-border/50">
                <div className="text-lg font-bold text-foreground">
                  {wordCount}
                </div>
                <div className="text-xs text-muted-foreground">Words</div>
              </div>
              <div className="bg-white/60 dark:bg-card/60 rounded-xl p-3 text-center border border-border/50">
                <div className="text-lg font-bold text-foreground">
                  {result.preprocessing.tokens.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Tokens (after stopwords)
                </div>
              </div>
              <div className="bg-white/60 dark:bg-card/60 rounded-xl p-3 text-center border border-border/50">
                <div
                  className={`text-lg font-bold ${result.stressScore > 0 ? "text-red-600 dark:text-red-400" : result.stressScore < 0 ? "text-green-600 dark:text-green-400" : "text-foreground"}`}
                >
                  {result.stressScore > 0 ? "+" : ""}
                  {result.stressScore}
                </div>
                <div className="text-xs text-muted-foreground">
                  Stress Score
                </div>
              </div>
            </div>

            {/* Detected Keywords */}
            {result.preprocessing.keywordsFound.length > 0 ? (
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "#000000" }}
                >
                  Detected Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.preprocessing.keywordsFound.map((kw) => {
                    const isStressKw =
                      result.isStressed ||
                      kw.match(
                        /overwhelm|anxi|panic|stress|exhaust|burnout|worried|nervous|pressure/i,
                      );
                    return (
                      <Badge
                        key={kw}
                        variant="outline"
                        className={
                          isStressKw
                            ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                            : "border-border bg-muted text-muted-foreground"
                        }
                      >
                        {kw}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No stress-specific keywords detected in the text.
              </p>
            )}
          </div>

          {/* Feature Extraction Visualization */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-sm font-bold mb-4" style={{ color: "#000000" }}>
              TF-IDF Feature Extraction Process
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Input Text
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {result.preprocessing.original}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Tokenization & Cleaning
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {
                      result.preprocessing.original
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean).length
                    }{" "}
                    raw words → lowercased, punctuation removed
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Stopword Removal
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Removed {result.preprocessing.stopwordsRemoved} common words
                    → {result.preprocessing.tokens.length} meaningful tokens
                    remain
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">4</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    TF-IDF Keyword Matching
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {result.preprocessing.keywordsFound.length} keyword
                    {result.preprocessing.keywordsFound.length !== 1 ? "s" : ""}{" "}
                    matched → weighted stress score:{" "}
                    <span className="font-mono font-semibold">
                      {result.stressScore > 0 ? "+" : ""}
                      {result.stressScore}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">5</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Logistic Regression Output
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    σ(score × 2) ={" "}
                    <span className="font-mono font-semibold">
                      {Math.round(result.confidence * 100)}%
                    </span>{" "}
                    →{" "}
                    <span
                      className={`font-bold ${result.isStressed ? "text-red-600" : "text-green-600"}`}
                    >
                      {result.isStressed ? "STRESSED" : "NOT STRESSED"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preprocessing Details (collapsible) */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPreprocessing(!showPreprocessing)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
              data-ocid="text.toggle_preprocessing"
            >
              <span className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-muted-foreground" />
                Preprocessing Details
              </span>
              {showPreprocessing ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {showPreprocessing && (
              <div className="px-5 pb-5 border-t border-border space-y-4 pt-4">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Original Words",
                      value: result.preprocessing.original
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean).length,
                    },
                    {
                      label: "After Cleaning",
                      value: result.preprocessing.tokens.length,
                    },
                    {
                      label: "Stopwords Removed",
                      value: result.preprocessing.stopwordsRemoved,
                    },
                    {
                      label: "Keywords Matched",
                      value: result.preprocessing.keywordsFound.length,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-muted/50 rounded-xl p-3 text-center"
                    >
                      <div className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cleaned text */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Cleaned Text:
                  </p>
                  <p className="text-xs bg-muted/50 rounded-xl p-3 font-mono text-foreground break-words leading-relaxed">
                    {result.preprocessing.cleaned ||
                      "(empty after preprocessing)"}
                  </p>
                </div>

                {/* Preprocessed tokens */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Tokens after stopword removal (
                    {result.preprocessing.tokens.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.preprocessing.tokens
                      .slice(0, 40)
                      .map((token, i) => {
                        const isKeyword =
                          result.preprocessing.keywordsFound.includes(token);
                        return (
                          <span
                            // biome-ignore lint/suspicious/noArrayIndexKey: static display
                            key={i}
                            className={`text-xs px-2 py-0.5 rounded font-mono ${
                              isKeyword
                                ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                                : "bg-muted text-foreground border border-border"
                            }`}
                          >
                            {token}
                          </span>
                        );
                      })}
                    {result.preprocessing.tokens.length > 40 && (
                      <span className="text-xs text-muted-foreground self-center">
                        +{result.preprocessing.tokens.length - 40} more
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Teal tokens = matched stress keywords
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stress Management Suggestions */}
          <StressManagementSuggestions
            isStressed={result.isStressed}
            method="text"
            confidence={result.confidence}
          />
        </div>
      )}
    </div>
  );
}
