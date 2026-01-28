import React, { useCallback, useContext, useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { shortText } from "../features/complaints/helpers";
import { Routes } from "../navigation/routes";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

type Props = {
  navigation: { navigate: (route: string, params?: any) => void };
};

type ComplaintRow = {
  id: string;
  location_id: string;
  created_by_user_id: string | null;
  description: string;
  status: "open" | "closed" | null;
  created_at: string;
  deleted_at: string | null;
  deleted_by_user_id: string | null;
};

type LocationRow = {
  id: string;
  name: string;
  is_active: boolean;
};

export default function ComplaintsScreen({ navigation }: Props) {
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  const isManager = user?.role === "manager";
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<ComplaintRow[]>([]);
  const [locationsMap, setLocationsMap] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const locRes = await supabase.from("locations").select("id,name,is_active").eq("is_active", true).order("name");
      if (!locRes.error) {
        const map: Record<string, string> = {};
        (locRes.data as LocationRow[] | null)?.forEach((l) => (map[l.id] = l.name));
        setLocationsMap(map);
      }

      const cRes = await supabase.from("complaints").select("*").is("deleted_at", null).order("created_at", { ascending: false });
      if (!cRes.error) {
        setComplaints((cRes.data ?? []) as ComplaintRow[]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = useMemo(() => {
    if (!isManager || !query.trim()) return complaints;
    const q = query.trim().toLowerCase();
    return complaints.filter((c) => {
      const locName = (locationsMap[c.location_id] ?? "").toLowerCase();
      const desc = (c.description ?? "").toLowerCase();
      const status = (c.status ?? "").toLowerCase();
      return locName.includes(q) || desc.includes(q) || status.includes(q);
    });
  }, [isManager, query, complaints, locationsMap]);

  function deleteComplaint(c: ComplaintRow) {
    Alert.alert(t('delete'), "Are you sure?", [
      { text: t('cancel'), style: "cancel" },
      {
        text: t('delete'),
        style: "destructive",
        onPress: async () => {
          const res = await supabase.from("complaints").update({
            deleted_at: new Date().toISOString(),
            deleted_by_user_id: (user as any)?.id ?? null,
          }).eq("id", c.id);
          if (!res.error) setComplaints((prev) => prev.filter((x) => x.id !== c.id));
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isManager ? (
        <TextInput 
          placeholder={t('search')} 
          placeholderTextColor={colors.secondary}
          value={query} 
          onChangeText={setQuery} 
          style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} 
        />
      ) : (
        <Pressable 
          style={[styles.addBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]} 
          onPress={() => navigation.navigate(Routes.AddComplaint)}
        >
          <Text style={[styles.addBtnText, { color: '#fff' }]}>{t('add_new_complaint')}</Text>
        </Pressable>
      )}

      <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          filtered.map((c) => {
            const locationName = locationsMap[c.location_id] ?? `Location #${c.location_id.slice(0, 6)}`;
            const status = (c.status ?? "open").toLowerCase();
            const isClosed = status === "closed";

            return (
              <View key={c.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <Pressable style={{ flex: 1 }} onPress={() => navigation.navigate(Routes.ComplaintsReplay, { complaint: c, locationName, isManager })}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{t('complaints')} - {locationName}</Text>
                  </Pressable>
                  {isManager && (
                    <Pressable onPress={() => deleteComplaint(c)} hitSlop={10}>
                      <Text style={styles.deleteText}>{t('delete')}</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.row}>
                  <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.pillText, { color: colors.text }]}>{shortText(c.description, 28)}</Text>
                  </View>
                  <Text style={[styles.rightText, { color: colors.secondary }]}>
                    {c.created_by_user_id ? `User #${c.created_by_user_id.slice(0, 6)}` : "User #-"}
                  </Text>
                </View>

                <View style={styles.row}>
                  <View style={[styles.pill, isClosed ? styles.pillClosed : styles.pillOpen]}>
                    <Text style={[styles.pillText, isClosed ? styles.textClosed : styles.textOpen]}>
                      {t('status')}: {status}
                    </Text>
                  </View>
                  <Text style={[styles.rightText, { color: colors.secondary }]}>
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : "-"}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  search: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  addBtn: { borderWidth: 1, borderRadius: 8, paddingVertical: 12, alignItems: "center", marginBottom: 10 },
  addBtnText: { fontWeight: "700", fontSize: 16 },
  card: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontWeight: "700" },
  deleteText: { fontSize: 12, fontWeight: "700", color: "#ff4444" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "space-between" },
  pill: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, flex: 1, marginRight: 10 },
  pillText: { fontSize: 12 },
  rightText: { width: 100, textAlign: "right", fontSize: 11 },
  pillOpen: { borderColor: "#ff4444", backgroundColor: "rgba(255, 68, 68, 0.1)" },
  pillClosed: { borderColor: "#00c851", backgroundColor: "rgba(0, 200, 81, 0.1)" },
  textOpen: { color: "#ff4444", fontWeight: "700" },
  textClosed: { color: "#00c851", fontWeight: "700" },
});