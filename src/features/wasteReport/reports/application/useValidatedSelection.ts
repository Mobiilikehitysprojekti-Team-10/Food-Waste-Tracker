import { useEffect, useMemo } from "react";
import { parseSelection } from "../../domain/selection";

function existsInList(kind: "loc" | "fav", id: string, lists: {
  locations: Array<{ id: string }>;
  favorites: Array<{ id: string }>;
}) {
  if (kind === "loc") return lists.locations.some((l) => l.id === id);
  return lists.favorites.some((f) => f.id === id);
}

export function useValidatedSelection(params: {
  selection: string;
  setSelection: (v: string) => void;
  locations: Array<{ id: string }>;
  favorites: Array<{ id: string }>;
  defaultToFirstLocation?: boolean;
}) {
  const sel = useMemo(() => parseSelection(params.selection), [params.selection]);

  useEffect(() => {
    if (!params.selection && params.defaultToFirstLocation && params.locations.length) {
      params.setSelection(`loc:${params.locations[0].id}`);
      return;
    }

    if (!sel) return;

    const ok = existsInList(sel.kind, sel.id, {
      locations: params.locations,
      favorites: params.favorites,
    });

    // jos viimeksi katsottu ei ole enää olemassa -> fallback
    if (!ok) {
      if (params.defaultToFirstLocation && params.locations.length) {
        params.setSelection(`loc:${params.locations[0].id}`);
      } else {
        params.setSelection("");
      }
    }
  }, [
    params.selection,
    params.locations,
    params.favorites,
    params.defaultToFirstLocation,
    params.setSelection,
    sel,
  ]);
}
