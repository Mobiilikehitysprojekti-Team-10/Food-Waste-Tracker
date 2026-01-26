import React, { useContext, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { AuthContext } from "../context/AuthContext";
import { useLocations } from "../features/wasteReport/reports/application/useLocations";
import { useFavoriteDraft } from "../features/wasteReport/reports/application/useFavoriteDraft";
import { saveFavorite } from "../features/wasteReport/reports/application/saveFavorite";
import { MultiSelectList } from "../features/wasteReport/reports/presentation/components/MultiSelectList";
import { ScreenLayout } from "../features/wasteReport/reports/presentation/components/ScreenLayout";
import { WASTE_TYPES } from "../features/wasteReport/domain/wasteTypes";

export default function ReportsFavoriteScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);

  const ownerUid =
    (user?.uid as string | undefined) ||
    (user?.email as string | undefined) ||
    "dev-user";

  const { locations } = useLocations();
  const {
    name,
    setName,
    selectedLocationIds,
    toggleLocation,
    selectedWasteTypes,
    toggleWasteType,
  } = useFavoriteDraft();

  const [loading, setLoading] = useState(false);

  const locationItems = locations.map((l) => ({ id: l.id, label: l.name }));
  const wasteItems = WASTE_TYPES.map((w) => ({ id: w.type, label: w.label }));

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveFavorite({
        ownerUid,
        name,
        locationIds: selectedLocationIds,
        wasteTypes: selectedWasteTypes,
      });

      Alert.alert("Tallennettu", "Suosikki luotu.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Virhe", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title="Create favorite">
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name your favorite."
        style={styles.input}
      />

      <MultiSelectList
        title="Select locations"
        items={locationItems}
        selectedIds={selectedLocationIds}
        onToggle={toggleLocation}
      />

      <MultiSelectList
        title="Select waste types"
        items={wasteItems}
        selectedIds={selectedWasteTypes}
        onToggle={toggleWasteType}
      />

      <TouchableOpacity
        style={[styles.submit, loading && styles.submitDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.submitText}>{loading ? "Saving..." : "Save favorite"}</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 24, gap: 12 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 8 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 8 },

  box: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, gap: 10 },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  checkbox: { width: 26, height: 26, borderWidth: 2, borderColor: "#333", borderRadius: 6, marginRight: 12 },
  checkboxChecked: { backgroundColor: "#333" },
  rowText: { fontSize: 18 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginTop: 6,
  },

  submit: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { fontSize: 16, fontWeight: "600" },
});
