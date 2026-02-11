# Voter Type BD — Sarcastic Edition 2026

Production-ready Bangla + Banglish voter personality quiz for Gen‑Z/students in Bangladesh. Non‑partisan, safe, meme‑y, and shareable.

## Features

- 9-question quiz with scoring + tie-breakers
- 8 result types with roast + tip + nudge
- Shareable result card (PNG + caption + URL)
- Dynamic OG image endpoint for sharing
- PWA-ready offline-ish caching
- Accessibility-first, mobile-first UI
- Unit + E2E tests

## Tech Stack

- Next.js App Router + React + TypeScript
- TailwindCSS + shadcn/ui + lucide-react
- Zustand + **sessionStorage persistence** (fresh quiz on new sessions)
- Zod data validation
- Framer Motion transitions
- Vitest + React Testing Library + Playwright
- ESLint + Prettier + Husky + lint-staged

## Getting Started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start the quiz.

## Result Images

Place PNG result images in `/public/results/` with these exact filenames:

- `last_minute_sprinter.png`
- `poster_nostalgic.png`
- `info_detective.png`
- `phone_free_hero.png`
- `seal_sniper.png`
- `confusion_but_cute.png`
- `queue_zen_master.png`
- `process_pro.png`

Images are automatically mapped to result types and appear in the share card export.

## Data Persistence

**Progress is session-only by default**. Quiz answers are stored in `sessionStorage`, meaning:

- Refreshing the page in the same tab keeps your progress
- Closing the browser tab/window clears all data
- Opening the site on a new device starts fresh

This ensures users always get a fresh quiz experience on new visits.

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – lint
- `npm run test` – run unit tests
- `npm run test:e2e` – run Playwright tests
- `npm run format` – format with Prettier

If running Playwright for the first time:

```bash
npx playwright install
```

## Content Editing

Quiz copy is data-driven. Update the JSON content in:

- src/data/quiz.bn.json

After editing, run tests to verify schema and scoring:

```bash
npm run test
```

## Result Type Images

Place PNG illustrations in `/public/results/` with these exact filenames:

- `last_minute_sprinter.png` → LastMinuteSprinter
- `poster_nostalgic.png` → PosterNostalgic2
- `info_detective.png` → InfoDetective
- `phone_free_hero.png` → PhoneFreeHero
- `seal_sniper.png` → SealSniper
- `confusion_but_cute.png` → ConfusionCute
- `queue_zen_master.png` → QueueZen
- `process_pro.png` → ProcessPro

Images appear on:

- Result page banner
- Shareable card preview
- Downloaded PNG export
- OG image metadata

All mappings are centralized in `src/lib/resultImages.ts` for type safety.

## Share Card Export

The "Download PNG" feature uses a **dedicated export renderer** for deterministic output:

- **Preview card**: Responsive, adapts to viewport (uses Tailwind breakpoints)
- **Export renderer**: Fixed 1080×1080px offscreen node, no responsive classes
- **Export process**:
  1. Waits for `document.fonts.ready`
  2. Ensures all images are loaded (`img.decode()`)
  3. Captures export node at 2× pixel ratio
  4. Downloads as `voter-type-{TYPE}.png`

This prevents desktop layout bugs where responsive styles caused content compression in exported PNGs.

## Routes

- `/` – Landing
- `/quiz` – Quiz flow
- `/result/[type]` – Result
- `/api/og?type=TYPE` – Dynamic OG image
- `/about` – About

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/new)
3. Vercel will auto-detect Next.js settings
4. Deploy!

**Important**: After deployment, update the `metadataBase` in [src/app/layout.tsx](src/app/layout.tsx) with your production URL:

```tsx
metadataBase: new URL("https://your-app-name.vercel.app"),
```

### Manual Build

```bash
npm run build
npm run start
```

The production build outputs to `.next/` and runs on port 3000 by default.

## Safety

Non‑partisan quiz, no party or candidate references. Humor targets situations, not identities. Verify before sharing.
