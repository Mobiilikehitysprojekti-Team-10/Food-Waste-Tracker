import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert, Modal, ScrollView } from "react-native";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext"; 
import { useLanguage } from "../context/LanguageContext"; 

type Props = { navigation: { goBack: () => void } };

type LocationRow = {
  id: string;
  name: string;
  is_active: boolean;
};

export default function AddComplaintScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [loadingLocations, setLoadingLocations] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedLocationName = useMemo(() => {
    return locations.find((l) => l.id === locationId)?.name ?? t('select_location');
  }, [locations, locationId, t]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingLocations(true);
      const res = await supabase
        .from("locations")
        .select("id,name,is_active")
        .eq("is_active", true)
        .order("name");

      if (!alive) return;

      if (res.error) {
        console.error("locations fetch error:", res.error);
        setLocations([]);
        setLocationId(null);
      } else {
        const rows = (res.data ?? []) as LocationRow[];
        setLocations(rows);
        setLocationId(rows[0]?.id ?? null);
      }
      setLoadingLocations(false);
    })();
    return () => { alive = false; };
  }, []);

  const canSubmit = useMemo(() => {
    return !!locationId && title.trim().length >= 3 && !saving && !loadingLocations;
  }, [locationId, title, saving, loadingLocations]);

  async function onSubmit() {
    if (!locationId) return;
    const titleTrim = title.trim();
    const textTrim = text.trim();
    setSaving(true);

    try {
      const insertRes = await supabase
        .from("complaints")
        .insert({
          location_id: locationId,
          created_by_user_id: null,
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
      if (complaintId && textTrim.length > 0) {
        await supabase.from("complaint_comments").insert({
          complaint_id: complaintId,
          user_id: null,
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
      <Text style={[styles.label, { color: colors.text }]}>{t('select_location')}</Text>

      {loadingLocations ? (
        <View style={{ paddingVertical: 12 }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <>
          <Pressable 
            style={[styles.dropdownButton, { backgroundColor: colors.card, borderColor: colors.border }]} 
            onPress={() => setLocationMenuOpen(true)} 
            disabled={locations.length === 0}
          >
            <Text style={[styles.dropdownButtonText, { color: colors.text }]}>{selectedLocationName}</Text>
            <Text style={[styles.dropdownChevron, { color: colors.text }]}>▾</Text>
          </Pressable>

          <Modal transparent animationType="fade" visible={locationMenuOpen} onRequestClose={() => setLocationMenuOpen(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setLocationMenuOpen(false)}>
              <Pressable style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => {}}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_location')}</Text>

                <ScrollView style={{ maxHeight: 360 }}>
                  {locations.map((loc) => {
                    const selected = loc.id === locationId;
                    return (
                      <Pressable
                        key={loc.id}
                        onPress={() => {
                          setLocationId(loc.id);
                          setLocationMenuOpen(false);
                        }}
                        style={[styles.modalItem, selected && { backgroundColor: colors.background }]}
                      >
                        <Text style={[styles.modalItemText, { color: colors.text }, selected && styles.modalItemTextSelected]}>{loc.name}</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Pressable style={[styles.modalClose, { borderTopColor: colors.border }]} onPress={() => setLocationMenuOpen(false)}>
                  <Text style={[styles.modalCloseText, { color: colors.secondary }]}>{t('cancel')}</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </Modal>
        </>
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
  dropdownButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: { fontSize: 16 },
  dropdownChevron: { fontSize: 16, opacity: 0.7 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", padding: 16, justifyContent: "center" },
  modalCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  modalTitle: { fontWeight: "700", marginBottom: 8 },
  modalItem: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10 },
  modalItemText: { fontSize: 15 },
  modalItemTextSelected: { fontWeight: "700" },
  modalClose: { marginTop: 10, alignItems: "center", paddingVertical: 10, borderTopWidth: 1 },
  modalCloseText: { fontWeight: "600" },
  input: { borderWidth: 1, borderRadius: 12, padding: 12 },
  textArea: { borderWidth: 1, borderRadius: 12, padding: 12, height: 200, textAlignVertical: "top" },
  submit: { marginTop: 12, borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  submitText: { fontWeight: "700", fontSize: 16 },
});