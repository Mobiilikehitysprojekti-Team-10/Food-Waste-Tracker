import { useMemo, useState } from "react";
import { ALL_WASTE_TYPE_IDS } from "../../domain/wasteTypes";

export function useFavoriteDraft() {
  const [name, setName] = useState("");
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>(ALL_WASTE_TYPE_IDS);

  function toggleLocation(id: string) {
    setSelectedLocationIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleWasteType(id: string) {
    setSelectedWasteTypes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const isValid = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      selectedLocationIds.length >= 1 &&
      selectedWasteTypes.length >= 1
    );
  }, [name, selectedLocationIds, selectedWasteTypes]);

  return {
    name,
    setName,
    selectedLocationIds,
    toggleLocation,
    selectedWasteTypes,
    toggleWasteType,
    isValid,
  };
}