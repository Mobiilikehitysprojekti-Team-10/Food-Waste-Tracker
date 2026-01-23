import { useEffect, useState } from "react";
import { fetchActiveLocations } from "../../data/fetchLocations";

export type LocationRow = { id: string; name: string };

export function useLocations() {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const rows = await fetchActiveLocations();
        if (!active) return;
        setLocations(rows as any);
      } catch (e) {
        if (!active) return;
        setError(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { locations, loading, error };
}