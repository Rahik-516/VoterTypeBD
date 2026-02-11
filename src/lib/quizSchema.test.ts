import { describe, expect, it } from "vitest";
import quizBn from "@/data/quiz.bn.json";
import { quizSchema } from "@/lib/quizSchema";

describe("quiz data schema", () => {
  it("validates the Bangla quiz data", () => {
    const parsed = quizSchema.safeParse(quizBn);
    expect(parsed.success).toBe(true);
  });
});
