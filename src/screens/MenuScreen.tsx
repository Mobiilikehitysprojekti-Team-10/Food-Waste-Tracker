import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useMenuLocations } from "../features/menu/presentation/useMenuLocations";
import { useWeeklyMenu } from "../features/menu/presentation/useWeeklyMenu";
import { WEEKDAYS, getDefaultWeekdayKey } from "../features/menu/utils/dateUtils";
import type { WeekdayKey } from "../features/menu/domain/menuTypes";

const STORAGE_KEY = "menu.selectedLocationId";

export default function MenuScreen() {
  const { locations, loading: locLoading, error: locError, refresh: refreshLocations } = useMenuLocations();

  const [locationId, setLocationId] = useState<string>("");
  const selectedLocation = useMemo(
    () => locations.find((l) => l.id === locationId) ?? locations[0],
    [locations, locationId]
  );

  const [selectedDay, setSelectedDay] = useState<WeekdayKey>(() => getDefaultWeekdayKey());

  useEffect(() => {
    if (!locations.length) return;

    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const fallback = locations[0].id;

      const next = saved && locations.some((l) => l.id === saved) ? saved : fallback;
      setLocationId(next);
    })();
  }, [locations]);

  useEffect(() => {
    if (locationId) void AsyncStorage.setItem(STORAGE_KEY, locationId);
  }, [locationId]);

  useEffect(() => {
    setSelectedDay(getDefaultWeekdayKey());
  }, [locationId]);

  const rssUrl = selectedLocation?.menu_week_rss_url ?? "";
  const {
    data: weeklyMenu,
    loading: menuLoading,
    error: menuError,
  } = useWeeklyMenu(selectedLocation?.name ?? "Menu", rssUrl);

  const day = weeklyMenu?.days[selectedDay];

  if (locLoading) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Searching for locations...</Text>
      </View>
    );
  }

  if (locError) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Error</Text>
        <Text style={{ marginTop: 8 }}>{locError}</Text>

        <View style={{ height: 12 }} />
        <Pressable
          onPress={refreshLocations}
          style={{ alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 8 }}
        >
          <Text>Try again</Text>
        </Pressable>
      </View>
    );
  }

  if (!locations.length) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>No locations</Text>
        <Text style={{ marginTop: 8 }}>
          Lisää Supabaseen locations-rivejä, joilla menu_enabled=true ja menu_week_rss_url asetettu.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>Menu</Text>

      <Text style={{ marginBottom: 6 }}>Location</Text>
      <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 12 }}>
        <Picker selectedValue={locationId} onValueChange={(v) => setLocationId(String(v))}>
          {locations.map((l) => (
            <Picker.Item key={l.id} label={l.name} value={l.id} />
          ))}
        </Picker>
      </View>

      {/* Ma–Pe -välilehdet */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        {WEEKDAYS.map((wd) => {
          const active = wd.key === selectedDay;
          return (
            <Pressable
              key={wd.key}
              onPress={() => setSelectedDay(wd.key)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: active ? "#222" : "#ccc",
              }}
            >
              <Text style={{ fontWeight: active ? "600" : "400" }}>{wd.label}</Text>
            </Pressable>
          );
        })}
      </View>



      <View style={{ height: 8 }} />

      {menuLoading && (
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Searching for the menu...</Text>
        </View>
      )}

      {!menuLoading && menuError && (
        <View style={{ paddingTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Error</Text>
          <Text style={{ marginTop: 6 }}>{menuError}</Text>
        </View>
      )}

      {!menuLoading && !menuError && day && (
        <ScrollView>
          {day.sections.map((sec) => (
            <View key={sec.title} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}>{sec.title}</Text>
              {sec.items.map((it, idx) => (
                <Text key={`${sec.title}-${idx}`} style={{ marginBottom: 4 }}>
                  • {it}
                </Text>
              ))}
            </View>
          ))}

          <Text style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
            Updated: {weeklyMenu ? new Date(weeklyMenu.fetchedAt).toLocaleString() : ""}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
