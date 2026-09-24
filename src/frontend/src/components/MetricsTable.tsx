import type { ModelMetrics } from "../data/mockMetrics";

interface MetricsTableProps {
  metrics: ModelMetrics[];
}

function MetricBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 85
      ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
      : pct >= 75
        ? "text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30"
        : "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${color}`}
    >
      {pct}%
    </span>
  );
}

export default function MetricsTable({ metrics }: MetricsTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Model
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Accuracy
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Precision
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Recall
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                F1-Score
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                CV Mean
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => {
              const cvMean =
                m.crossValidationScores.reduce((a, b) => a + b, 0) /
                m.crossValidationScores.length;
              return (
                <tr
                  key={m.name}
                  className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                >
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {m.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <MetricBadge value={m.accuracy} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <MetricBadge value={m.precision} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <MetricBadge value={m.recall} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <MetricBadge value={m.f1Score} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <MetricBadge value={cvMean} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
