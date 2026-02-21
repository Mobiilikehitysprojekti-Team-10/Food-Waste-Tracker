import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { StyleSheet } from "react-native";

import { useMenuLocations } from "../features/menu/presentation/useMenuLocations";
import { useWeeklyMenu } from "../features/menu/presentation/useWeeklyMenu";
import { WEEKDAYS, getDefaultWeekdayKey } from "../features/menu/utils/dateUtils";
import type { WeekdayKey } from "../features/menu/domain/menuTypes";

import { useLocationContext } from "../context/LocationContext";
import { findNearestWithin } from "../lib/geo";
import { ThemedSelect } from "../components/ThemedSelect";

const STORAGE_KEY = "menu.selectedLocationId";

type SelectionSource = "gps" | "saved" | "default" | null;

export default function MenuScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const { locations, loading: locLoading, error: locError, refresh: refreshLocations } = useMenuLocations();
  const { location, consent } = useLocationContext();

  const [locationId, setLocationId] = useState<string>("");
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [selectionSource, setSelectionSource] = useState<SelectionSource>(null);
  const [selectedDay, setSelectedDay] = useState<WeekdayKey>(() => getDefaultWeekdayKey());

  const selectedLocation = useMemo(
    () => locations.find((l: any) => String(l.id) === String(locationId)) ?? null,
    [locations, locationId]
  );

  function onSelectLocation(id: string) {
    setLocationId(String(id));
    setHasUserSelected(true);
    setSelectionSource("saved");
  }

  useEffect(() => {
    if (!locations.length) return;
    if (hasUserSelected) return;

    if (consent !== true) {
      setLocationId("");
      return;
    }
    if (!location) {
      setLocationId("");
      return;
    }

    let cancelled = false;

    (async () => {
        const nearest = findNearestWithin(
          { latitude: location.latitude, longitude: location.longitude },
          locations as any,
          100
        );

        if (!cancelled && nearest) {
          setLocationId(String((nearest.row as any).id));
          setSelectionSource("gps");
          return;
        }
    })();

    return () => {
      cancelled = true;
    };
  }, [locations, consent, location, hasUserSelected]);

  useEffect(() => {
    if (!hasUserSelected) return;
    if (!locationId) return;
    void AsyncStorage.setItem(STORAGE_KEY, String(locationId));
  }, [locationId, hasUserSelected]);

  useEffect(() => {
    setSelectedDay(getDefaultWeekdayKey());
  }, [locationId]);

  const rssUrl = selectedLocation?.menu_week_rss_url ?? "";
  const { data: weeklyMenu, loading: menuLoading, error: menuError } = useWeeklyMenu(
    selectedLocation?.name ?? "Menu",
    rssUrl
  );

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
          style={{
            alignSelf: "flex-start",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderRadius: 8,
          }}
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
          Add Supabase locations rows with menu_enabled=true and menu_week_rss_url set.
        </Text>
      </View>
    );
  }

return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12, color: colors.text }}>
        {t("menu") ?? "Menu"}
      </Text>

      <Text style={{ marginBottom: 6, color: colors.text, fontWeight: "500" }}>
        {t("location") ?? "Location"}
      </Text>

      <Text style={{ marginBottom: 8, fontSize: 12, color: isDark ? "#aaa" : "#666" }}>
        {selectionSource === "gps"
          ? t("gps_selected")
         : selectionSource === "saved"
          ? t("manual_selected")
          : ""}
      </Text>

      {Platform.OS === "android" ? (
        <ThemedSelect
          value={locationId ?? ""}
          onChange={(v) => {
            const id = String(v);
            if (!id) return;
            onSelectLocation(id);
          }}
          placeholder={String(t("select_location") ?? "Select location")}
          title={String(t("select_location") ?? "Select location")}
          items={locations.map((l: any) => ({ label: String(l.name), value: String(l.id) }))}
        />
      ) : (
        <View style={{ borderWidth: 1, borderRadius: 10, borderColor: colors.border, backgroundColor: colors.card, overflow: "hidden" }}>
          <Picker
            selectedValue={locationId ?? ""}
            onValueChange={(v) => {
              const id = String(v);
              if (!id) return;
              onSelectLocation(id);
            }}
            style={{ color: colors.text }}
          >
            <Picker.Item label={String(t("select_location") ?? "Select location")} value="" color={isDark ? "#FFFFFF" : "#000000"} />
            {locations.map((l: any) => (
              <Picker.Item
                key={String(l.id)}
                label={String(l.name)}
                value={String(l.id)}
                color={isDark ? "#FFFFFF" : "#000000"}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* PÄIVÄVALITSIN */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
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
                backgroundColor: active ? colors.primary : colors.card,
                borderColor: active ? colors.primary : colors.border,
              }}
            >
              <Text style={{
                fontWeight: active ? "600" : "400",
                color: active ? "#ffffff" : colors.text
              }}>
                {wd.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {menuLoading && (
        <View style={{ paddingTop: 24, alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} />
          <Text style={{ marginTop: 8, color: colors.text }}>Searching for the menu...</Text>
        </View>
      )}

      {!menuLoading && menuError && (
        <View style={{ paddingTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>Error</Text>
          <Text style={{ marginTop: 6, color: colors.text }}>{menuError}</Text>
        </View>
      )}

      {!menuLoading && !menuError && day && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {day.sections.map((sec) => (
            <View key={sec.title} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6, color: colors.primary }}>
                {sec.title}
              </Text>
              {sec.items.map((it, idx) => (
                <Text key={`${sec.title}-${idx}`} style={{ marginBottom: 4, color: colors.text }}>
                  • {it}
                </Text>
              ))}
            </View>
          ))}
          <Text style={{ marginTop: 8, marginBottom: 20, fontSize: 12, color: colors.text, opacity: 0.6 }}>
            Updated: {weeklyMenu ? new Date(weeklyMenu.fetchedAt).toLocaleString() : ""}
          </Text>
        </ScrollView>
      )}
    </View>
  );
  }
