import { supabase } from "../../../lib/supabase";

export async function deleteFavorite(favoriteId: string, ownerUid: string) {
  const { error } = await supabase
    .from("report_favorites")
    .delete()
    .eq("id", favoriteId)
    .eq("owner_uid", ownerUid);

  if (error) throw error;
}
