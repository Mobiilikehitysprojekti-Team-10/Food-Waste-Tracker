import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function usePersistedSelection(storageKey: string, defaultValue: string) {
  const [value, setValue] = useState<string>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const v = await AsyncStorage.getItem(storageKey);
        if (active && v) setValue(v);
      } finally {
        if (active) setHydrated(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(storageKey, value).catch(() => {});
  }, [hydrated, storageKey, value]);

  return { value, setValue, hydrated };
}