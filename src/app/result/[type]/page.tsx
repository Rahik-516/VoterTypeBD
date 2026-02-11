import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { ResultClient } from "@/components/result-client";
import { getQuizData } from "@/lib/quizData";
import { RESULT_TYPES, type ResultType } from "@/lib/scoring";

type ResultPageProps = {
  params: Promise<{ type: string }>;
};

const resolveType = (rawType: string): ResultType | null => {
  const normalized = decodeURIComponent(rawType).trim().toLowerCase();
  return RESULT_TYPES.find((type) => type.toLowerCase() === normalized) ?? null;
};

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { results, meta } = getQuizData();
  const { type: rawType } = await params;
  const type = resolveType(rawType);
  if (!type) return {};
  const result = results[type];

  if (!result) return {};

  const ogUrl = `/api/og?type=${type}`;

  return {
    title: `${result.titleBn} — ${meta.title}`,
    description: result.roast1,
    openGraph: {
      title: result.titleBn,
      description: result.roast1,
      images: [{ url: ogUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: result.titleBn,
      description: result.roast1,
      images: [ogUrl],
    },
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const data = getQuizData();
  const { type: rawType } = await params;
  const type = resolveType(rawType);

  if (!type) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:py-14">
        <ResultClient resultType={type} data={data} />
      </main>
    </div>
  );
}
