import { supabase } from "../../../lib/supabase";

export async function fetchFavoriteDetails(favoriteId: string): Promise<{
  locationIds: string[];
  wasteTypes: string[];
}> {
  const { data: locationData, error: locationError } = await supabase
    .from("report_favorite_locations")
    .select("location_id")
    .eq("favorite_id", favoriteId);

  if (locationError) throw locationError;

  const locationIds = locationData ? locationData.map((row) => row.location_id) : [];

  const { data: wasteTypeData, error: wasteTypeError } = await supabase
    .from("report_favorite_waste_types")
    .select("waste_type")
    .eq("favorite_id", favoriteId);

  if (wasteTypeError) throw wasteTypeError;

  const wasteTypes = wasteTypeData ? wasteTypeData.map((row) => row.waste_type) : [];

  return { locationIds, wasteTypes };
}
