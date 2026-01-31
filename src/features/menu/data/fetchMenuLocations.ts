import { supabase } from "../../../lib/supabase";

export type MenuLocation = {
  id: string;
  name: string;
  menu_week_rss_url: string;
  menu_source: string | null;
  latitude: number | null;
  longitude: number | null;
};

export async function fetchMenuLocations(): Promise<MenuLocation[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("id,name,menu_week_rss_url,menu_source,latitude,longitude")
    .eq("is_active", true)
    .eq("menu_enabled", true)
    .order("name", { ascending: true });

  if (error) throw error;

  return (data ?? [])
    .filter((r: any) => typeof r.menu_week_rss_url === "string" && r.menu_week_rss_url.trim().length > 0)
    .map((r: any) => ({
      id: String(r.id),
      name: String(r.name ?? ""),
      menu_week_rss_url: String(r.menu_week_rss_url),
      menu_source: r.menu_source ?? null,
      latitude: typeof r.latitude === "number" ? r.latitude : null,
      longitude: typeof r.longitude === "number" ? r.longitude : null,
    }));
}
