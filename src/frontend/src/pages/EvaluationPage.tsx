import { Badge } from "@/components/ui/badge";
import { BarChart3, Brain, Info, Mic, TrendingUp } from "lucide-react";
import ConfusionMatrix from "../components/ConfusionMatrix";
import MetricsTable from "../components/MetricsTable";
import ModelComparisonChart from "../components/ModelComparisonChart";
import { MODEL_METRICS } from "../data/mockMetrics";

const OVERVIEW_STATS = [
  {
    label: "Best Accuracy",
    value: "87.42%",
    sub: "Text Analysis",
    icon: TrendingUp,
  },
  {
    label: "Best F1 Score",
    value: "87.61%",
    sub: "Text Analysis",
    icon: BarChart3,
  },
  {
    label: "Models Evaluated",
    value: "3",
    sub: "Text · Facial · Voice",
    icon: Brain,
  },
  {
    label: "Features Analyzed",
    value: "15+",
    sub: "Cross-modal features",
    icon: Mic,
  },
];

const ALGORITHM_DETAILS = [
  { label: "Algorithm", value: "Logistic Regression" },
  {
    label: "Feature Extraction",
    value: "TF-IDF (Text), RGB Analysis (Facial), MFCC (Voice)",
  },
  { label: "Decision Boundary", value: "0.5 (sigmoid output)" },
  { label: "Training Split", value: "80% / 20%" },
  { label: "Validation", value: "10-fold cross-validation" },
  { label: "Dataset", value: "Simulated (rule-based)" },
];

function cvScoreColor(score: number) {
  const pct = score * 100;
  if (pct >= 85)
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (pct >= 80)
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
}

export default function EvaluationPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#000" }}>
              Model Evaluation
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          Performance metrics for the simulated Logistic Regression models
          across all detection modalities
        </p>
      </div>

      {/* Overview Stats Row */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        data-ocid="overview-stats"
      >
        {OVERVIEW_STATS.map(({ label, value, sub, icon: Icon }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-xl p-5 shadow-sm card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {label}
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {value}
            </div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        ))}
      </div>

      {/* Metrics Table Section */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4" style={{ color: "#000" }}>
          Model Performance Comparison
        </h2>
        <MetricsTable metrics={MODEL_METRICS} />
      </section>

      {/* Visual Comparison Chart */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4" style={{ color: "#000" }}>
          Visual Comparison
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <ModelComparisonChart metrics={MODEL_METRICS} />
        </div>
      </section>

      {/* Confusion Matrices Section */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4" style={{ color: "#000" }}>
          Confusion Matrices
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          data-ocid="confusion-matrices"
        >
          {MODEL_METRICS.map((m) => (
            <ConfusionMatrix
              key={m.name}
              modelName={m.name}
              tp={m.confusionMatrix.tp}
              fp={m.confusionMatrix.fp}
              fn={m.confusionMatrix.fn}
              tn={m.confusionMatrix.tn}
            />
          ))}
        </div>
      </section>

      {/* Cross-Validation Scores Section */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4" style={{ color: "#000" }}>
          10-Fold Cross-Validation
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          data-ocid="cv-scores"
        >
          {MODEL_METRICS.map((m) => {
            const mean =
              m.crossValidationScores.reduce((a, b) => a + b, 0) /
              m.crossValidationScores.length;
            const std = Math.sqrt(
              m.crossValidationScores.reduce((a, b) => a + (b - mean) ** 2, 0) /
                m.crossValidationScores.length,
            );
            return (
              <div
                key={m.name}
                className="bg-card border border-border rounded-xl p-5 shadow-sm"
              >
                <h4 className="text-sm font-bold text-foreground mb-4">
                  {m.name}
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.crossValidationScores.map((score, i) => (
                    <Badge
                      key={`fold-${i + 1}`}
                      variant="secondary"
                      className={`text-xs font-mono ${cvScoreColor(score)}`}
                    >
                      {(score * 100).toFixed(1)}%
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg px-3 py-2 text-center">
                    <div className="text-xs text-muted-foreground mb-0.5">
                      Mean CV
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {(mean * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg px-3 py-2 text-center">
                    <div className="text-xs text-muted-foreground mb-0.5">
                      Std Dev
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      ±{(std * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Algorithm Details Section */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4" style={{ color: "#000" }}>
          Algorithm Details
        </h2>
        <div
          className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
          data-ocid="algorithm-details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {ALGORITHM_DETAILS.map(({ label, value }, i) => (
              <div
                key={label}
                className={`p-5 ${i < ALGORITHM_DETAILS.length - 1 ? "border-b border-border md:border-b md:border-r" : ""} ${i % 2 === 0 && i < ALGORITHM_DETAILS.length - 2 ? "" : ""}`}
              >
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  {label}
                </div>
                <div className="text-sm font-semibold text-foreground leading-relaxed">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Note */}
      <div
        className="flex gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4"
        data-ocid="simulation-note"
      >
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Note:</strong> All metrics are
          simulated for academic demonstration purposes. No real training or
          inference occurs — the system uses rule-based heuristics to simulate
          ML behavior.
        </p>
      </div>
    </div>
  );
}
