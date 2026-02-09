import React, { useEffect, useState, useContext } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { fetchActiveLocations } from "../features/wasteReport/data/fetchLocations";
import { submitWasteReport } from "../features/wasteReport/data/submitWasteReport";

import { WASTE_TYPES } from "../features/wasteReport/domain/wasteTypes";
import { LocationRow } from "../features/wasteReport/domain/types";

import { validateWasteReport } from "../features/wasteReport/application/validateWasteReport";
import { useWasteReportForm } from "../features/wasteReport/presentation/hooks/useWasteReportForm";
import { WasteRow } from "../features/wasteReport/presentation/components/WasteRow";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";

import { useLocationContext } from "../context/LocationContext";
import { findNearestWithin } from "../lib/geo";

export default function WasteReportScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);

  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [loading, setLoading] = useState(false);

  const { locationId, setLocationId, rows, toggleType, setKg, reset } = useWasteReportForm();
  const { location, consent } = useLocationContext();

  useEffect(() => {
    let mounted = true;

    fetchActiveLocations()
      .then((data) => {
        if (mounted) setLocations(data);
      })
      .catch((e) => Alert.alert(t("error"), `${t("fetch_failed")}: ${e?.message ?? e}`));

    return () => {
      mounted = false;
    };
  }, [t]);

  useEffect(() => {
    if (consent !== true) return;
    if (!location) return;
    if (!locations || locations.length === 0) return;
    if (locationId) return;

    const nearest = findNearestWithin(
      { latitude: location.latitude, longitude: location.longitude },
      locations,
      100
    );

    if (nearest) {
      setLocationId(String(nearest.row.id));
    }
  }, [consent, location, locations, locationId, setLocationId]);

  async function onSubmit() {
    if (loading) return;

    const validation = validateWasteReport({ locationId, rows });
    if (!validation.ok) {
      Alert.alert(t("missing_info"), validation.message);
      return;
    }

    setLoading(true);
    try {
      const createdBy = (user as any)?.id || (user as any)?.uid || "dev-user";

      const reportId = await submitWasteReport({
        locationId,
        createdBy,
        status: "submitted",
        notes: null,
        items: validation.items,
      });

      Alert.alert(t("saved"), `${t("report_saved")} (id: ${reportId})`);
      reset();
    } catch (e: any) {
      Alert.alert(t("error"), e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t("waste_report")}</Text>

      <Text style={[styles.label, { color: colors.text }]}>{t("select_location") ?? "Select location"}</Text>

      <View style={[
        styles.pickerWrap, 
        { 
          borderColor: colors.border ?? colors.text,
          backgroundColor: colors.card 
        }
      ]}>
        <Picker
          selectedValue={locationId ?? ""}
          onValueChange={(v) => setLocationId(String(v))}
          style={{ color: colors.text, backgroundColor: colors.card }}
          dropdownIconColor={colors.text} 
          mode="dropdown" 
        >
          <Picker.Item 
            label={t("select_location") ?? "Select location"} 
            value="" 
            color={isDark ? "#FFFFFF" : "#000000"}
          />
          {locations.map((l) => (
            <Picker.Item 
              key={l.id} 
              label={l.name} 
              value={String(l.id)} 
              color={isDark ? "#FFFFFF" : "#000000"}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.list}>
        {WASTE_TYPES.map(({ type, label }) => (
          <WasteRow
            key={type}
            type={type}
            label={label}
            selected={rows[type].selected}
            kgText={rows[type].kgText}
            onToggle={() => toggleType(type)}
            onKgChange={(txt) => setKg(type, txt)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.submit,
          { backgroundColor: colors.primary, borderColor: colors.primary },
          loading && styles.submitDisabled,
        ]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>{loading ? t("loading") : t("submit")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 28, gap: 12 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 8 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 8 },
  pickerWrap: { borderWidth: 1, borderRadius: 8, overflow: "hidden" },
  list: { marginTop: 8, gap: 10 },
  submit: { marginTop: 24, borderWidth: 1, borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  submitDisabled: { opacity: 0.6 },
  submitText: { fontSize: 20, fontWeight: "600", color: "#fff" },
});
