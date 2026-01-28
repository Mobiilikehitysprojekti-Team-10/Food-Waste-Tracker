import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";

import { AuthContext } from "../context/AuthContext";
import { useLocations } from "../features/wasteReport/reports/application/useLocations";
import { useFavoriteDraft } from "../features/wasteReport/reports/application/useFavoriteDraft";
import { saveFavorite } from "../features/wasteReport/reports/application/saveFavorite";
import { MultiSelectList } from "../features/wasteReport/reports/presentation/components/MultiSelectList";
import { ScreenLayout } from "../features/wasteReport/reports/presentation/components/ScreenLayout";
import { WASTE_TYPES } from "../features/wasteReport/domain/wasteTypes";
import { useTheme } from "../context/ThemeContext"; 
import { useLanguage } from "../context/LanguageContext"; 

export default function ReportsFavoriteScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();
  const { t } = useLanguage();

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
    if (!name.trim()) {
      Alert.alert(t('error'), "Please name your favorite.");
      return;
    }

    setLoading(true);
    try {
      await saveFavorite({
        ownerUid,
        name,
        locationIds: selectedLocationIds,
        wasteTypes: selectedWasteTypes,
      });

      Alert.alert(t('saved'), t('favorite_created'));
      navigation.goBack();
    } catch (e: any) {
      Alert.alert(t('error'), e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title={t('create_favorite')}>
      <View style={styles.container}>
        <Text style={[styles.label, { color: colors.text }]}>{t('name')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('name_your_favorite')}
          placeholderTextColor={colors.secondary}
          style={[styles.input, { 
            backgroundColor: colors.card, 
            borderColor: colors.border, 
            color: colors.text 
          }]}
        />

        <MultiSelectList
          title={t('select_locations')}
          items={locationItems}
          selectedIds={selectedLocationIds}
          onToggle={toggleLocation}
        />

        <MultiSelectList
          title={t('select_waste_types')}
          items={wasteItems}
          selectedIds={selectedWasteTypes}
          onToggle={toggleWasteType}
        />

        <TouchableOpacity
          style={[
            styles.submit, 
            { backgroundColor: colors.primary, borderColor: colors.primary },
            loading && styles.submitDisabled
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.submitText, { color: '#fff' }]}>{t('save_favorite')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 8, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  submit: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 2,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { fontSize: 16, fontWeight: "700" },
});