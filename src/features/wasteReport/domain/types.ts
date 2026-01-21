export type WasteType =
  | "BIO"
  | "CARDBOARD"
  | "GLASS"
  | "METAL"
  | "PLASTIC"
  | "PAPER"
  | "MIXED"
  | "HAZARDOUS";

export type LocationRow = { id: string; name: string };

export type RowState = { selected: boolean; kgText: string };
