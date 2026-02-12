import React, { useCallback, useContext, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";
import { notifyManagersAtLocation } from "../features/notifications/push";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = { navigation: { goBack: () => void } };

type LocationRow = {
  id: string;
  name: string;
  is_active: boolean;
};

const STORAGE_SELECTED = "menu.selectedLocationId";

export default function AddComplaintScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);

  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [locationId, setLocationId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [loadingLocations, setLoadingLocations] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedLocationName = useMemo(() => {
    if (!locationId) return t("select_location") ?? "Select location";
    return locations.find((l) => l.id === locationId)?.name ?? `Location #${String(locationId).slice(0, 6)}`;
  }, [locations, locationId, t]);

  const loadOfficeAndLocations = useCallback(async () => {
    setLoadingLocations(true);

    // lue toimipiste joka on valittu login screenillä
    const storedSelected = await AsyncStorage.getItem(STORAGE_SELECTED);

    // hae kaikki aktiiviset toimipisteet, jotta voidaan näyttää nimi ja varmistaa että lukittu toimipiste on edelleen validi
    const res = await supabase
      .from("locations")
      .select("id,name,is_active")
      .eq("is_active", true)
      .order("name");

    if (res.error) {
      console.error("locations fetch error:", res.error);
      setLocations([]);
      setLocationId(storedSelected ?? null);
      setLoadingLocations(false);
      return;
    }

    const rows = (res.data ?? []) as LocationRow[];
    setLocations(rows);

    // lukitse valittu toimipiste, mutta vain jos se on edelleen aktiivinen / validi
    const exists = storedSelected ? rows.some((r) => String(r.id) === String(storedSelected)) : false;
    setLocationId(exists ? String(storedSelected) : null);

    setLoadingLocations(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        if (cancelled) return;
        await loadOfficeAndLocations();
      })();
      return () => {
        cancelled = true;
      };
    }, [loadOfficeAndLocations])
  );

  const canSubmit = useMemo(() => {
    return !!locationId && title.trim().length >= 3 && !saving && !loadingLocations;
  }, [locationId, title, saving, loadingLocations]);

  async function onSubmit() {
    if (!locationId) {
      Alert.alert(
        t("select_location") ?? "Select location",
        t("select_office_before_login") ?? "Go back to login and select an office first."
      );
      return;
    }
    const titleTrim = title.trim();
    const textTrim = text.trim();
    setSaving(true);

    try {
      const insertRes = await supabase
        .from("complaints")
        .insert({
          location_id: locationId,
          created_by_user_id: user?.id ?? null,
          description: titleTrim,
          status: "open",
        })
        .select("id")
        .single();

      if (insertRes.error) {
        Alert.alert("Error", "Could not create complaint.");
        return;
      }

      const complaintId = insertRes.data?.id as string | undefined;

      // noti vain saman toimipisteen managereille
      if (complaintId) {
        await notifyManagersAtLocation(
          locationId,
          "complaint_new",
          {
            title: "Uusi complaint",
            body: `${titleTrim}`,
            data: { complaintId, locationId },
          },
          user?.id ?? null
        );
      }

      if (complaintId && textTrim.length > 0) {
        await supabase.from("complaint_comments").insert({
          complaint_id: complaintId,
          user_id: user?.id ?? null,
          comment_text: textTrim,
        });
      }

      setTitle("");
      setText("");
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>{t("location") ?? t("select_location") ?? "Office"}</Text>

      {loadingLocations ? (
        <View style={{ paddingVertical: 12 }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : locationId ? (
        <View style={[styles.officeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text, fontWeight: "700" }}>{selectedLocationName}</Text>
          <Text style={{ marginTop: 6, color: colors.secondary, fontSize: 12 }}>
            {t("office_locked") ?? "Office is locked based on your selection on the login screen."}
          </Text>
        </View>
      ) : (
        <View style={[styles.officeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text, fontWeight: "700" }}>
            {t("select_location") ?? "Select location"}
          </Text>
          <Text style={{ marginTop: 6, color: colors.secondary, fontSize: 12 }}>
            {t("select_office_before_login") ?? "Go back to login and select an office first."}
          </Text>
        </View>
      )}

      <Text style={[styles.label, { color: colors.text }]}>{t('header')}</Text>
      <TextInput
        placeholder="..."
        placeholderTextColor={colors.secondary}
        value={title}
        onChangeText={setTitle}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
      />

      <Text style={[styles.label, { color: colors.text, marginTop: 12 }]}>{t('description')}</Text>
      <TextInput
        placeholder="..."
        placeholderTextColor={colors.secondary}
        value={text}
        onChangeText={setText}
        multiline
        style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
      />

      <Pressable
        style={[styles.submit, { backgroundColor: colors.primary, borderColor: colors.primary }, !canSubmit && { opacity: 0.5 }]}
        disabled={!canSubmit}
        onPress={onSubmit}
      >
        <Text style={[styles.submitText, { color: '#fff' }]}>{saving ? "..." : t('save')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: "600", marginBottom: 8 },
  officeCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  input: { borderWidth: 1, borderRadius: 12, padding: 12 },
  textArea: { borderWidth: 1, borderRadius: 12, padding: 12, height: 200, textAlignVertical: "top" },
  submit: { marginTop: 12, borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  submitText: { fontWeight: "700", fontSize: 16 },
});