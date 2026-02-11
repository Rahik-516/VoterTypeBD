import type { QuizData } from "@/lib/quizSchema";

export const RESULT_TYPES = [
  "ProcessPro",
  "QueueZen",
  "ConfusionCute",
  "SealSniper",
  "PhoneFreeHero",
  "InfoDetective",
  "PosterNostalgic2",
  "LastMinuteSprinter",
] as const;

export type ResultType = (typeof RESULT_TYPES)[number];
export type AnswerOption = "A" | "B" | "C" | "D";

const QUESTION_WEIGHTS: Record<string, number> = {
  q4: 2,
  q5: 2,
  q6: 2,
};

const SCORE_MAP: Record<string, Record<AnswerOption, ResultType[]>> = {
  q1: {
    A: ["ProcessPro"],
    B: ["InfoDetective"],
    C: ["LastMinuteSprinter", "ConfusionCute"],
    D: ["ConfusionCute"],
  },
  q2: {
    A: ["ProcessPro", "PhoneFreeHero"],
    B: ["InfoDetective"],
    C: ["QueueZen", "PosterNostalgic2"],
    D: ["ConfusionCute", "LastMinuteSprinter"],
  },
  q3: {
    A: ["ProcessPro", "QueueZen"],
    B: ["QueueZen"],
    C: ["LastMinuteSprinter"],
    D: ["ConfusionCute"],
  },
  q4: {
    A: ["ProcessPro", "PhoneFreeHero"],
    B: ["ConfusionCute"],
    C: ["LastMinuteSprinter"],
    D: ["ConfusionCute"],
  },
  q5: {
    A: ["ProcessPro"],
    B: ["QueueZen"],
    C: ["ConfusionCute"],
    D: ["LastMinuteSprinter", "ConfusionCute"],
  },
  q6: {
    A: ["SealSniper", "ProcessPro"],
    B: ["SealSniper", "QueueZen"],
    C: ["ProcessPro"],
    D: ["LastMinuteSprinter", "QueueZen"],
  },
  q7: {
    A: ["ProcessPro", "SealSniper"],
    B: ["ConfusionCute"],
    C: ["ConfusionCute", "PosterNostalgic2"],
    D: ["LastMinuteSprinter"],
  },
  q8: {
    A: ["QueueZen", "ProcessPro"],
    B: ["PosterNostalgic2"],
    C: ["InfoDetective"],
    D: ["ProcessPro", "InfoDetective"],
  },
  q9: {
    A: ["ProcessPro", "QueueZen"],
    B: ["LastMinuteSprinter", "ConfusionCute"],
    C: ["InfoDetective"],
    D: ["PhoneFreeHero", "QueueZen"],
  },
};

export type ScoreBreakdown = {
  total: Record<ResultType, number>;
  q5q6: Record<ResultType, number>;
  q4: Record<ResultType, number>;
};

export const buildEmptyScores = (): Record<ResultType, number> =>
  RESULT_TYPES.reduce((acc, type) => ({ ...acc, [type]: 0 }), {} as Record<ResultType, number>);

export const scoreQuiz = (
  answers: Record<string, AnswerOption>,
  quizData?: QuizData,
): { winner: ResultType; scores: ScoreBreakdown } => {
  if (quizData) {
    const missing = quizData.questions.filter((q) => !answers[q.id]);
    if (missing.length > 0) {
      throw new Error("Incomplete answers provided to scoreQuiz");
    }
  }

  const total = buildEmptyScores();
  const q5q6 = buildEmptyScores();
  const q4 = buildEmptyScores();

  Object.entries(answers).forEach(([questionId, option]) => {
    const targets = SCORE_MAP[questionId]?.[option as AnswerOption] ?? [];
    const weight = QUESTION_WEIGHTS[questionId] ?? 1;

    targets.forEach((type) => {
      total[type] += 1 * weight;
      if (questionId === "q5" || questionId === "q6") {
        q5q6[type] += 1 * weight;
      }
      if (questionId === "q4") {
        q4[type] += 1 * weight;
      }
    });
  });

  const pickWinner = (): ResultType => {
    const sorted = [...RESULT_TYPES].sort((a, b) => {
      if (total[b] !== total[a]) return total[b] - total[a];
      if (q5q6[b] !== q5q6[a]) return q5q6[b] - q5q6[a];
      if (q4[b] !== q4[a]) return q4[b] - q4[a];
      return RESULT_TYPES.indexOf(a) - RESULT_TYPES.indexOf(b);
    });

    return sorted[0];
  };

  return {
    winner: pickWinner(),
    scores: { total, q5q6, q4 },
  };
};
