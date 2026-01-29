import { supabase } from "../../../lib/supabase";

export type MenuLocation = {
  id: string;
  name: string;
  menu_week_rss_url: string;
  menu_source: string | null;
};

export async function fetchMenuLocations(): Promise<MenuLocation[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("id,name,menu_week_rss_url,menu_source")
    .eq("is_active", true)
    .eq("menu_enabled", true)
    .order("name", { ascending: true });

  if (error) throw error;

  return (data ?? [])
    .filter((r: any) => typeof r.menu_week_rss_url === "string" && r.menu_week_rss_url.trim().length > 0)
    .map((r: any) => ({
      id: r.id,
      name: r.name,
      menu_week_rss_url: r.menu_week_rss_url,
      menu_source: r.menu_source ?? null,
    }));
}
