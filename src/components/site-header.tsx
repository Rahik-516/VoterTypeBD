import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-slate-950/60">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/tab_photo.png"
            alt="VoterTypeBD Logo"
            width={80}
            height={80}
            className="h-10 w-auto"
            quality={100}
            priority
          />
          <span className="text-sm font-semibold tracking-tight">VoterTypeBD</span>
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
