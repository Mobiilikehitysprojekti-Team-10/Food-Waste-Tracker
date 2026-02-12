import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_SELECTED = "menu.selectedLocationId";

export async function getSelectedLocationId(): Promise<string | null> {
  const id = await AsyncStorage.getItem(STORAGE_SELECTED);
  return id ? String(id) : null;
}