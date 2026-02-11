"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AnswerOption, ResultType } from "@/lib/scoring";

export type QuizState = {
  answers: Record<string, AnswerOption>;
  currentIndex: number;
  resultType: ResultType | null;
  setAnswer: (questionId: string, option: AnswerOption) => void;
  setResult: (type: ResultType) => void;
  goNext: () => void;
  goBack: () => void;
  reset: () => void;
  setIndex: (index: number) => void;
};

const initialState = {
  answers: {},
  currentIndex: 0,
  resultType: null,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      ...initialState,
      setAnswer: (questionId, option) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: option },
        })),
      setResult: (type) => set(() => ({ resultType: type })),
      goNext: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),
      goBack: () => set((state) => ({ currentIndex: Math.max(0, state.currentIndex - 1) })),
      setIndex: (index) => set(() => ({ currentIndex: index })),
      reset: () => set(() => ({ ...initialState })),
    }),
    {
      name: "voter-type-quiz",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
);

// Clear any legacy localStorage keys from previous versions
if (typeof window !== "undefined") {
  try {
    const legacyKeys = ["voter-type-quiz", "quizAnswers", "quizState"];
    legacyKeys.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    // Silent fail
  }
}
