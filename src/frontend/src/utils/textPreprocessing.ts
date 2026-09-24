const STOPWORDS = new Set([
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "you're",
  "you've",
  "you'll",
  "you'd",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "she's",
  "her",
  "hers",
  "herself",
  "it",
  "it's",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "that'll",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "don't",
  "should",
  "should've",
  "now",
  "d",
  "ll",
  "m",
  "o",
  "re",
  "ve",
  "y",
  "ain",
  "aren",
  "aren't",
  "couldn",
  "couldn't",
  "didn",
  "didn't",
  "doesn",
  "doesn't",
  "hadn",
  "hadn't",
  "hasn",
  "hasn't",
  "haven",
  "haven't",
  "isn",
  "isn't",
  "ma",
  "mightn",
  "mightn't",
  "mustn",
  "mustn't",
  "needn",
  "needn't",
  "shan",
  "shan't",
  "shouldn",
  "shouldn't",
  "wasn",
  "wasn't",
  "weren",
  "weren't",
  "won",
  "won't",
  "wouldn",
  "wouldn't",
]);

// Stress-related keywords with weights
const STRESS_KEYWORDS: Record<string, number> = {
  // High stress indicators
  overwhelmed: 3,
  anxious: 3,
  anxiety: 3,
  panic: 3,
  stressed: 3,
  stress: 3,
  exhausted: 3,
  burnout: 3,
  breakdown: 3,
  desperate: 3,
  hopeless: 3,
  crisis: 3,
  // Medium stress indicators
  worried: 2,
  nervous: 2,
  tense: 2,
  pressure: 2,
  deadline: 2,
  overloaded: 2,
  frustrated: 2,
  angry: 2,
  upset: 2,
  depressed: 2,
  sad: 2,
  tired: 2,
  sleepless: 2,
  insomnia: 2,
  headache: 2,
  crying: 2,
  fear: 2,
  scared: 2,
  // Low stress indicators
  busy: 1,
  difficult: 1,
  hard: 1,
  problem: 1,
  issue: 1,
  trouble: 1,
  concern: 1,
  uncomfortable: 1,
  uneasy: 1,
  restless: 1,
  irritated: 1,
  // Positive / non-stress indicators (negative weights)
  happy: -2,
  calm: -2,
  relaxed: -2,
  peaceful: -2,
  joyful: -2,
  excited: -2,
  great: -1,
  good: -1,
  fine: -1,
  okay: -1,
  well: -1,
  comfortable: -1,
  content: -1,
  satisfied: -1,
  cheerful: -1,
  wonderful: -1,
  amazing: -1,
};

export interface PreprocessingResult {
  original: string;
  cleaned: string;
  tokens: string[];
  stopwordsRemoved: number;
  keywordsFound: string[];
}

export interface ClassificationResult {
  isStressed: boolean;
  confidence: number;
  stressScore: number;
  preprocessing: PreprocessingResult;
}

export function preprocessText(text: string): PreprocessingResult {
  const original = text;

  // Step 1: Lowercase
  let cleaned = text.toLowerCase();

  // Step 2: Remove special characters and punctuation
  cleaned = cleaned.replace(/[^a-z0-9\s]/g, " ");

  // Step 3: Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Step 4: Tokenize
  const allTokens = cleaned.split(" ").filter((t) => t.length > 1);

  // Step 5: Remove stopwords
  const tokens = allTokens.filter((t) => !STOPWORDS.has(t));
  const stopwordsRemoved = allTokens.length - tokens.length;

  // Step 6: Find stress keywords
  const keywordsFound = tokens.filter((t) => STRESS_KEYWORDS[t] !== undefined);

  return {
    original,
    cleaned,
    tokens,
    stopwordsRemoved,
    keywordsFound,
  };
}

export function classifyText(text: string): ClassificationResult {
  const preprocessing = preprocessText(text);
  const { tokens, keywordsFound } = preprocessing;

  if (tokens.length === 0) {
    return {
      isStressed: false,
      confidence: 0.5,
      stressScore: 0,
      preprocessing,
    };
  }

  // Simulate TF-IDF weighted scoring
  let rawScore = 0;
  for (const token of tokens) {
    const weight = STRESS_KEYWORDS[token] ?? 0;
    // TF component: term frequency in document
    const tf = tokens.filter((t) => t === token).length / tokens.length;
    // IDF component: simulated inverse document frequency
    const idf =
      Math.abs(weight) > 0 ? 1 + Math.log(10 / (Math.abs(weight) + 1)) : 0;
    rawScore += weight * tf * idf;
  }

  // Normalize score using sigmoid function (logistic regression output)
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const normalizedScore = sigmoid(rawScore * 2);

  // Add some variance based on text length and keyword density
  const keywordDensity = keywordsFound.length / Math.max(tokens.length, 1);
  const densityBonus = keywordDensity * 0.15;

  let confidence = Math.min(
    0.98,
    Math.max(0.52, normalizedScore + densityBonus),
  );

  // Determine stress classification
  const isStressed = confidence > 0.5 && rawScore > 0;

  // Adjust confidence to be relative to the prediction
  if (!isStressed) {
    confidence = 1 - confidence;
    confidence = Math.min(0.97, Math.max(0.53, confidence));
  }

  return {
    isStressed,
    confidence: Math.round(confidence * 100) / 100,
    stressScore: Math.round(rawScore * 100) / 100,
    preprocessing,
  };
}
