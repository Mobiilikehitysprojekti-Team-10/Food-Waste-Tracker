import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert, Modal, ScrollView } from "react-native";
import { supabase } from "../lib/supabase";

type Props = { navigation: { goBack: () => void } };

type LocationRow = {
  id: string;
  name: string;
  is_active: boolean;
};

export default function AddComplaintScreen({ navigation }: Props) {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [loadingLocations, setLoadingLocations] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedLocationName = useMemo(() => {
    return locations.find((l) => l.id === locationId)?.name ?? "Select location";
  }, [locations, locationId]);

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

    return () => {
      alive = false;
    };
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
          created_by_user_id: null, // Myöhemmin API
          description: titleTrim,
          status: "open",
        })
        .select("id")
        .single();

      if (insertRes.error) {
        console.error("complaints insert error:", insertRes.error);
        Alert.alert("Error", "Could not create complaint.");
        return;
      }

      const complaintId = insertRes.data?.id as string | undefined;

      if (complaintId && textTrim.length > 0) {
        const commentRes = await supabase.from("complaint_comments").insert({
          complaint_id: complaintId,
          user_id: null, // API
          comment_text: textTrim,
        });

        if (commentRes.error) {
          console.error("comment insert error:", commentRes.error);
        }
      }

      setTitle("");
      setText("");
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select location</Text>

      {loadingLocations ? (
        <View style={{ paddingVertical: 12 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <Pressable style={styles.dropdownButton} onPress={() => setLocationMenuOpen(true)} disabled={locations.length === 0}>
            <Text style={styles.dropdownButtonText}>{selectedLocationName}</Text>
            <Text style={styles.dropdownChevron}>▾</Text>
          </Pressable>

          <Modal transparent animationType="fade" visible={locationMenuOpen} onRequestClose={() => setLocationMenuOpen(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setLocationMenuOpen(false)}>
              <Pressable style={styles.modalCard} onPress={() => {}}>
                <Text style={styles.modalTitle}>Select location</Text>

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
                        style={[styles.modalItem, selected && styles.modalItemSelected]}
                      >
                        <Text style={[styles.modalItemText, selected && styles.modalItemTextSelected]}>{loc.name}</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Pressable style={styles.modalClose} onPress={() => setLocationMenuOpen(false)}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </Modal>
        </>
      )}

      <Text style={styles.label}>Header</Text>
      <TextInput placeholder="Esim. Tiskikone hajalla" value={title} onChangeText={setTitle} style={styles.input} returnKeyType="done" />

      <Text style={[styles.label, { marginTop: 12 }]}>Description</Text>
      <TextInput placeholder="Describe the issue..." value={text} onChangeText={setText} multiline style={styles.textArea} />

      <Pressable style={[styles.submit, !canSubmit && { opacity: 0.5 }]} disabled={!canSubmit} onPress={onSubmit}>
        <Text style={styles.submitText}>{saving ? "Saving…" : "Submit"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  label: { fontWeight: "600", marginBottom: 8 },

  dropdownButton: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#f7f7f7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: { fontSize: 16 },
  dropdownChevron: { fontSize: 16, opacity: 0.7 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", padding: 16, justifyContent: "center" },
  modalCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#ddd" },
  modalTitle: { fontWeight: "700", marginBottom: 8 },
  modalItem: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10 },
  modalItemSelected: { backgroundColor: "#f0f0f0" },
  modalItemText: { fontSize: 15 },
  modalItemTextSelected: { fontWeight: "700" },
  modalClose: { marginTop: 10, alignItems: "center", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#eee" },
  modalCloseText: { color: "#666", fontWeight: "600" },

  input: { borderWidth: 1, borderColor: "#bbb", borderRadius: 12, padding: 12, backgroundColor: "#f7f7f7" },
  textArea: { borderWidth: 1, borderColor: "#bbb", borderRadius: 12, padding: 12, height: 260, textAlignVertical: "top", backgroundColor: "#f7f7f7" },

  submit: { marginTop: 12, borderWidth: 1, borderColor: "#bbb", borderRadius: 12, paddingVertical: 14, alignItems: "center", backgroundColor: "#f1f1f1" },
  submitText: { fontWeight: "700", fontSize: 16 },
});