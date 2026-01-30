import { supabase } from "../../../lib/supabase";
import type { LocationRow } from "../domain/types";

export async function fetchActiveLocations(): Promise<LocationRow[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("id,name,latitude,longitude")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((r: any) => ({
    id: String(r.id),
    name: String(r.name ?? ""),
    latitude: typeof r.latitude === "number" ? r.latitude : null,
    longitude: typeof r.longitude === "number" ? r.longitude : null,
  }));
}

