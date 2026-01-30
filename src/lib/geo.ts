export type LatLng = { latitude: number; longitude: number };

export function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function findNearestWithin<T extends { latitude?: number | null; longitude?: number | null }>(
  origin: LatLng,
  rows: T[],
  maxMeters: number
): { row: T; meters: number } | null {
  let best: { row: T; meters: number } | null = null;

  for (const row of rows) {
    if (row.latitude == null || row.longitude == null) continue;

    const meters = haversineMeters(origin, {
      latitude: row.latitude,
      longitude: row.longitude
    });

    if (meters <= maxMeters && (!best || meters < best.meters)) {
      best = { row, meters };
    }
  }

  return best;
}
