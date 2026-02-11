import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getQuizData } from "@/lib/quizData";

export default function Home() {
  const { meta } = getQuizData();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-14 md:py-20">
        <Card className="glass w-full rounded-3xl p-8 md:p-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full border border-white/40 px-3 py-1 text-xs font-medium uppercase tracking-wide">
                Gen‑Z friendly
              </span>
              <span>Bangla + Banglish mix</span>
            </div>
            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">{meta.title}</h1>
            <p className="text-base text-muted-foreground md:text-lg">{meta.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/quiz">Start Quiz</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-full">
                <Link href="/about">What is this?</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{meta.disclaimer}</p>
          </div>
        </Card>

        <section className="grid w-full gap-4 md:grid-cols-3">
          {[
            "৯টা প্রশ্ন, ২ মিনিটে শেষ",
            "Shareable result card + OG image",
            "Safe, non‑partisan humor",
          ].map((item) => (
            <Card key={item} className="glass rounded-2xl p-5">
              <p className="text-sm text-muted-foreground">{item}</p>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
