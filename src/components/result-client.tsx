"use client";

/**
 * Result Client Component
 *
 * Displays quiz result with:
 * - Responsive preview card (for on-screen display)
 * - Fixed 1080x1080 export renderer (offscreen, deterministic PNG export)
 *
 * Export Strategy:
 * - Uses separate DOM node (exportRef) instead of preview (cardRef)
 * - Export node has fixed dimensions (1080x1080) regardless of viewport
 * - Waits for fonts (document.fonts.ready) and images (img.decode())
 * - Prevents desktop layout issues where responsive styles cause content compression
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { QuizData } from "@/lib/quizSchema";
import type { ResultType } from "@/lib/scoring";
import { useQuizStore } from "@/store/quizStore";
import { getResultImage } from "@/lib/resultImages";

type ResultClientProps = {
  resultType: ResultType;
  data: QuizData;
};

export function ResultClient({ resultType, data }: ResultClientProps) {
  const router = useRouter();
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const exportRef = React.useRef<HTMLDivElement | null>(null);
  const { reset, setResult } = useQuizStore();
  const result = data.results[resultType];
  const resultImage = getResultImage(resultType);

  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [exportImageLoaded, setExportImageLoaded] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  // Noise texture as base64 SVG
  const noiseTexture = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSczMDAnIGhlaWdodD0nMzAwJz48ZmlsdGVyIGlkPSdhJyB4PScwJyB5PScwJz48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Jy43NScgc3RpdGNoVGlsZXM9J3N0aXRjaCcgdHlwZT0nZnJhY3RhbE5vaXNlJy8+PGZlQ29sb3JNYXRyaXggdHlwZT0nc2F0dXJhdGUnIHZhbHVlcz0nMCcvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNhKScvPjwvc3ZnPg==`;

  React.useEffect(() => {
    setResult(resultType);
    // Set share URL after hydration to avoid mismatch
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [resultType, setResult]);

  const caption = `${result.shareCaptionTemplate} ${data.meta.shareHashtags.join(" ")}`;
  const canShareUrl = shareUrl.length > 0;
  const isReadyForExport = imageLoaded && exportImageLoaded;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      toast.success("Caption copied!");
    } catch {
      toast.error("Copy failed. Try manually.");
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Copy failed. Try manually.");
    }
  };

  const handleDownload = async () => {
    if (!exportRef.current || !isReadyForExport) return;
    setIsExporting(true);

    // Get the parent wrapper
    const wrapper = exportRef.current.parentElement;

    try {
      // Temporarily make visible for export
      if (wrapper) {
        wrapper.style.visibility = "visible";
      }

      // Wait for fonts to be loaded
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Wait for all images in export node to be fully loaded
      const images = exportRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null);
          });
        }),
      );

      // Decode images for better rendering
      await Promise.all(
        Array.from(images).map((img) =>
          img.decode ? img.decode().catch(() => {}) : Promise.resolve(),
        ),
      );

      // Give extra time for final render
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Export at fixed 1080x1080 (export node is already this size)
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        width: 1080,
        height: 1080,
      });

      const link = document.createElement("a");
      link.download = `voter-type-${resultType}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Downloaded!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Try again.");
    } finally {
      // Hide again
      if (wrapper) {
        wrapper.style.visibility = "hidden";
      }
      setIsExporting(false);
    }
  };

  const handleRetake = () => {
    reset();
    router.push("/quiz");
  };

  return (
    <div className="space-y-6">
      <Card className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-6">
          {/* Image Banner */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 to-white/20 shadow-lg dark:from-slate-800/40 dark:to-slate-900/20">
            <Image
              src={resultImage.src}
              alt={resultImage.altBn}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your voter type
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">{result.titleBn}</h1>
            <p className="text-sm text-muted-foreground">{result.titleEnTag}</p>
            <div className="space-y-2 text-sm">
              <p>{result.roast1}</p>
              <p>{result.roast2}</p>
            </div>
            <div className="rounded-2xl border border-white/30 bg-white/60 p-4 text-sm dark:bg-slate-950/40">
              <p className="font-semibold">Quick tip</p>
              <p className="text-muted-foreground">{result.tip}</p>
            </div>
            <p className="text-sm text-muted-foreground">{result.nudge}</p>
          </div>
        </div>
      </Card>

      <Card className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Share card</h2>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            ref={cardRef}
            className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-2xl"
            style={{
              background: result.accentColor
                ? `linear-gradient(135deg, ${result.accentColor}dd 0%, ${result.accentColor}99 50%, ${result.accentColor}cc 100%)`
                : "linear-gradient(135deg, #6366f1dd 0%, #ec4899aa 50%, #06b6d4cc 100%)",
            }}
          >
            {/* Noise Texture Overlay */}
            <div
              className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
              style={{
                backgroundImage: `url(${noiseTexture})`,
              }}
            />

            {/* Gradient Ring Border Effect */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                boxShadow: result.accentColor
                  ? `inset 0 0 0 2px ${result.accentColor}44, 0 0 40px ${result.accentColor}33`
                  : "inset 0 0 0 2px rgba(255,255,255,0.3)",
              }}
            />

            {/* Image - Right Bottom with Glow */}
            <div className="absolute -bottom-4 -right-4 h-[60%] w-[60%] opacity-95">
              <div
                className="absolute inset-0 rounded-full blur-3xl"
                style={{
                  background: result.accentColor || "#ffffff",
                  opacity: 0.2,
                }}
              />
              <Image
                src={resultImage.src}
                alt={resultImage.altBn}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="400px"
                crossOrigin="anonymous"
              />
            </div>

            {/* Text Content - Left/Top */}
            <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
              <div className="space-y-4">
                {/* Type Badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm"
                  style={{
                    background: result.accentColor
                      ? `${result.accentColor}ee`
                      : "rgba(255,255,255,0.25)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {result.titleEnTag}
                </div>

                <h3 className="max-w-[55%] text-3xl font-bold leading-tight drop-shadow-lg">
                  {result.titleBn}
                </h3>
              </div>

              <div className="max-w-[60%] space-y-3">
                <p className="text-sm leading-relaxed text-white/95 drop-shadow-md">
                  {result.roast1}
                </p>

                {/* Footer Microcopy */}
                <p className="text-[10px] uppercase tracking-wide text-white/70">
                  White + Pink → same box 🗳️
                </p>
              </div>

              {/* Stamp Icon - Top Right */}
              <div className="absolute right-6 top-6">
                <svg
                  className="h-12 w-12 drop-shadow-lg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" opacity="0.3" fill="currentColor" />
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>

              {/* Hashtag - Bottom Left Corner */}
              <div className="absolute bottom-6 left-8 text-[10px] font-semibold uppercase tracking-widest text-white/60">
                {data.meta.shareHashtags[0]}
              </div>
            </div>
          </motion.div>

          {!isReadyForExport && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparing export...
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleDownload} disabled={!isReadyForExport || isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                "Download PNG"
              )}
            </Button>
            <Button variant="secondary" onClick={handleCopy}>
              Copy caption
            </Button>
            <Button variant="outline" onClick={handleCopyUrl} disabled={!canShareUrl}>
              Copy link
            </Button>
          </div>
        </div>
      </Card>

      {/* Offscreen Export Renderer - Fixed 1080x1080 for deterministic export */}
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          width: "1080px",
          height: "1080px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -9999,
          visibility: "hidden",
        }}
      >
        <div
          ref={exportRef}
          style={{
            width: "1080px",
            height: "1080px",
            overflow: "hidden",
            borderRadius: "24px",
            background: result.accentColor
              ? `linear-gradient(135deg, ${result.accentColor}dd 0%, ${result.accentColor}99 50%, ${result.accentColor}cc 100%)`
              : "linear-gradient(135deg, #6366f1dd 0%, #ec4899aa 50%, #06b6d4cc 100%)",
          }}
        >
          {/* Noise Texture Overlay */}
          <div
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
            style={{
              backgroundImage: `url(${noiseTexture})`,
            }}
          />

          {/* Gradient Ring Border Effect */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              boxShadow: result.accentColor
                ? `inset 0 0 0 2px ${result.accentColor}44, 0 0 40px ${result.accentColor}33`
                : "inset 0 0 0 2px rgba(255,255,255,0.3)",
            }}
          />

          {/* Image - Right Bottom with Glow */}
          <div
            className="absolute opacity-95"
            style={{
              bottom: "-40px",
              right: "-40px",
              width: "648px",
              height: "648px",
            }}
          >
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: result.accentColor || "#ffffff",
                opacity: 0.2,
              }}
            />
            <img
              src={resultImage.src}
              alt={resultImage.altBn}
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
              }}
              onLoad={() => setExportImageLoaded(true)}
            />
          </div>

          {/* Text Content - Left/Top */}
          <div
            className="relative z-10 flex h-full flex-col justify-between text-white"
            style={{ padding: "86px" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* Type Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "9999px",
                  padding: "12px 24px",
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  backdropFilter: "blur(12px)",
                  background: result.accentColor
                    ? `${result.accentColor}ee`
                    : "rgba(255,255,255,0.25)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  maxWidth: "fit-content",
                }}
              >
                {result.titleEnTag}
              </div>

              <h3
                style={{
                  maxWidth: "55%",
                  fontSize: "54px",
                  fontWeight: "700",
                  lineHeight: "1.2",
                  filter:
                    "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
                }}
              >
                {result.titleBn}
              </h3>
            </div>

            <div style={{ maxWidth: "60%", display: "flex", flexDirection: "column", gap: "24px" }}>
              <p
                style={{
                  fontSize: "20px",
                  lineHeight: "1.6",
                  color: "rgba(255,255,255,0.95)",
                  filter: "drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))",
                }}
              >
                {result.roast1}
              </p>

              {/* Footer Microcopy */}
              <p
                style={{
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                White + Pink → same box 🗳️
              </p>
            </div>

            {/* Stamp Icon - Top Right */}
            <div style={{ position: "absolute", right: "64px", top: "64px" }}>
              <svg
                style={{
                  width: "128px",
                  height: "128px",
                  filter:
                    "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" opacity="0.3" fill="currentColor" />
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>

            {/* Hashtag - Bottom Left Corner */}
            <div
              style={{
                position: "absolute",
                bottom: "64px",
                left: "86px",
                fontSize: "13px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {data.meta.shareHashtags[0]}
            </div>
          </div>
        </div>
      </div>

      <Card className="glass rounded-3xl p-6 md:p-8">
        <details className="group">
          <summary className="cursor-pointer list-none text-base font-semibold">
            Voting 101 (Quick)
          </summary>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p>1) কেন্দ্র আগে থেকে জানো—সময় বাঁচে।</p>
            <p>2) নির্দেশনা পড়ে নাও—ভুল কমবে।</p>
            <p>3) লাইনে শান্ত থাকো—সবাই vote দিতে চায়।</p>
            <p>4) ভোট শেষে ব্যালট ঠিকভাবে ফেলো।</p>
            <p>5) শেয়ার করার আগে যাচাই করো।</p>
          </div>
        </details>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>Verify before sharing. Report misinformation gently.</p>
        <Button variant="ghost" size="sm" onClick={handleRetake}>
          Retake Quiz
        </Button>
      </div>
    </div>
  );
}
