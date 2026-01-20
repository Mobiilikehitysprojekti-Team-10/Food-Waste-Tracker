import { WasteType } from "./types";

export const WASTE_TYPES: Array<{ type: WasteType; label: string }> = [
  { type: "BIO", label: "Biojäte" },
  { type: "MIXED", label: "Sekajäte" },
  { type: "HAZARDOUS", label: "Ongelmajäte" },
  { type: "METAL", label: "Metalli" },
  { type: "GLASS", label: "Lasi" },
  { type: "PAPER", label: "Paperi" },
  { type: "PLASTIC", label: "Muovi" },
  { type: "CARDBOARD", label: "Kartonkipakkaus" },
];
