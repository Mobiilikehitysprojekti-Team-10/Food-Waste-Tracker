import { supabase } from "../../../lib/supabase";

export type LocationRow = {
  id: string;
  name: string;
};

export async function fetchActiveLocations(): Promise<LocationRow[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("id,name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
