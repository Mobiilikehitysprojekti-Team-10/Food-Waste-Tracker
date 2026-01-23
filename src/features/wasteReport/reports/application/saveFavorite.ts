import { createFavorite } from "../../data/createFavorite";

export async function saveFavorite(params: {
  ownerUid: string;
  name: string;
  locationIds: string[];
  wasteTypes: string[];
}) {
  const trimmed = params.name.trim();
  if (trimmed.length < 2) throw new Error("Name your favorite (at least 2 characters).");
  if (!params.locationIds.length) throw new Error("Select at least one location.");
  if (!params.wasteTypes.length) throw new Error("Select at least one waste type.");

  await createFavorite({
    ownerUid: params.ownerUid,
    name: trimmed,
    locationIds: params.locationIds,
    wasteTypes: params.wasteTypes,
  } as any);
}