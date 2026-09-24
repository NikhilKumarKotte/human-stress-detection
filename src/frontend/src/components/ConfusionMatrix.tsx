interface ConfusionMatrixProps {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  modelName: string;
}

export default function ConfusionMatrix({
  tp,
  fp,
  fn,
  tn,
  modelName,
}: ConfusionMatrixProps) {
  const total = tp + fp + fn + tn;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Confusion Matrix — {modelName}
      </p>
      <div className="mb-2">
        <div className="flex justify-end gap-1 mb-1">
          <div className="w-24 text-center text-xs font-semibold text-muted-foreground">
            Predicted +
          </div>
          <div className="w-24 text-center text-xs font-semibold text-muted-foreground">
            Predicted −
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <div className="w-16 text-right text-xs font-semibold text-muted-foreground pr-2">
              Actual +
            </div>
            <div className="w-24 h-16 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-lg flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-green-700 dark:text-green-400">
                {tp}
              </span>
              <span className="text-xs text-green-600 dark:text-green-500">
                TP
              </span>
            </div>
            <div className="w-24 h-16 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                {fn}
              </span>
              <span className="text-xs text-red-500">FN</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-16 text-right text-xs font-semibold text-muted-foreground pr-2">
              Actual −
            </div>
            <div className="w-24 h-16 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                {fp}
              </span>
              <span className="text-xs text-red-500">FP</span>
            </div>
            <div className="w-24 h-16 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-lg flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-green-700 dark:text-green-400">
                {tn}
              </span>
              <span className="text-xs text-green-600 dark:text-green-500">
                TN
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="bg-muted/50 rounded-lg p-2">
          <span className="font-semibold text-foreground">Total Samples:</span>{" "}
          {total}
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <span className="font-semibold text-foreground">Correct:</span>{" "}
          {tp + tn} ({Math.round(((tp + tn) / total) * 100)}%)
        </div>
      </div>
    </div>
  );
}
