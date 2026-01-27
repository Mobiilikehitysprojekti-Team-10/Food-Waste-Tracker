import React, { useCallback, useContext, useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { shortText } from "../features/complaints/helpers";
import { Routes } from "../navigation/routes";

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
  const isManager = user?.role === "manager";

  const [query, setQuery] = useState(""); // manageri vain
  const [loading, setLoading] = useState(true);

  const [complaints, setComplaints] = useState<ComplaintRow[]>([]);
  const [locationsMap, setLocationsMap] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const locRes = await supabase
        .from("locations")
        .select("id,name,is_active")
        .eq("is_active", true)
        .order("name");

      if (locRes.error) {
        console.error("locations error:", locRes.error);
        setLocationsMap({});
      } else {
        const map: Record<string, string> = {};
        (locRes.data as LocationRow[] | null)?.forEach((l) => (map[l.id] = l.name));
        setLocationsMap(map);
      }

      const cRes = await supabase
        .from("complaints")
        .select("id,location_id,created_by_user_id,description,status,created_at,deleted_at,deleted_by_user_id")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (cRes.error) {
        console.error("complaints error:", cRes.error);
        setComplaints([]);
      } else {
        setComplaints((cRes.data ?? []) as ComplaintRow[]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filtered = useMemo(() => {
    if (!isManager) return complaints;

    const q = query.trim().toLowerCase();
    if (!q) return complaints;

    return complaints.filter((c) => {
      const locName = (locationsMap[c.location_id] ?? "").toLowerCase();
      const desc = (c.description ?? "").toLowerCase();
      const status = (c.status ?? "").toLowerCase();
      return locName.includes(q) || desc.includes(q) || status.includes(q);
    });
  }, [isManager, query, complaints, locationsMap]);

  function openComplaint(c: ComplaintRow) {
    const locationName = locationsMap[c.location_id] ?? `Location #${c.location_id.slice(0, 6)}`;
    navigation.navigate(Routes.ComplaintsReplay, { complaint: c, locationName, isManager });
  }

  function deleteComplaint(c: ComplaintRow) {
    if (!isManager) return;

    Alert.alert("Delete complaint", "Are you sure? This hides it from the list (soft delete).", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const deleterId = (user as any)?.id ?? (user as any)?.user_id ?? null;

          const res = await supabase
            .from("complaints")
            .update({
              deleted_at: new Date().toISOString(),
              deleted_by_user_id: deleterId,
            })
            .eq("id", c.id);

          if (res.error) {
            console.error("delete complaint error:", res.error);
            Alert.alert("Error", "Could not delete complaint.");
            return;
          }

          setComplaints((prev) => prev.filter((x) => x.id !== c.id));
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {isManager && (
        <TextInput placeholder="Search" value={query} onChangeText={setQuery} style={styles.search} />
      )}

      {!isManager && (
        <Pressable style={styles.addBtn} onPress={() => navigation.navigate(Routes.AddComplaint)}>
          <Text style={styles.addBtnText}>Add new complaint</Text>
        </Pressable>
      )}

      <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
        {loading ? (
          <Text style={{ textAlign: "center" }}>Loading…</Text>
        ) : (
          filtered.map((c) => {
            const locationName = locationsMap[c.location_id] ?? `Location #${c.location_id.slice(0, 6)}`;
            const title = shortText(c.description ?? "", 28);

            const status = (c.status ?? "open").toLowerCase();
            const isClosed = status === "closed";

            const createdByLabel = c.created_by_user_id ? `User #${c.created_by_user_id.slice(0, 6)}` : "User #-";

            return (
              <View key={c.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Pressable style={{ flex: 1 }} onPress={() => openComplaint(c)}>
                    <Text style={styles.cardTitle}>Complaint - {locationName}</Text>
                  </Pressable>

                  {isManager ? (
                    <Pressable onPress={() => deleteComplaint(c)} hitSlop={10}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </Pressable>
                  ) : (
                    <Text style={styles.dots}>⋮</Text>
                  )}
                </View>

                <Pressable onPress={() => openComplaint(c)}>
                  <View style={styles.row}>
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{title}</Text>
                    </View>
                    <Text style={styles.rightText}>{createdByLabel}</Text>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.pill, isClosed ? styles.pillClosed : styles.pillOpen]}>
                      <Text style={[styles.pillText, isClosed ? styles.textClosed : styles.textOpen]}>
                        Status: {status}
                      </Text>
                    </View>

                    <Text style={styles.rightText}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : "-"}
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>

      {isManager && <Text style={styles.hint}>Tip: Tap a complaint to reply</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  search: { borderWidth: 1, borderColor: "#bbb", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },

  addBtn: { marginTop: 10, borderWidth: 1, borderColor: "#bbb", borderRadius: 8, paddingVertical: 10, alignItems: "center" },
  addBtnText: { fontWeight: "600" },

  card: { borderWidth: 1, borderColor: "#bbb", borderRadius: 8, padding: 12, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontWeight: "700" },
  dots: { fontSize: 18 },
  deleteText: { fontSize: 12, fontWeight: "700", color: "#b00020" },

  row: { flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "space-between" },
  pill: { borderWidth: 1, borderColor: "#bbb", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, flex: 1, marginRight: 10 },
  pillText: { fontSize: 12 },
  rightText: { width: 110, textAlign: "right", fontSize: 12 },

  pillOpen: { borderColor: "red", backgroundColor: "#ffecec" },
  pillClosed: { borderColor: "green", backgroundColor: "#eaffea" },
  textOpen: { color: "red", fontWeight: "700" },
  textClosed: { color: "green", fontWeight: "700" },

  hint: { textAlign: "center", marginTop: 6, color: "#666" },
});