import React, { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../navigation/routes";

type Row = {
    id: string;
    title: string;
    body: string;
    type: string;
    data: any;
    read_at: string | null;
    created_at: string;
};

export default function NotificationsScreen() {
    const { user } = useContext(AuthContext);
    const { colors } = useTheme();
    const navigation: any = useNavigation();

    const [rows, setRows] = useState<Row[]>([]);

    async function load() {
        if (!user?.id) return;

        const { data, error } = await supabase
            .from("notifications")
            .select("id,title,body,type,data,read_at,created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(100);

        if (!error) setRows((data ?? []) as any);
    }

    async function markRead(id: string) {
        const ts = new Date().toISOString();
        await supabase.from("notifications").update({ read_at: ts }).eq("id", id);
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, read_at: ts } : r)));
    }
    async function clearAll() {
        if (!user?.id) return;

        Alert.alert(
            "Tyhjennä kaikki?",
            "Tämä poistaa kaikki ilmoitukset myös tietokannasta.",
            [
                { text: "Peru", style: "cancel" },
                {
                    text: "Poista",
                    style: "destructive",
                    onPress: async () => {
                        const { error } = await supabase
                            .from("notifications")
                            .delete()
                            .eq("user_id", user.id);

                        if (error) {
                            Alert.alert("Error", "Could not delete notifications.");
                            return;
                        }

                        setRows([]);
                    },
                },
            ]
        );
    }

    async function openFromNotification(item: Row) {
        await markRead(item.id);
        const complaintId = item?.data?.complaintId;
        if (!complaintId) return;

        // Hae complaint
        const { data: complaint, error: cErr } = await supabase
            .from("complaints")
            .select("id, location_id, created_by_user_id, description, status, created_at")
            .eq("id", complaintId)
            .single();

        if (cErr || !complaint) {
            console.log("[notif] complaint fetch failed", cErr);
            return;
        }

        // Location name
        let locationName = "Unknown location";
        if (complaint.location_id) {
            const { data: loc } = await supabase
                .from("locations")
                .select("name")
                .eq("id", complaint.location_id)
                .single();
            if (loc?.name) locationName = loc.name;
        }

        const isManager = user?.role === "manager";

        navigation.navigate(Routes.ComplaintsReplay, {
            complaint,
            locationName,
            isManager,
        });
    }

    function isUnread(item: Row) {
        return !item.read_at;
    }

    useEffect(() => {
        load();
    }, [user?.id]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Ilmoitukset</Text>

            <FlatList
                data={rows}
                keyExtractor={(x) => x.id}
                contentContainerStyle={{ paddingBottom: 30 }}
                renderItem={({ item }) => {
                    const unread = isUnread(item);

                    return (
                        <Pressable
                            onPress={() => openFromNotification(item)}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: unread ? colors.primary : colors.border,
                                    opacity: unread ? 1 : 0.6,
                                },
                            ]}
                        >
                            <View style={styles.row}>
                                <Text
                                    style={{
                                        fontWeight: unread ? "900" : "700",
                                        color: colors.text,
                                        flex: 1,
                                    }}
                                >
                                    {item.title}
                                </Text>

                                {unread ? (
                                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.badgeText}>UUSI</Text>
                                    </View>
                                ) : (
                                    <Text style={{ fontSize: 12, opacity: 0.7, color: colors.text }}>
                                        Luettu
                                    </Text>
                                )}
                            </View>

                            <Text style={{ marginTop: 6, color: colors.text }}>{item.body}</Text>

                            {item?.data?.complaintId ? (
                                <Text
                                    style={{
                                        marginTop: 8,
                                        fontSize: 12,
                                        opacity: 0.8,
                                        color: colors.text,
                                    }}
                                >
                                    Avaa complaint →
                                </Text>
                            ) : null}

                            <Text
                                style={{
                                    marginTop: 6,
                                    fontSize: 12,
                                    opacity: 0.7,
                                    color: colors.text,
                                }}
                            >
                                {new Date(item.created_at).toLocaleString()}
                            </Text>
                        </Pressable>
                    );
                }}
            />
            <Pressable
                onPress={clearAll}
                style={[
                    styles.clearBtn,
                    rows.length === 0 && { opacity: 0.4 },
                ]}
                disabled={rows.length === 0}
            >
                <Text style={styles.clearText}>Tyhjennä kaikki</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: "800", marginBottom: 12 },
    card: { padding: 14, borderWidth: 1, borderRadius: 14, marginBottom: 10 },

    clearBtn: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        borderColor: "#E5484D",
        backgroundColor: "rgba(229, 72, 77, 0.12)",
    },
    clearText: {
        color: "#E5484D",
        fontWeight: "800",
        fontSize: 15,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    badgeText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 12,
    },
});