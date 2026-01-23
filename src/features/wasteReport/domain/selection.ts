export type Selection =
  | { kind: "loc"; id: string }
  | { kind: "fav"; id: string };

export function parseSelection(value: string): Selection | null {
  const [kind, id] = String(value || "").split(":");
  if (!id) return null;
  if (kind === "loc") return { kind: "loc", id };
  if (kind === "fav") return { kind: "fav", id };
  return null;
}

export function formatSelection(sel: Selection): string {
  return `${sel.kind}:${sel.id}`;
}