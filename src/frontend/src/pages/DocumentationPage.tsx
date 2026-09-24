import { BookOpen, Download } from "lucide-react";

export default function DocumentationPage() {
  const handleDownloadPDF = () => {
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        nav, header, .no-print { display: none !important; }
        body { font-size: 12pt; font-family: 'Plus Jakarta Sans', sans-serif; }
        h1 { font-size: 18pt; color: #000 !important; }
        h2 { font-size: 14pt; color: #000 !important; page-break-after: avoid; }
        h3 { font-size: 12pt; color: #000 !important; }
        table { font-size: 10pt; border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; }
        thead { background-color: #f0f0f0 !important; -webkit-print-color-adjust: exact; }
        pre { font-size: 9pt; background: #f5f5f5 !important; border: 1px solid #ddd; padding: 10px; page-break-inside: avoid; -webkit-print-color-adjust: exact; }
        section { page-break-inside: avoid; margin-bottom: 20pt; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; }
        .bg-card { background: white !important; }
        .bg-red-50, .bg-green-50 { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        #documentation-content { max-width: 100%; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">
              Project Documentation
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete technical documentation for the Stress Detection System
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDownloadPDF}
          data-ocid="documentation.download_pdf"
          className="no-print flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl font-semibold text-sm hover:opacity-80 transition-all flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Documentation content */}
      <div id="documentation-content" className="space-y-6">
        {/* 1. Project Overview */}
        <DocSection number="1" title="Project Overview">
          <p className="text-muted-foreground leading-relaxed mb-4">
            <strong className="text-foreground">Stress Detection System</strong>{" "}
            is a multi-modal web application that detects user stress through
            three input methods: written text, facial expressions, and voice
            recordings. It uses simulated machine learning (Logistic Regression)
            to classify stress levels and presents users with confidence scores,
            detected indicators, and personalized stress management suggestions.
          </p>
          <InfoTable
            rows={[
              ["Platform", "Internet Computer Protocol (ICP)"],
              ["Deployment", "Caffeine (ICP-native hosting)"],
              [
                "Academic Context",
                "B.Tech/M.Tech in Computer Science (AI/ML), Biomedical Engineering, or Human-Computer Interaction research",
              ],
              ["ML Algorithm", "Logistic Regression (simulated in TypeScript)"],
              [
                "Research Domains",
                "Healthcare / Mental Health Tech, ML/AI, NLP, Computer Vision, Speech Processing, Affective Computing, Biomedical Informatics",
              ],
            ]}
          />
        </DocSection>

        {/* 2. Technology Stack */}
        <DocSection number="2" title="Technology Stack">
          <InfoTable
            headers={["Layer", "Technology"]}
            rows={[
              ["Frontend", "React 18 + TypeScript + Tailwind CSS"],
              ["Backend", "Motoko (ICP native canister)"],
              ["UI Components", "shadcn/ui component library"],
              ["Build Tool", "Vite"],
              ["Package Manager", "pnpm"],
              ["ML Logic", "Simulated in TypeScript (no Python)"],
              [
                "Fonts",
                "Bricolage Grotesque (headings), Plus Jakarta Sans (body)",
              ],
            ]}
          />
          <Note>
            The Internet Computer does not support Python. All ML inference
            (Logistic Regression, TF-IDF, MFCC, emotion detection) is simulated
            entirely in the frontend using TypeScript heuristics.
          </Note>
        </DocSection>

        {/* 3. Application Pages & Routes */}
        <DocSection number="3" title="Application Pages & Routes">
          <InfoTable
            headers={["Page", "Route", "Description"]}
            rows={[
              [
                "Landing",
                "/",
                "Home page with hero section, method overview, and CTAs",
              ],
              [
                "Text Detection",
                "/text-detection",
                "Analyze written text for stress indicators",
              ],
              [
                "Facial Detection",
                "/facial-detection",
                "Detect stress from a captured or uploaded facial image",
              ],
              [
                "Voice Detection",
                "/voice-detection",
                "Detect stress from a voice recording or uploaded audio",
              ],
              [
                "Evaluation",
                "/evaluation",
                "View simulated ML performance metrics",
              ],
              [
                "Documentation",
                "/documentation",
                "Full project documentation with PDF export",
              ],
            ]}
          />
        </DocSection>

        {/* 4. Backend (Motoko) */}
        <DocSection number="4" title="Backend (Motoko)">
          <p className="text-muted-foreground leading-relaxed mb-4">
            File:{" "}
            <code className="text-primary font-mono text-xs bg-primary/5 px-1.5 py-0.5 rounded">
              src/backend/main.mo
            </code>
            <br />
            The backend actor provides result-processing endpoints. All ML
            computation happens in the frontend; the backend receives and echoes
            results with method metadata.
          </p>
          <SubSection title="Type Definition">
            <CodeBlock>{`StressPrediction {
  stressed  : Bool
  confidence: Float
  method    : Text  // "text" | "facial" | "voice"
}`}</CodeBlock>
          </SubSection>
          <SubSection title="Public Functions">
            <InfoTable
              headers={["Function", "Type", "Description"]}
              rows={[
                [
                  "processTextAnalysisResult(isStressed, confidence)",
                  "update",
                  "Accepts text analysis result, returns StressPrediction",
                ],
                [
                  "processFacialAnalysisResult(isStressed, confidence)",
                  "update",
                  "Accepts facial analysis result, returns StressPrediction",
                ],
                [
                  "processVoiceAnalysisResult(isStressed, confidence)",
                  "update",
                  "Accepts voice analysis result, returns StressPrediction",
                ],
                [
                  "getStressDetectionMethods()",
                  "query",
                  'Returns ["text", "facial", "voice"]',
                ],
              ]}
            />
          </SubSection>
        </DocSection>

        {/* 5. Frontend Architecture */}
        <DocSection number="5" title="Frontend Architecture">
          <SubSection title="Entry Points">
            <InfoTable
              headers={["File", "Purpose"]}
              rows={[
                [
                  "src/main.tsx",
                  "React app bootstrap with QueryClient and providers",
                ],
                ["src/App.tsx", "TanStack Router configuration and route tree"],
                [
                  "src/index.css",
                  "OKLCH design tokens and global Tailwind base styles",
                ],
              ]}
            />
          </SubSection>

          <SubSection title="Pages">
            <InfoTable
              headers={["File", "Purpose"]}
              rows={[
                [
                  "LandingPage.tsx",
                  "Two-column hero with brain image on right, bold title, teal-highlighted subtitle, stacked CTA buttons",
                ],
                [
                  "TextDetectionPage.tsx",
                  "Text input form, keyword extraction, logistic regression classifier, result card",
                ],
                [
                  "FacialDetectionPage.tsx",
                  "Camera capture or image upload, emotion scoring, stress classification",
                ],
                [
                  "VoiceDetectionPage.tsx",
                  "Audio recording, MFCC feature extraction, stress classification",
                ],
                [
                  "EvaluationPage.tsx",
                  "Performance metrics table, confusion matrix, bar chart, cross-validation scores",
                ],
                [
                  "DocumentationPage.tsx",
                  "Full project documentation with browser PDF export",
                ],
              ]}
            />
          </SubSection>

          <SubSection title="Shared Components">
            <InfoTable
              headers={["File", "Purpose"]}
              rows={[
                [
                  "Layout.tsx",
                  "Global navigation header, main content wrapper, and footer",
                ],
                [
                  "StressManagementSuggestions.tsx",
                  'Context-sensitive tips panel (always titled "Stress Management Suggestions")',
                ],
                [
                  "ConfusionMatrix.tsx",
                  "Visual 2×2 confusion matrix component",
                ],
                [
                  "MetricsTable.tsx",
                  "Accuracy, Precision, Recall, F1 table with color badges",
                ],
                [
                  "ModelComparisonChart.tsx",
                  "Recharts bar chart comparing all three models",
                ],
              ]}
            />
          </SubSection>

          <SubSection title="ML Utilities (src/utils/)">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">
                  textPreprocessing.ts
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Removes English stopwords from input text</li>
                  <li>Scores keywords against a weighted stress vocabulary</li>
                  <li>Simulates TF-IDF feature extraction</li>
                  <li>
                    Applies logistic regression decision boundary → returns{" "}
                    <code className="font-mono text-xs">isStressed</code> and{" "}
                    <code className="font-mono text-xs">confidence</code>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">
                  voiceAnalysis.ts — Extracted Audio Features
                </p>
                <InfoTable
                  headers={["Feature", "Method"]}
                  rows={[
                    ["RMS Energy", "Mean square amplitude of channel data"],
                    [
                      "Zero Crossing Rate",
                      "Sign-change count over full signal",
                    ],
                    [
                      "Spectral Centroid",
                      "FFT via OfflineAudioContext, weighted frequency mean",
                    ],
                    [
                      "MFCC Mean",
                      "Log-compressed energy + normalized ZCR (range 0–2)",
                    ],
                    [
                      "Pitch Variance",
                      "Windowed ZCR variance across 512-sample frames",
                    ],
                  ]}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">
                  facialAnalysis.ts
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Loads the image into a canvas (downsampled to 64×64)</li>
                  <li>
                    Extracts RGB pixel statistics as pseudo-features (avgR,
                    avgG, avgB)
                  </li>
                  <li>
                    Maps pixel seed to softmax-normalized scores for 7 emotions:
                    happy, sad, angry, fearful, disgusted, surprised, neutral
                  </li>
                  <li>
                    Applies stress weights per emotion (angry=0.92, happy=0.12)
                    to produce final classification
                  </li>
                </ul>
              </div>
            </div>
          </SubSection>

          <SubSection title="Simulated Performance Metrics (src/data/mockMetrics.ts)">
            <InfoTable
              headers={["Model", "Accuracy", "Precision", "Recall", "F1 Score"]}
              rows={[
                ["Text Analysis", "87.42%", "88.91%", "86.34%", "87.61%"],
                ["Facial Expression", "81.24%", "82.67%", "79.83%", "81.23%"],
                ["Voice Analysis", "84.56%", "86.12%", "83.01%", "84.54%"],
              ]}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Train/test split: 80%/20%. 10-fold cross-validation scores
              included per model.
            </p>
          </SubSection>

          <SubSection title="Hooks (src/hooks/)">
            <InfoTable
              headers={["File", "Purpose"]}
              rows={[
                [
                  "useAudioRecorder.ts",
                  "MediaRecorder wrapper for browser audio capture",
                ],
                ["useActor.ts", "ICP backend actor initialization"],
                ["useQueries.ts", "React Query wrappers for backend calls"],
              ]}
            />
          </SubSection>
        </DocSection>

        {/* 6. ML Algorithm Summary */}
        <DocSection number="6" title="ML Algorithm Summary">
          <p className="text-muted-foreground leading-relaxed mb-4">
            All three detection modules simulate the same pipeline:
          </p>
          <CodeBlock>
            {
              "Input → Feature Extraction → Logistic Regression Classifier → Output"
            }
          </CodeBlock>
          <SubSection title="Logistic Regression Formula">
            <CodeBlock>{`z = w₁·f₁ + w₂·f₂ + ... + wₙ·fₙ + bias

P(stressed) = sigmoid(z) = 1 / (1 + e⁻ᶻ)

Decision: stressed if P(stressed) > 0.5`}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-3">
              Weights and biases are hardcoded in TypeScript. There is no actual
              model training or dataset used — all values are hand-crafted to
              reflect realistic behavior.
            </p>
          </SubSection>
        </DocSection>

        {/* 7. Recommendation System */}
        <DocSection number="7" title="Recommendation System">
          <p className="text-muted-foreground leading-relaxed mb-4">
            After every analysis, the app displays a{" "}
            <strong className="text-foreground">
              "Stress Management Suggestions"
            </strong>{" "}
            section with context-sensitive recommendations:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-black mb-2">
                If Stress Detected
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 4-7-8 Breathing Exercise</li>
                <li>• Physical Activity (10-minute walk)</li>
                <li>• Mindfulness &amp; Grounding (5-4-3-2-1)</li>
                <li>• Rest &amp; Sleep hygiene advice</li>
                <li>• Social Support encouragement</li>
                <li>• Professional Support guidance</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-black mb-2">
                If No Stress Detected
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep It Up — positive reinforcement</li>
                <li>• Preventive Wellness mindfulness tips</li>
                <li>• Sustain Your Balance — habit building</li>
              </ul>
            </div>
          </div>
          <Note>
            The section title is always "Stress Management Suggestions" — never
            changed to "Wellness Maintenance Tips" or any other label.
          </Note>
        </DocSection>

        {/* 8. Design System */}
        <DocSection number="8" title="Design System">
          <InfoTable
            headers={["Element", "Value"]}
            rows={[
              ["Background", "Clean white, no gradients on landing page"],
              ["Accent color", "Deep teal (oklch ~0.55 0.15 185)"],
              ["Headings", "Bricolage Grotesque, black (#000000)"],
              ["Body text", "Plus Jakarta Sans"],
              ["Section titles", "Always black for clarity"],
              [
                "Hero layout",
                "Two-column — title/CTAs on left, brain illustration on right",
              ],
              [
                "CTA buttons",
                '"Get Started" (black filled) + "View ML Metrics" (outlined), stacked vertically',
              ],
              [
                "Color system",
                "OKLCH tokens defined in index.css, mapped to Tailwind semantic classes",
              ],
            ]}
          />
        </DocSection>

        {/* 9. Known Limitations */}
        <DocSection number="9" title="Known Limitations">
          <InfoTable
            headers={["Limitation", "Detail"]}
            rows={[
              [
                "No real ML",
                "All inference is rule-based; no model is trained on real data",
              ],
              [
                "No Python backend",
                "ICP does not support Flask, scikit-learn, NLTK, librosa, or OpenCV",
              ],
              ["No real dataset", "Results do not reflect real-world accuracy"],
              [
                "No persistent history",
                "Stress results are not stored between sessions",
              ],
              [
                "Simulated metrics",
                "Evaluation page numbers are fabricated for academic illustration",
              ],
            ]}
          />
        </DocSection>

        {/* 10. Public Datasets */}
        <DocSection number="10" title="Public Datasets (Reference Only)">
          <p className="text-muted-foreground leading-relaxed mb-4">
            These datasets are{" "}
            <strong className="text-foreground">NOT used</strong> in the app but
            are cited for academic context:
          </p>
          <InfoTable
            headers={["Dataset", "Description"]}
            rows={[
              [
                "WESAD",
                "Wearable Stress and Affect Detection (physiological signals from wearables)",
              ],
              [
                "SWELL-KW",
                "Knowledge work stress from computer interaction behavior data",
              ],
              ["DEAP", "EEG and physiological emotion recognition dataset"],
              ["PSS", "Perceived Stress Scale — self-report survey dataset"],
            ]}
          />
        </DocSection>

        {/* 11. File Structure */}
        <DocSection number="11" title="File Structure Summary">
          <CodeBlock>{`src/
├── backend/
│   └── main.mo                    # Motoko actor (ICP backend)
└── frontend/
    ├── public/assets/             # Generated images (brain, icons, hero)
    └── src/
        ├── App.tsx                # TanStack Router configuration
        ├── main.tsx               # React entry point with providers
        ├── index.css              # Design tokens (OKLCH colors)
        ├── pages/
        │   ├── LandingPage.tsx
        │   ├── TextDetectionPage.tsx
        │   ├── FacialDetectionPage.tsx
        │   ├── VoiceDetectionPage.tsx
        │   ├── EvaluationPage.tsx
        │   └── DocumentationPage.tsx
        ├── components/
        │   ├── Layout.tsx
        │   ├── StressManagementSuggestions.tsx
        │   ├── ConfusionMatrix.tsx
        │   ├── MetricsTable.tsx
        │   └── ModelComparisonChart.tsx
        ├── utils/
        │   ├── textPreprocessing.ts  # TF-IDF simulation
        │   ├── voiceAnalysis.ts      # MFCC simulation
        │   └── facialAnalysis.ts     # Emotion extraction simulation
        ├── data/
        │   └── mockMetrics.ts        # Evaluation metrics
        └── hooks/
            ├── useAudioRecorder.ts   # MediaRecorder wrapper
            └── useQueries.ts         # React Query backend hooks`}</CodeBlock>
        </DocSection>
      </div>

      {/* Persistent print styles */}
      <style>{`
        @media print {
          nav, header, footer, .no-print { display: none !important; }
          .print-content { margin: 0; padding: 0; }
          #documentation-content { page-break-inside: auto; }
          h2 { page-break-after: avoid; }
          section { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function DocSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-semibold text-black mb-3 pb-1 border-b border-border">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoTable({
  headers,
  rows,
}: {
  headers?: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
        {headers && (
          <thead>
            <tr className="bg-muted/50">
              {headers.map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr
              // biome-ignore lint/suspicious/noArrayIndexKey: static table rows
              key={i}
              className={`border-b border-border last:border-0 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}
            >
              {row.map((cell, j) => (
                <td
                  // biome-ignore lint/suspicious/noArrayIndexKey: static table cells
                  key={j}
                  className={`px-4 py-2.5 text-sm ${j === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-muted/50 border border-border rounded-xl p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap leading-relaxed">
      {children}
    </pre>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-3 text-sm text-muted-foreground">
      <strong className="text-foreground">Note:</strong> {children}
    </div>
  );
}
