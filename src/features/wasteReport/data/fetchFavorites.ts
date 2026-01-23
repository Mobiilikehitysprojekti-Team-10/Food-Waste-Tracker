import { supabase } from "../../../lib/supabase";

export type Favorite = { id: string; name: string };

export async function fetchFavorites(ownerUid: string): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from("report_favorites")
    .select("id,name")
    .eq("owner_uid", ownerUid)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
