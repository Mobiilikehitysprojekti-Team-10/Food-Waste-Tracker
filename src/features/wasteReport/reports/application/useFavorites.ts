import { useCallback, useEffect, useState } from "react";
import { fetchFavorites, Favorite } from "../../data/fetchFavorites";

export function useFavorites(ownerId: string) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    setError(null);
    try {
      const favs = await fetchFavorites(ownerId);
      setFavorites(favs);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { favorites, refresh, loading, error };
}
