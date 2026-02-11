import { z } from "zod";

export const quizOptionSchema = z.object({
  id: z.enum(["A", "B", "C", "D"]),
  text: z.string().min(1),
});

export const quizQuestionSchema = z.object({
  id: z.string().min(2),
  text: z.string().min(1),
  options: z.array(quizOptionSchema).length(4),
  factBubble: z.string().min(1),
});

export const quizResultSchema = z.object({
  titleBn: z.string().min(1),
  titleEnTag: z.string().min(1),
  roast1: z.string().min(1),
  roast2: z.string().min(1),
  tip: z.string().min(1),
  nudge: z.string().min(1),
  shareCaptionTemplate: z.string().min(1),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  illustrationVariant: z.enum(["ballots", "stamp", "phone", "map", "shield", "poster", "clock"]),
});

export const quizMetaSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  disclaimer: z.string().min(1),
  shareHashtags: z.array(z.string()).min(1),
});

export const quizSchema = z.object({
  meta: quizMetaSchema,
  questions: z.array(quizQuestionSchema).length(9),
  results: z.record(z.string(), quizResultSchema),
});

export type QuizData = z.infer<typeof quizSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type QuizResult = z.infer<typeof quizResultSchema>;
