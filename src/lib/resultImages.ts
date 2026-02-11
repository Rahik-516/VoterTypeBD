/**
 * Centralized image mapping for result types
 * Maps each result type to its corresponding illustration image
 */

export type ResultKey =
  | "LastMinuteSprinter"
  | "PosterNostalgic2"
  | "InfoDetective"
  | "PhoneFreeHero"
  | "SealSniper"
  | "ConfusionCute"
  | "QueueZen"
  | "ProcessPro";

type ResultImageData = {
  src: string;
  altBn: string;
  altEn?: string;
};

export const RESULT_IMAGE_MAP: Record<ResultKey, ResultImageData> = {
  LastMinuteSprinter: {
    src: "/results/last_minute_sprinter.png",
    altBn: "লাস্ট-মিনিট স্প্রিন্টার",
    altEn: "Last-Minute Sprinter illustration",
  },
  PosterNostalgic2: {
    src: "/results/poster_nostalgic.png",
    altBn: "পোস্টার-নস্টালজিক",
    altEn: "Poster Nostalgic illustration",
  },
  InfoDetective: {
    src: "/results/info_detective.png",
    altBn: "ইনফো-ডিটেকটিভ",
    altEn: "Info Detective illustration",
  },
  PhoneFreeHero: {
    src: "/results/phone_free_hero.png",
    altBn: "ফোন-ফ্রি হিরো",
    altEn: "Phone-Free Hero illustration",
  },
  SealSniper: {
    src: "/results/seal_sniper.png",
    altBn: "সিল-স্নাইপার",
    altEn: "Seal Sniper illustration",
  },
  ConfusionCute: {
    src: "/results/confusion_but_cute.png",
    altBn: "কনফিউজড-বাট-কিউট",
    altEn: "Confusion but Cute illustration",
  },
  QueueZen: {
    src: "/results/queue_zen_master.png",
    altBn: "লাইন-জেন মাস্টার",
    altEn: "Queue Zen Master illustration",
  },
  ProcessPro: {
    src: "/results/process_pro.png",
    altBn: "প্রসেস-প্রো",
    altEn: "Process Pro illustration",
  },
};

/**
 * Get image data for a result type
 * Returns default fallback if type not found
 */
export function getResultImage(type: string): ResultImageData {
  const key = type as ResultKey;
  const image = RESULT_IMAGE_MAP[key];

  if (!image) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[resultImages] No image mapping found for type: ${type}`);
    }
    // Fallback
    return {
      src: "/results/default.png",
      altBn: "ভোটার টাইপ",
      altEn: "Voter Type illustration",
    };
  }

  return image;
}

/**
 * Runtime validation: ensure all result types have images
 * Call this in tests or during app initialization
 */
export function validateImageMapping(resultTypes: readonly string[]): boolean {
  const mappedKeys = Object.keys(RESULT_IMAGE_MAP);
  const missing = resultTypes.filter((type) => !mappedKeys.includes(type));

  if (missing.length > 0) {
    console.error(`[resultImages] Missing image mappings for:`, missing);
    return false;
  }

  if (mappedKeys.length !== resultTypes.length) {
    console.warn(
      `[resultImages] Mapping count (${mappedKeys.length}) doesn't match result types count (${resultTypes.length})`,
    );
  }

  return true;
}
