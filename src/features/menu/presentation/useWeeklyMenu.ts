import { useCallback, useEffect, useState } from "react";
import type { WeeklyMenu } from "../domain/menuTypes";
import { fetchWeeklyMenu } from "../data/fetchWeeklyMenu";

export function useWeeklyMenu(locationName: string, rssUrl: string) {
  const [data, setData] = useState<WeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const weekly = await fetchWeeklyMenu(locationName, rssUrl);
      setData(weekly);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [locationName, rssUrl]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refresh: load };
}
