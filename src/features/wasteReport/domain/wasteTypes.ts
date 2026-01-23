export type WasteTypeId =
  | "BIO"
  | "CARDBOARD"
  | "GLASS"
  | "METAL"
  | "PLASTIC"
  | "PAPER"
  | "MIXED"
  | "HAZARDOUS";

export const WASTE_TYPES: Array<{ type: WasteTypeId; label: string; short: string }> = [
  { type: "BIO", label: "Bio-waste", short: "Bio" },
  { type: "MIXED", label: "Mixed waste", short: "Mix" },
  { type: "HAZARDOUS", label: "Hazardous waste", short: "Haz" },
  { type: "METAL", label: "Metal", short: "Metal" },
  { type: "GLASS", label: "Glass", short: "Glass" },
  { type: "PAPER", label: "Paper", short: "Paper" },
  { type: "PLASTIC", label: "Plastic", short: "Plastic" },
  { type: "CARDBOARD", label: "Cardboard packaging", short: "Card" },
];

export const ALL_WASTE_TYPE_IDS: WasteTypeId[] = WASTE_TYPES.map((w) => w.type);

const ALLOWED = new Set<string>(ALL_WASTE_TYPE_IDS);

export function normalizeWasteTypes(input: any[]): WasteTypeId[] {
  return (input ?? [])
    .map((t) => String(t).trim().toUpperCase())
    .filter((t) => ALLOWED.has(t)) as WasteTypeId[];
}
