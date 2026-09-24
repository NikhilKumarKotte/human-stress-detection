import {
  Brain,
  Dumbbell,
  HeartHandshake,
  Leaf,
  Moon,
  Smile,
  Star,
  Users,
  Wind,
} from "lucide-react";
import type { ElementType } from "react";

interface Suggestion {
  icon: ElementType;
  category: string;
  tip: string;
  color: string;
  iconBg: string;
}

const STRESSED_SUGGESTIONS: Suggestion[] = [
  {
    icon: Wind,
    category: "Breathing Exercise",
    tip: "Try the 4-7-8 technique: inhale for 4 seconds, hold for 7, exhale slowly for 8. Repeat 3–4 times to activate your parasympathetic nervous system.",
    color: "text-blue-600 dark:text-blue-300",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Dumbbell,
    category: "Physical Activity",
    tip: "A 10-minute brisk walk or light stretching can lower cortisol levels significantly. Even standing up and moving around your space helps reset your nervous system.",
    color: "text-emerald-600 dark:text-emerald-300",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: Brain,
    category: "Mindfulness & Grounding",
    tip: "Use the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. This anchors you in the present moment.",
    color: "text-violet-600 dark:text-violet-300",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    icon: Moon,
    category: "Rest & Sleep",
    tip: "Avoid screens 30 minutes before bed. Try keeping a consistent sleep schedule — even on weekends. Quality sleep is the single most effective stress recovery tool.",
    color: "text-indigo-600 dark:text-indigo-300",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    icon: Users,
    category: "Social Support",
    tip: "Share what you're feeling with someone you trust. Social connection is one of the strongest buffers against chronic stress — even a short conversation helps.",
    color: "text-orange-600 dark:text-orange-300",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    icon: HeartHandshake,
    category: "Professional Support",
    tip: "If stress feels persistent or overwhelming, consider speaking with a counselor or mental health professional. Seeking help is a sign of strength, not weakness.",
    color: "text-rose-600 dark:text-rose-300",
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
  },
];

const NOT_STRESSED_SUGGESTIONS: Suggestion[] = [
  {
    icon: Smile,
    category: "Keep It Up",
    tip: "Your current state looks calm and balanced. Maintain this by continuing regular physical activity, good sleep habits, and moments of mindfulness throughout your day.",
    color: "text-green-600 dark:text-green-300",
    iconBg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: Leaf,
    category: "Preventive Wellness",
    tip: "Even when stress-free, short daily mindfulness sessions (5–10 minutes) build resilience so your nervous system handles future stressors more effectively.",
    color: "text-teal-600 dark:text-teal-300",
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
  },
  {
    icon: Star,
    category: "Sustain Your Balance",
    tip: "Journaling, gratitude practices, and regular social connection are proven habits that help maintain low stress over the long term. Consider incorporating one new habit this week.",
    color: "text-amber-600 dark:text-amber-300",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },
];

interface Props {
  isStressed: boolean;
  method: "text" | "facial" | "voice";
  confidence: number;
}

export default function StressManagementSuggestions({
  isStressed,
  confidence,
}: Props) {
  const suggestions = isStressed
    ? STRESSED_SUGGESTIONS
    : NOT_STRESSED_SUGGESTIONS;
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div
      data-ocid="stress-suggestions.panel"
      className={`rounded-2xl border-2 p-6 mt-6 ${
        isStressed
          ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
          : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
      }`}
    >
      {/* Header — title always black per design requirements */}
      <div className="mb-5">
        <h3 className="font-display text-xl font-bold mb-1.5 text-black dark:text-white">
          Stress Management Suggestions
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isStressed
            ? `Stress detected with ${confidencePercent}% confidence. Here are evidence-based strategies to help you feel better:`
            : "No stress detected. Here are tips to maintain your current balanced state:"}
        </p>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list, order never changes
              key={i}
              data-ocid={`stress-suggestions.item.${i + 1}`}
              className="bg-white dark:bg-card border border-border rounded-xl p-4 shadow-xs flex gap-3 hover:shadow-sm transition-shadow"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.iconBg} ${s.color}`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground mb-1">
                  {s.category}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.tip}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {isStressed && (
        <p className="text-xs text-muted-foreground mt-4 text-center italic">
          These suggestions are for informational purposes only and do not
          replace professional medical advice.
        </p>
      )}
    </div>
  );
}
