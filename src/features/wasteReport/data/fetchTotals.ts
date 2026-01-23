import { supabase } from "../../../lib/supabase";

export type TotalRow = {
  location_id: string;
  day: string;
  waste_type: string;
  total_kg: number;
};

function toDayString(input: string): string {

  if (!input) return input;

  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

  const d = new Date(input);
  if (!Number.isFinite(d.getTime())) return input;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function fetchTotals(params: {
  locationIds: string[];
  wasteTypes: string[];
  dayFrom: string;
  dayTo: string;
}): Promise<TotalRow[]> {
  const dayFrom = toDayString(params.dayFrom);
  const dayTo = toDayString(params.dayTo);

  const { data, error } = await supabase
    .from("vw_waste_totals_daily")
    .select("location_id,day,waste_type,total_kg")
    .in("location_id", params.locationIds)
    .in("waste_type", params.wasteTypes)
    .gte("day", dayFrom)
    .lte("day", dayTo);

  if (error) throw error;
  return (data ?? []) as any;
}

