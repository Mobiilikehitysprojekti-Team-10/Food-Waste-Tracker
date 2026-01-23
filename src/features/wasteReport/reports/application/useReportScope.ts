import { useEffect, useMemo, useState } from "react";
import { parseSelection } from "../../domain/selection";
import { ALL_WASTE_TYPE_IDS, normalizeWasteTypes } from "../../domain/wasteTypes";
import { fetchFavoriteDetails } from "../../data/fetchFavoriteDetails";

export function useReportScope(params: {
  selectionValue: string;
  locations: Array<{ id: string; name: string }>;
  favorites: Array<{ id: string; name: string }>;
}) {
  const sel = useMemo(() => parseSelection(params.selectionValue), [params.selectionValue]);

  const selectionLabel = useMemo(() => {
    if (!sel) return "";
    if (sel.kind === "loc") return params.locations.find((l) => l.id === sel.id)?.name ?? "";
    if (sel.kind === "fav") return params.favorites.find((f) => f.id === sel.id)?.name ?? "";
    return "";
  }, [sel, params.locations, params.favorites]);

  const [locationIds, setLocationIds] = useState<string[]>([]);
  const [wasteTypes, setWasteTypes] = useState<string[]>(ALL_WASTE_TYPE_IDS);
  const [isFavoriteSelected, setIsFavoriteSelected] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!sel) {
        if (!active) return;
        setLocationIds([]);
        setWasteTypes(ALL_WASTE_TYPE_IDS);
        setIsFavoriteSelected(false);
        return;
      }

      if (sel.kind === "loc") {
        if (!active) return;
        setLocationIds([sel.id]);
        setWasteTypes(ALL_WASTE_TYPE_IDS);
        setIsFavoriteSelected(false);
        return;
      }

      const details = await fetchFavoriteDetails(sel.id);
      if (!active) return;

      const picked = normalizeWasteTypes(details.wasteTypes);
      setLocationIds(details.locationIds);
      setWasteTypes(picked.length ? picked : ALL_WASTE_TYPE_IDS);
      setIsFavoriteSelected(true);
    })().catch(() => {
      if (!active) return;
      setLocationIds([]);
      setWasteTypes(ALL_WASTE_TYPE_IDS);
      setIsFavoriteSelected(false);
    });

    return () => {
      active = false;
    };
  }, [sel]);

  return {
    selectionLabel,
    isFavoriteSelected,
    locationIds,
    wasteTypes,
  };
}