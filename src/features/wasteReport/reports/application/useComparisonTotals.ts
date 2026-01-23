import { useEffect, useMemo, useState } from "react";
import { fetchComparisonTotals } from "../../data/fetchComparisonTotals";

type DateRange = {
  dayFrom: string;
  dayTo: string;
  fromTs?: string;
  toTs?: string;
};

export function useComparisonTotals(params: {
  locationIds: string[];
  wasteTypes: string[];
  rangeA: DateRange;
  rangeB: DateRange;
}) {
  const [aTotals, setATotals] = useState<Record<string, number>>({});
  const [bTotals, setBTotals] = useState<Record<string, number>>({});
  const [diffTotals, setDiffTotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const key = useMemo(
    () =>
      JSON.stringify({
        locationIds: params.locationIds,
        wasteTypes: params.wasteTypes,
        rangeA: params.rangeA,
        rangeB: params.rangeB,
      }),
    [params.locationIds, params.wasteTypes, params.rangeA, params.rangeB]
  );

  useEffect(() => {
    let active = true;

    (async () => {
      if (!params.locationIds.length) {
        setATotals({});
        setBTotals({});
        setDiffTotals({});
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetchComparisonTotals({
          locationIds: params.locationIds,
          wasteTypes: params.wasteTypes,
          rangeA: params.rangeA,
          rangeB: params.rangeB,
        });

        if (!active) return;
        setATotals(res.a ?? {});
        setBTotals(res.b ?? {});
        setDiffTotals(res.diff ?? {});
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

  return { aTotals, bTotals, diffTotals, loading, error };
}
