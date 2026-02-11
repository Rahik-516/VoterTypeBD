import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-slate-950/40">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          🗳️ VoterTypeBD
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/about">About</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
