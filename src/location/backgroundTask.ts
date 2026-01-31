import * as TaskManager from "expo-task-manager";
import type { LocationObject } from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LOCATION_TASK_NAME = "background-location-task";
const STORAGE_LAST_LOCATION = "location.last";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) return;
  const locations = (data as any)?.locations as LocationObject[] | undefined;
  const last = locations?.[0];
  if (!last) return;

  const payload = {
    latitude: last.coords.latitude,
    longitude: last.coords.longitude,
    accuracy: last.coords.accuracy ?? null,
    timestamp: last.timestamp
  };

  await AsyncStorage.setItem(STORAGE_LAST_LOCATION, JSON.stringify(payload));
});