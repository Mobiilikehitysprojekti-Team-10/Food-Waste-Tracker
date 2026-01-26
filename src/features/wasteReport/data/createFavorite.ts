import { supabase } from "../../../lib/supabase";

export async function createFavorite(params: {
  ownerUid: string;
  name: string;
  locationIds: string[];
  wasteTypes: string[];
}) {
  const { data: fav, error: favErr } = await supabase
    .from("report_favorites")
    .insert({ owner_uid: params.ownerUid, name: params.name })
    .select("id")
    .single();

  if (favErr) throw favErr;

  const locRows = params.locationIds.map((location_id) => ({
    favorite_id: fav.id,
    location_id,
  }));

  const typeRows = params.wasteTypes.map((waste_type) => ({
    favorite_id: fav.id,
    waste_type,
  }));

  const { error: locErr } = await supabase.from("report_favorite_locations").insert(locRows);
  if (locErr) throw locErr;

  const { error: typeErr } = await supabase.from("report_favorite_waste_types").insert(typeRows);
  if (typeErr) throw typeErr;

  return fav.id as string;
}
