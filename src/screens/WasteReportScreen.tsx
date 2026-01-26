import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { fetchActiveLocations } from "../features/wasteReport/data/fetchLocations";
import { submitWasteReport } from "../features/wasteReport/data/submitWasteReport";

import { WASTE_TYPES } from "../features/wasteReport/domain/wasteTypes";
import { LocationRow } from "../features/wasteReport/domain/types";

import { validateWasteReport } from "../features/wasteReport/application/validateWasteReport";
import { useWasteReportForm } from "../features/wasteReport/presentation/hooks/useWasteReportForm";
import { WasteRow } from "../features/wasteReport/presentation/components/WasteRow";

export default function WasteReportScreen() {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [loading, setLoading] = useState(false);

  const { locationId, setLocationId, rows, toggleType, setKg, reset } = useWasteReportForm();

  useEffect(() => {
    let mounted = true;
    fetchActiveLocations()
      .then((data) => mounted && setLocations(data))
      .catch((e) => Alert.alert("Virhe", `Toimipisteiden haku epäonnistui: ${e?.message ?? e}`));
    return () => {
      mounted = false;
    };
  }, []);

  async function onSubmit() {
    if (loading) return;

    const validation = validateWasteReport({ locationId, rows });
    if (!validation.ok) {
      Alert.alert("Puuttuva tieto", validation.message);
      return;
    }

    setLoading(true);
    try {
      const createdBy = "dev-user"; // myöhemmin AuthContextista Firebase UID

      const reportId = await submitWasteReport({
        locationId,
        createdBy,
        status: "submitted",
        notes: null,
        items: validation.items,
      });

      Alert.alert("Tallennettu", `Raportti tallennettu (id: ${reportId})`);
      reset();
    } catch (e: any) {
      Alert.alert("Virhe", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Waste Report</Text>

      <Text style={styles.label}>Select location</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={locationId} onValueChange={(v) => setLocationId(String(v))}>
          <Picker.Item label="Valitse toimipiste..." value="" />
          {locations.map((l) => (
            <Picker.Item key={l.id} label={l.name} value={l.id} />
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
            onKgChange={(t) => setKg(type, t)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submit, loading && styles.submitDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>{loading ? "Saving..." : "Submit"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 28, gap: 12 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 8 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 8 },
  pickerWrap: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, overflow: "hidden" },
  list: { marginTop: 8, gap: 10 },
  submit: { marginTop: 24, borderWidth: 1, borderColor: "#333", borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  submitDisabled: { opacity: 0.6 },
  submitText: { fontSize: 20, fontWeight: "600" },
});
