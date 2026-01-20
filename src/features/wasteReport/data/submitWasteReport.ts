import { supabase } from "../../../lib/supabase";

type WasteItemInput = {
  waste_type: "BIO" | "CARDBOARD" | "GLASS" | "METAL" | "PLASTIC" | "PAPER" | "MIXED" | "HAZARDOUS";
  kg: number;
  description?: string | null;
};

export async function submitWasteReport(params: {
  locationId: string;
  createdBy: string; // Firebase UID myöhemmin
  status?: string | null;
  notes?: string | null;
  items: WasteItemInput[];
}) {
  const { data: report, error: reportErr } = await supabase
    .from("waste_reports")
    .insert({
      location_id: params.locationId,
      created_by: params.createdBy,
      status: params.status ?? null,
      notes: params.notes ?? null,
    })
    .select("id")
    .single();

  if (reportErr) throw reportErr;

  const rows = params.items.map((i) => ({
    waste_report_id: report.id,
    waste_type: i.waste_type,
    kg: i.kg,
    description: i.description ?? null,
  }));

  const { error: itemsErr } = await supabase.from("waste_report_items").insert(rows);
  if (itemsErr) throw itemsErr;

  return report.id as string;
}
