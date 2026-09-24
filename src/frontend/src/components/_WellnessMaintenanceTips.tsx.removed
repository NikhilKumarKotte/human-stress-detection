import { Coffee, Heart, Moon, Scale, Shield, Users, Wind } from "lucide-react";

interface WellnessMaintenanceTipsProps {
  isStressed: boolean;
}

const noStressTips = [
  {
    icon: Heart,
    title: "Keep It Up",
    description:
      "You're doing great! Maintain your positive habits and healthy routines to sustain your mental well-being.",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
  },
  {
    icon: Shield,
    title: "Preventive Wellness",
    description:
      "Stay proactive about your health — regular exercise, balanced nutrition, and mindful practices keep stress at bay.",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-200 dark:border-teal-800",
  },
  {
    icon: Scale,
    title: "Sustain Your Balance",
    description:
      "Life balance is an ongoing practice. Keep nurturing your relationships, hobbies, and personal boundaries.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
  },
];

const stressTips = [
  {
    icon: Coffee,
    title: "Take Short Breaks",
    description:
      "Step away from your screen every 45–60 minutes. Even a 5-minute walk can reset your focus and reduce tension.",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
  },
  {
    icon: Wind,
    title: "Practice Deep Breathing",
    description:
      "Try the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8. Repeat 3–4 times to calm your nervous system.",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-900/20",
    border: "border-sky-200 dark:border-sky-800",
  },
  {
    icon: Moon,
    title: "Maintain Healthy Sleep",
    description:
      "Aim for 7–9 hours of quality sleep. Establish a consistent bedtime routine and avoid screens 30 minutes before bed.",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
  },
  {
    icon: Users,
    title: "Talk with Friends or Family",
    description:
      "Sharing your feelings with trusted people helps lighten the load. Don't hesitate to reach out — connection heals.",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-800",
  },
];

export default function WellnessMaintenanceTips({
  isStressed,
}: WellnessMaintenanceTipsProps) {
  const tips = isStressed ? stressTips : noStressTips;

  return (
    <section
      data-ocid="wellness.section"
      className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${isStressed ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"}`}
        >
          <Heart
            className={`h-5 w-5 ${isStressed ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            Wellness Maintenance Tips
          </h3>
          <p className="text-sm text-muted-foreground">
            {isStressed
              ? "Personalized suggestions to help you manage and reduce stress"
              : "Great news! Here are tips to maintain your current well-being"}
          </p>
        </div>
      </div>

      <div
        className={`grid gap-4 ${isStressed ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
      >
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.title}
              data-ocid={`wellness.item.${index + 1}`}
              className={`rounded-xl border p-4 transition-shadow hover:shadow-md ${tip.bg} ${tip.border}`}
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon className={`h-5 w-5 ${tip.color}`} />
                <h4 className={`font-semibold ${tip.color}`}>{tip.title}</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tip.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
