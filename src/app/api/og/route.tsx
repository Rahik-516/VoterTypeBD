import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getQuizData } from "@/lib/quizData";
import { RESULT_TYPES, type ResultType } from "@/lib/scoring";
import { getResultImage } from "@/lib/resultImages";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");

    if (!typeParam) {
      return new Response("Missing type parameter", { status: 400 });
    }

    const type = RESULT_TYPES.find((t) => t.toLowerCase() === typeParam.toLowerCase());

    if (!type) {
      return new Response("Invalid type", { status: 400 });
    }

    const data = getQuizData();
    const result = data.results[type as ResultType];
    const resultImage = getResultImage(type);

    // Construct absolute URL for the image
    const origin = request.nextUrl.origin;
    const imageUrl = `${origin}${resultImage.src}`;

    const accentColor = result.accentColor || "#6366f1";

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${accentColor}dd 0%, ${accentColor}99 50%, ${accentColor}cc 100%)`,
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Left side: Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            width: "55%",
            color: "white",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                fontSize: "24px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                opacity: 0.9,
              }}
            >
              {data.meta.shareHashtags[0]}
            </div>
            <div
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                lineHeight: "1.2",
              }}
            >
              {result.titleBn}
            </div>
            <div
              style={{
                fontSize: "32px",
                opacity: 0.95,
              }}
            >
              {result.titleEnTag}
            </div>
          </div>
          <div
            style={{
              fontSize: "28px",
              opacity: 0.95,
              lineHeight: "1.4",
            }}
          >
            {result.roast1}
          </div>
        </div>

        {/* Right side: Illustration */}
        <div
          style={{
            display: "flex",
            width: "40%",
            height: "80%",
            position: "relative",
          }}
        >
          <img
            src={imageUrl}
            alt={resultImage.altBn}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "24px",
              opacity: 0.95,
            }}
          />
        </div>

        {/* Ballot icon */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            fontSize: "64px",
          }}
        >
          🗳️
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
