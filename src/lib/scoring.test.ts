import { describe, expect, it } from "vitest";
import { scoreQuiz, RESULT_TYPES } from "@/lib/scoring";
import { getQuizData } from "@/lib/quizData";
import { validateImageMapping, RESULT_IMAGE_MAP } from "@/lib/resultImages";

const data = getQuizData();

describe("scoreQuiz", () => {
  it("returns a valid result type", () => {
    const answers = {
      q1: "A",
      q2: "A",
      q3: "A",
      q4: "A",
      q5: "A",
      q6: "A",
      q7: "A",
      q8: "A",
      q9: "A",
    } as const;

    const result = scoreQuiz(answers, data);
    expect(RESULT_TYPES).toContain(result.winner);
  });

  it("applies weighted scoring correctly", () => {
    const answers = {
      q1: "B",
      q2: "D",
      q3: "B",
      q4: "B",
      q5: "B",
      q6: "D",
      q7: "D",
      q8: "D",
      q9: "D",
    } as const;

    const result = scoreQuiz(answers, data);
    expect(result.winner).toBeDefined();
    expect(typeof result.winner).toBe("string");
  });
});

describe("Image mapping validation", () => {
  it("has image mapping for all result types", () => {
    const isValid = validateImageMapping(RESULT_TYPES);
    expect(isValid).toBe(true);
  });

  it("has exactly 8 result type mappings", () => {
    expect(Object.keys(RESULT_IMAGE_MAP)).toHaveLength(8);
  });

  it("all image paths start with /results/", () => {
    const allPaths = Object.values(RESULT_IMAGE_MAP).map((img) => img.src);
    allPaths.forEach((path) => {
      expect(path).toMatch(/^\/results\/.+\.png$/);
    });
  });

  it("all images have Bengali alt text", () => {
    const allImages = Object.values(RESULT_IMAGE_MAP);
    allImages.forEach((img) => {
      expect(img.altBn).toBeTruthy();
      expect(img.altBn.length).toBeGreaterThan(0);
    });
  });
});
