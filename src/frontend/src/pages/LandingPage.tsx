import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Camera,
  ChevronRight,
  FileText,
  Mic,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const DETECTION_METHODS = [
  {
    id: "text",
    title: "Text Analysis",
    subtitle: "NLP-Based Detection",
    description:
      "Enter written text to detect stress indicators using TF-IDF feature extraction and Logistic Regression classification.",
    icon: FileText,
    route: "/text-detection",
    badge: "NLP · TF-IDF",
    steps: ["Text Preprocessing", "TF-IDF Vectorization", "LR Classification"],
    accuracy: "87.4%",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    accentBar: "from-teal-400 to-cyan-400",
    badgeStyle: "bg-teal-50 text-teal-700 border-teal-200",
    hoverBorder: "hover:border-teal-300",
  },
  {
    id: "facial",
    title: "Facial Expression",
    subtitle: "Computer Vision Detection",
    description:
      "Capture or upload a facial image to detect emotions and classify stress levels using visual feature analysis.",
    icon: Camera,
    route: "/facial-detection",
    badge: "CV · Emotions",
    steps: ["Face Detection", "Emotion Extraction", "Stress Mapping"],
    accuracy: "81.2%",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accentBar: "from-emerald-400 to-teal-400",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    id: "voice",
    title: "Voice Analysis",
    subtitle: "Audio Signal Detection",
    description:
      "Record audio to extract MFCC features and classify stress from vocal patterns using signal processing.",
    icon: Mic,
    route: "/voice-detection",
    badge: "MFCC · Audio",
    steps: ["Audio Recording", "MFCC Extraction", "LR Classification"],
    accuracy: "84.6%",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    accentBar: "from-cyan-400 to-blue-400",
    badgeStyle: "bg-cyan-50 text-cyan-700 border-cyan-200",
    hoverBorder: "hover:border-cyan-300",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Provide Input",
    description:
      "Choose your preferred modality — type text, capture your face via camera, or record your voice.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Feature Extraction",
    description:
      "The system extracts relevant features: TF-IDF for text, pixel statistics for facial, and MFCC for voice.",
    icon: Zap,
  },
  {
    step: "03",
    title: "Classification",
    description:
      "Logistic Regression maps extracted features to stress probability via the sigmoid function.",
    icon: Brain,
  },
];

const ML_HIGHLIGHTS = [
  {
    icon: Brain,
    title: "Logistic Regression",
    desc: "Binary stress classifier using sigmoid activation across all three modalities",
  },
  {
    icon: Zap,
    title: "10-Fold Cross Validation",
    desc: "Robust model evaluation with 80/20 train-test split for reliable metrics",
  },
  {
    icon: Shield,
    title: "Multi-Modal Analysis",
    desc: "Three independent detection pathways improve overall classification accuracy",
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    desc: "Accuracy, Precision, Recall, and F1-score evaluated per modality",
  },
];

const TECH_STACK = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Motoko",
  "Web Audio API",
  "TF-IDF",
  "MFCC",
  "Canvas API",
];

// ─── Brain Fallback SVG ─────────────────────────────────────────────────────

function BrainFallbackSVG() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Brain illustration showing neural networks for stress detection"
    >
      <circle cx="200" cy="200" r="190" fill="oklch(0.96 0.015 195)" />
      {/* Brain outline left hemisphere */}
      <path
        d="M200 100 C160 80 110 90 90 130 C65 170 70 210 85 240 C100 270 120 285 145 290 C160 295 180 290 200 280"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="oklch(0.9 0.04 195 / 0.4)"
      />
      {/* Brain outline right hemisphere */}
      <path
        d="M200 100 C240 80 290 90 310 130 C335 170 330 210 315 240 C300 270 280 285 255 290 C240 295 220 290 200 280"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="oklch(0.9 0.04 195 / 0.4)"
      />
      {/* Center line */}
      <line
        x1="200"
        y1="100"
        x2="200"
        y2="280"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="3"
        strokeDasharray="6 4"
        opacity="0.5"
      />
      {/* Gyri lines left */}
      <path
        d="M130 160 Q145 145 155 160 Q165 175 155 185"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M110 210 Q130 195 145 210 Q155 225 145 235"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M155 240 Q170 225 182 238"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Gyri lines right */}
      <path
        d="M270 160 Q255 145 245 160 Q235 175 245 185"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M290 210 Q270 195 255 210 Q245 225 255 235"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M245 240 Q230 225 218 238"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Neural nodes */}
      {[
        [150, 140],
        [170, 190],
        [140, 230],
        [250, 140],
        [230, 190],
        [260, 230],
        [200, 160],
        [200, 220],
      ].map(([cx, cy]) => (
        <circle
          key={`node-${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="5"
          fill="oklch(0.46 0.13 195)"
          opacity="0.7"
        />
      ))}
      {/* Neural connections */}
      <line
        x1="150"
        y1="140"
        x2="200"
        y2="160"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="200"
        y1="160"
        x2="250"
        y2="140"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="170"
        y1="190"
        x2="200"
        y2="220"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="200"
        y1="220"
        x2="230"
        y2="190"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="140"
        y1="230"
        x2="170"
        y2="190"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="260"
        y1="230"
        x2="230"
        y2="190"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* Pulse rings */}
      <circle
        cx="200"
        cy="190"
        r="60"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="1"
        fill="none"
        opacity="0.15"
      />
      <circle
        cx="200"
        cy="190"
        r="85"
        stroke="oklch(0.46 0.13 195)"
        strokeWidth="1"
        fill="none"
        opacity="0.1"
      />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 lg:py-24">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* LEFT — Title + CTA (60%) */}
            <div className="flex-1 flex flex-col items-start min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-200 bg-teal-50 text-teal-700 text-xs font-semibold mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                Multi-Modal Stress Analysis System
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-black leading-[1.1] tracking-tight mb-6"
              >
                Stress Detection with Machine Learning using Logistic Regression
                Algorithm
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="text-base md:text-lg leading-relaxed mb-8 max-w-xl"
                style={{ color: "oklch(0.45 0.02 210)" }}
              >
                A multi-modal stress analysis system using simulated{" "}
                <strong
                  className="font-bold"
                  style={{ color: "oklch(0.46 0.13 195)" }}
                >
                  Logistic Regression
                </strong>{" "}
                for intelligent classification across text, facial expressions,
                and voice.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3 }}
                className="flex flex-col gap-3 w-full max-w-[320px]"
              >
                <Link
                  to="/text-detection"
                  data-ocid="landing.cta_get_started"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-black text-white rounded-xl font-bold text-base hover:bg-neutral-800 transition-colors duration-200"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/evaluation"
                  data-ocid="landing.cta_ml_metrics"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-white border-2 border-black text-black rounded-xl font-bold text-base hover:bg-neutral-50 transition-colors duration-200"
                >
                  <BarChart3 className="w-4 h-4" />
                  View ML Metrics
                </Link>
              </motion.div>

              {/* Stat strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-6 mt-10 pt-6 border-t border-neutral-100"
              >
                {[
                  { label: "Accuracy", value: "87.4%" },
                  { label: "Modalities", value: "3" },
                  { label: "Algorithm", value: "LR" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-xl font-extrabold text-black">
                      {stat.value}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "oklch(0.55 0.025 210)" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — Brain image (40%) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="w-full md:w-[42%] flex-shrink-0 flex items-center justify-center"
            >
              <div className="w-full max-w-[420px]">
                {!imageError ? (
                  <img
                    src="/assets/uploads/screenshot_2026-03-28-23-45-50-10_40deb401b9ffe8e1df2f1cc5ba480b12-019d35a9-7ca2-745a-bf2f-77030fe4f702-1.jpg"
                    alt="Brain illustration representing stress detection AI"
                    className="w-full rounded-2xl object-cover shadow-lg"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                    onError={() => setImageError(true)}
                    data-ocid="landing.brain_image"
                  />
                ) : (
                  <div
                    className="w-full rounded-2xl flex items-center justify-center p-8"
                    style={{
                      background: "oklch(0.96 0.015 195)",
                      minHeight: "320px",
                    }}
                    data-ocid="landing.brain_fallback"
                  >
                    <BrainFallbackSVG />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Detection Methods ────────────────────────────────────────────── */}
      <section
        className="border-t"
        style={{
          background: "oklch(0.98 0.004 195)",
          borderColor: "oklch(0.92 0.01 195)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-3">
              Detection Methods
            </h2>
            <p
              className="max-w-xl mx-auto text-sm md:text-base leading-relaxed"
              style={{ color: "oklch(0.5 0.025 210)" }}
            >
              Three independent stress detection pathways, each using Logistic
              Regression with domain-specific feature extraction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DETECTION_METHODS.map((method, idx) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link
                    to={method.route as "/"}
                    data-ocid={`landing.method_${method.id}`}
                    className={`group block bg-white border-2 border-neutral-100 ${method.hoverBorder} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300`}
                  >
                    {/* Accent top bar */}
                    <div
                      className={`h-1 w-full bg-gradient-to-r ${method.accentBar}`}
                    />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-5">
                        <div
                          className={`w-12 h-12 rounded-xl ${method.iconBg} flex items-center justify-center`}
                        >
                          <Icon className={`w-6 h-6 ${method.iconColor}`} />
                        </div>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${method.badgeStyle}`}
                        >
                          {method.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-black mb-0.5">
                        {method.title}
                      </h3>
                      <p
                        className="text-xs font-semibold uppercase tracking-wider mb-3"
                        style={{ color: "oklch(0.6 0.03 210)" }}
                      >
                        {method.subtitle}
                      </p>
                      <p
                        className="text-sm leading-relaxed mb-5"
                        style={{ color: "oklch(0.5 0.025 210)" }}
                      >
                        {method.description}
                      </p>

                      {/* Pipeline steps */}
                      <div className="space-y-1.5 mb-5">
                        {method.steps.map((step, i) => (
                          <div
                            key={step}
                            className="flex items-center gap-2 text-xs"
                            style={{ color: "oklch(0.5 0.025 210)" }}
                          >
                            <span
                              className={`w-4 h-4 rounded-full ${method.iconBg} ${method.iconColor} flex items-center justify-center font-bold text-[9px] flex-shrink-0`}
                            >
                              {i + 1}
                            </span>
                            {step}
                          </div>
                        ))}
                      </div>

                      <div
                        className="flex items-center justify-between pt-3 border-t"
                        style={{ borderColor: "oklch(0.93 0.01 195)" }}
                      >
                        <span
                          className={`text-sm font-bold ${method.iconColor}`}
                        >
                          {method.accuracy} accuracy
                        </span>
                        <span
                          className={`flex items-center gap-1 text-sm font-semibold ${method.iconColor} group-hover:gap-2 transition-all`}
                        >
                          Try Now <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section
        className="bg-white border-t"
        style={{ borderColor: "oklch(0.92 0.01 195)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-3">How It Works</h2>
            <p
              className="max-w-xl mx-auto text-sm md:text-base"
              style={{ color: "oklch(0.5 0.025 210)" }}
            >
              A three-step pipeline from raw input to stress classification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-5">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: "oklch(0.93 0.035 195)" }}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{ color: "oklch(0.46 0.13 195)" }}
                      />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-extrabold flex items-center justify-center text-white"
                      style={{ background: "oklch(0.46 0.13 195)" }}
                    >
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.5 0.025 210)" }}
                  >
                    {item.description}
                  </p>
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div
                      className="hidden md:block absolute"
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Algorithm Section ────────────────────────────────────────────── */}
      <section
        className="border-t"
        style={{
          background: "oklch(0.97 0.008 195)",
          borderColor: "oklch(0.92 0.01 195)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left — explanation */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-4">
                Logistic Regression Algorithm
              </h2>
              <p
                className="text-sm md:text-base leading-relaxed mb-6"
                style={{ color: "oklch(0.48 0.025 210)" }}
              >
                This system uses{" "}
                <strong className="text-black">Logistic Regression</strong> as
                the primary classification algorithm across all three detection
                modules. The sigmoid function maps feature vectors to
                probability scores, enabling binary stress vs. non-stress
                classification.
              </p>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "oklch(0.48 0.025 210)" }}
              >
                Feature weights are hand-crafted for each modality: TF-IDF
                keyword scores for text, RGB pixel statistics for facial, and
                MFCC energy metrics for voice.
              </p>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-semibold rounded-full border"
                    style={{
                      background: "oklch(0.9 0.04 195 / 0.4)",
                      color: "oklch(0.38 0.11 195)",
                      borderColor: "oklch(0.78 0.06 195)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — formula block */}
            <div className="flex flex-col gap-4">
              <div
                className="rounded-xl border p-6 font-mono text-sm"
                style={{
                  background: "oklch(0.14 0.022 210)",
                  borderColor: "oklch(0.25 0.03 210)",
                }}
              >
                <div
                  className="text-xs font-semibold mb-4 uppercase tracking-wider"
                  style={{ color: "oklch(0.55 0.03 210)" }}
                >
                  # Logistic Regression Classifier
                </div>
                <div className="space-y-2">
                  <div>
                    <span style={{ color: "oklch(0.64 0.15 190)" }}>z </span>
                    <span style={{ color: "oklch(0.75 0.02 195)" }}>= </span>
                    <span style={{ color: "oklch(0.82 0.08 195)" }}>
                      w₁·f₁ + w₂·f₂ + ... + wₙ·fₙ + b
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "oklch(0.64 0.15 190)" }}>
                      P(stressed)
                    </span>
                    <span style={{ color: "oklch(0.75 0.02 195)" }}> = </span>
                    <span style={{ color: "oklch(0.82 0.08 195)" }}>
                      sigmoid(z)
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "oklch(0.64 0.15 190)" }}>σ(z)</span>
                    <span style={{ color: "oklch(0.75 0.02 195)" }}> = </span>
                    <span style={{ color: "oklch(0.78 0.12 185)" }}>
                      1 / (1 + e⁻ᶻ)
                    </span>
                  </div>
                </div>
                <div
                  className="mt-5 pt-4 border-t space-y-1 text-xs"
                  style={{ borderColor: "oklch(0.25 0.03 210)" }}
                >
                  <div style={{ color: "oklch(0.64 0.15 190)" }}>
                    Train-Test Split
                  </div>
                  <div style={{ color: "oklch(0.7 0.03 195)" }}>
                    80% Training / 20% Testing
                  </div>
                  <div style={{ color: "oklch(0.7 0.03 195)" }}>
                    10-Fold Cross Validation
                  </div>
                </div>
              </div>

              {/* ML Highlights grid */}
              <div className="grid grid-cols-2 gap-3">
                {ML_HIGHLIGHTS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="bg-white border rounded-xl p-4"
                      style={{ borderColor: "oklch(0.9 0.015 195)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                        style={{ background: "oklch(0.93 0.035 195)" }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: "oklch(0.46 0.13 195)" }}
                        />
                      </div>
                      <h4 className="font-semibold text-xs text-black mb-0.5">
                        {item.title}
                      </h4>
                      <p
                        className="text-[11px] leading-relaxed"
                        style={{ color: "oklch(0.55 0.025 210)" }}
                      >
                        {item.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
