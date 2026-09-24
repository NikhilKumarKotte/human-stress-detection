import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ModelMetrics } from "../data/mockMetrics";

interface ModelComparisonChartProps {
  metrics: ModelMetrics[];
}

export default function ModelComparisonChart({
  metrics,
}: ModelComparisonChartProps) {
  const data = [
    {
      metric: "Accuracy",
      "Text Analysis": Math.round(metrics[0].accuracy * 1000) / 10,
      "Facial Expression": Math.round(metrics[1].accuracy * 1000) / 10,
      "Voice Analysis": Math.round(metrics[2].accuracy * 1000) / 10,
    },
    {
      metric: "Precision",
      "Text Analysis": Math.round(metrics[0].precision * 1000) / 10,
      "Facial Expression": Math.round(metrics[1].precision * 1000) / 10,
      "Voice Analysis": Math.round(metrics[2].precision * 1000) / 10,
    },
    {
      metric: "Recall",
      "Text Analysis": Math.round(metrics[0].recall * 1000) / 10,
      "Facial Expression": Math.round(metrics[1].recall * 1000) / 10,
      "Voice Analysis": Math.round(metrics[2].recall * 1000) / 10,
    },
    {
      metric: "F1-Score",
      "Text Analysis": Math.round(metrics[0].f1Score * 1000) / 10,
      "Facial Expression": Math.round(metrics[1].f1Score * 1000) / 10,
      "Voice Analysis": Math.round(metrics[2].f1Score * 1000) / 10,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Model Performance Comparison
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
          <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
          <YAxis
            domain={[70, 100]}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, ""]}
            contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="Text Analysis" fill="#0d9488" radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="Facial Expression"
            fill="#059669"
            radius={[4, 4, 0, 0]}
          />
          <Bar dataKey="Voice Analysis" fill="#0891b2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
