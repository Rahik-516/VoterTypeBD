"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getQuizData } from "@/lib/quizData";
import { scoreQuiz } from "@/lib/scoring";
import { useQuizStore } from "@/store/quizStore";

const transition = { duration: 0.25, ease: "easeOut" } as const;

export default function QuizPage() {
  const router = useRouter();
  const { questions } = getQuizData();
  const { currentIndex, setIndex, answers, setAnswer, goNext, goBack, setResult, reset } =
    useQuizStore();
  const [confirmReset, setConfirmReset] = React.useState(false);

  React.useEffect(() => {
    if (currentIndex > questions.length - 1) {
      setIndex(questions.length - 1);
    }
  }, [currentIndex, questions.length, setIndex]);

  const currentQuestion = questions[currentIndex];
  const progressValue = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleNext = () => {
    if (!answers[currentQuestion.id]) return;
    if (currentIndex < questions.length - 1) {
      goNext();
      return;
    }

    const { winner } = scoreQuiz(answers, getQuizData());
    setResult(winner);
    router.push(`/result/${encodeURIComponent(winner)}`);
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    goBack();
  };

  const handleReset = () => {
    reset();
    setIndex(0);
    setConfirmReset(false);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
        <Card className="glass rounded-3xl p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>
                {currentIndex + 1}/{questions.length}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
                Reset
              </Button>
            </div>
            <Progress value={progressValue} className="h-2" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={transition}
                className="space-y-5"
              >
                <h2 className="text-xl font-semibold leading-snug md:text-2xl">
                  {currentQuestion.text}
                </h2>
                <RadioGroup
                  value={answers[currentQuestion.id]}
                  onValueChange={(value) =>
                    setAnswer(currentQuestion.id, value as "A" | "B" | "C" | "D")
                  }
                  className="space-y-3"
                  aria-label={`Question ${currentIndex + 1}`}
                >
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/30 bg-white/50 p-4 text-sm text-foreground shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:bg-slate-900/40"
                    >
                      <RadioGroupItem value={option.id} id={`${currentQuestion.id}-${option.id}`} />
                      <span className="leading-relaxed">
                        <span className="font-semibold">{option.id}.</span> {option.text}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
                <div className="rounded-2xl border border-white/40 bg-white/60 px-4 py-3 text-xs text-muted-foreground dark:bg-slate-950/40">
                  {currentQuestion.factBubble}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <Button variant="secondary" onClick={handleBack} disabled={currentIndex === 0}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
                {currentIndex === questions.length - 1 ? "See Result" : "Next"}
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset quiz?</DialogTitle>
            <DialogDescription>Answers will be cleared. You can retake anytime.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button onClick={handleReset}>Yes, reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
