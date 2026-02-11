import quizBn from "@/data/quiz.bn.json";
import { quizSchema, type QuizData } from "@/lib/quizSchema";

let cached: QuizData | null = null;

export const getQuizData = (): QuizData => {
  if (cached) return cached;
  const parsed = quizSchema.safeParse(quizBn);
  if (!parsed.success) {
    throw new Error("Invalid quiz.bn.json schema");
  }
  cached = parsed.data;
  return parsed.data;
};
