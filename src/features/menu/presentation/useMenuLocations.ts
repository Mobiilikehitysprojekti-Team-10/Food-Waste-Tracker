import { useCallback, useEffect, useState } from "react";
import { fetchMenuLocations, type MenuLocation } from "../data/fetchMenuLocations";

export function useMenuLocations() {
  const [locations, setLocations] = useState<MenuLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMenuLocations();
      setLocations(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { locations, loading, error, refresh: load };
}

