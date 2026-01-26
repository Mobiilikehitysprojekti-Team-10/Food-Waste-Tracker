import { useEffect, useMemo, useState } from "react";
import { fetchTotals } from "../../data/fetchTotals";

export function useWeeklyTotals(params: {
  locationIds: string[];
  wasteTypes: string[];
  dayFrom: string;
  dayTo: string;
}) {
  const [totalsByType, setTotalsByType] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const key = useMemo(() => {
    return JSON.stringify({
      locationIds: params.locationIds,
      wasteTypes: params.wasteTypes,
      dayFrom: params.dayFrom,
      dayTo: params.dayTo,
    });
  }, [params.locationIds, params.wasteTypes, params.dayFrom, params.dayTo]);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!params.locationIds.length) {
        setTotalsByType({});
        return;
      }

      setLoading(true);
      try {
        const rows = await fetchTotals({
          locationIds: params.locationIds,
          wasteTypes: params.wasteTypes,
          dayFrom: params.dayFrom,
          dayTo: params.dayTo,
        });

        const allowed = new Set(params.wasteTypes);
        const agg: Record<string, number> = {};
        for (const wt of params.wasteTypes) agg[wt] = 0;

        for (const r of rows as any[]) {
          const wt = String(r.waste_type ?? "").toUpperCase();
          if (!allowed.has(wt)) continue;
          agg[wt] = (agg[wt] ?? 0) + Number(r.total_kg ?? 0);
        }

        if (!active) return;
        setTotalsByType(agg);
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
  }, [key]);

  return { totalsByType, loading, error };
}