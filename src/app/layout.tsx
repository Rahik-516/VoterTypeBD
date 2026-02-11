import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const notoBn = Noto_Sans_Bengali({
  variable: "--font-bn",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "তোমার ভোটার টাইপ কোনটা? — Sarcastic Edition 2026",
  description: "৯টা প্রশ্নে তোমার voter vibe বের করো। নন-পার্টিজান, মজার, তথ্যভিত্তিক কুইজ।",
  metadataBase: new URL("https://voter-type.vercel.app"),
  openGraph: {
    title: "তোমার ভোটার টাইপ কোনটা? — Sarcastic Edition 2026",
    description: "Gen‑Z friendly Bangla/Banglish voter‑awareness quiz with shareable results.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "তোমার ভোটার টাইপ কোনটা? — Sarcastic Edition 2026",
    description: "Gen‑Z friendly Bangla/Banglish voter‑awareness quiz with shareable results.",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${notoBn.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
