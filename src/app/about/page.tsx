import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:py-14">
        <Card className="glass rounded-3xl p-6 md:p-8">
          <div className="space-y-4 text-sm text-muted-foreground">
            <h1 className="text-2xl font-semibold text-foreground">About this quiz</h1>
            <p>
              এটা একটা non‑partisan, meme‑y কিন্তু safe voter‑awareness quiz. কোনো দল বা প্রার্থী
              উল্লেখ নেই।
            </p>
            <p>
              ডিসক্লেমার: এটি শুধুই ফান + awareness. অফিসিয়াল নির্দেশনা ফলো করো এবং শান্তিপূর্ণভাবে
              ভোট দাও।
            </p>
            <p>
              Sources (placeholders): নির্বাচন কমিশনের অফিসিয়াল নির্দেশনা, সরকারি হেল্পলাইন, এবং
              পাবলিক নোটিশসমূহ।
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
