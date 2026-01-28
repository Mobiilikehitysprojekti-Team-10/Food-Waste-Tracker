import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { supabase } from "../lib/supabase";
import { shortText } from "../features/complaints/helpers";

type ComplaintRow = {
  id: string;
  location_id: string;
  created_by_user_id: string | null;
  description: string;
  status: "open" | "closed" | null;
  created_at: string;
};

type ComplaintCommentRow = {
  id: string;
  complaint_id: string;
  user_id: string | null;
  comment_text: string;
  created_at: string;
};

type Props = {
  navigation: { goBack: () => void };
  route: { params?: { complaint?: ComplaintRow; locationName?: string; isManager?: boolean } };
};

export default function ComplaintsReplay({ navigation, route }: Props) {
  const complaint = route?.params?.complaint;
  const locationName = route?.params?.locationName ?? "Unknown location";
  const isManager = route?.params?.isManager === true;

  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState<string>((complaint?.status ?? "open").toLowerCase());
  const [statusSaving, setStatusSaving] = useState(false);

  const [comments, setComments] = useState<ComplaintCommentRow[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const canSubmit = useMemo(() => reply.trim().length > 0 && !saving, [reply, saving]);
  const isClosed = (status ?? "open").toLowerCase() === "closed";

  const loadComments = useCallback(async () => {
    if (!complaint?.id) return;

    setCommentsLoading(true);

    const res = await supabase
      .from("complaint_comments")
      .select("id,complaint_id,user_id,comment_text,created_at")
      .eq("complaint_id", complaint.id)
      .order("created_at", { ascending: true });

    if (res.error) {
      console.error("comments fetch error:", res.error);
      setComments([]);
    } else {
      setComments((res.data ?? []) as ComplaintCommentRow[]);
    }

    setCommentsLoading(false);
  }, [complaint?.id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  async function toggleStatus() {
    if (!complaint?.id || !isManager) return;

    const current = (status ?? "open").toLowerCase();
    const next = current === "closed" ? "open" : "closed";

    setStatusSaving(true);

    const res = await supabase
      .from("complaints")
      .update({
        status: next,
        resolved_at: next === "closed" ? new Date().toISOString() : null,
        resolved_by_user_id: null, // API
      })
      .eq("id", complaint.id);

    setStatusSaving(false);

    if (res.error) {
      console.error("toggleStatus error:", res.error);
      return;
    }

    setStatus(next);
  }

  async function onSubmit() {
    if (!complaint?.id) return;

    const text = reply.trim();
    if (!text) return;

    setSaving(true);

    const cRes = await supabase
      .from("complaint_comments")
      .insert({ complaint_id: complaint.id, user_id: null, comment_text: text })
      .select("id,complaint_id,user_id,comment_text,created_at")
      .single();

    setSaving(false);

    if (cRes.error) {
      console.error("comment insert error:", cRes.error);
      return;
    }

    if (cRes.data) setComments((prev) => [...prev, cRes.data as ComplaintCommentRow]);
    else await loadComments();

    setReply("");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Complaint - {locationName}</Text>

          <View style={styles.row}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{shortText(complaint?.description ?? "No description", 40)}</Text>
            </View>
            <Text style={styles.rightText}>
              {complaint?.created_by_user_id ? `User #${complaint.created_by_user_id.slice(0, 6)}` : "User #-"}
            </Text>
          </View>

          <View style={styles.row}>
            {isManager ? (
              <Pressable
                onPress={toggleStatus}
                disabled={statusSaving || !complaint?.id}
                style={[styles.pill, isClosed ? styles.pillClosed : styles.pillOpen, statusSaving && { opacity: 0.6 }]}
              >
                <Text style={[styles.pillText, isClosed ? styles.textClosed : styles.textOpen]}>
                  Status: {status} (tap to change)
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.pill, isClosed ? styles.pillClosed : styles.pillOpen, { opacity: 0.9 }]}>
                <Text style={[styles.pillText, isClosed ? styles.textClosed : styles.textOpen]}>Status: {status}</Text>
              </View>
            )}

            <Text style={styles.rightText}>#{complaint?.id ? complaint.id.slice(0, 6) : "-"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Comments</Text>

        {commentsLoading ? (
          <Text style={styles.mutedCenter}>Loading comments…</Text>
        ) : comments.length === 0 ? (
          <Text style={styles.mutedCenter}>No comments yet.</Text>
        ) : (
          comments.map((c) => (
            <View key={c.id} style={styles.comment}>
              <Text style={styles.commentText}>{c.comment_text}</Text>
              <Text style={styles.commentMeta}>{new Date(c.created_at).toLocaleString()}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.composer}>
        <TextInput placeholder="Type here" value={reply} onChangeText={setReply} multiline style={styles.textArea} />

        <Pressable style={[styles.submit, !canSubmit && { opacity: 0.5 }]} disabled={!canSubmit} onPress={onSubmit}>
          <Text style={styles.submitText}>{saving ? "Saving…" : "Submit"}</Text>
        </Pressable>

        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  card: { borderWidth: 1, borderColor: "#bbb", borderRadius: 8, padding: 12, marginBottom: 12 },
  title: { fontWeight: "700" },

  row: { flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "space-between" },

  pill: { borderWidth: 1, borderColor: "#bbb", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, flex: 1, marginRight: 10 },
  pillText: { fontSize: 12 },
  rightText: { width: 110, textAlign: "right", fontSize: 12 },

  pillOpen: { borderColor: "red", backgroundColor: "#ffecec" },
  pillClosed: { borderColor: "green", backgroundColor: "#eaffea" },
  textOpen: { color: "red", fontWeight: "700" },
  textClosed: { color: "green", fontWeight: "700" },

  sectionTitle: { fontWeight: "700", marginBottom: 8, marginTop: 4 },
  mutedCenter: { textAlign: "center", color: "#666", marginBottom: 12 },

  comment: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, padding: 8, marginBottom: 8, backgroundColor: "#fafafa" },
  commentText: { fontSize: 13 },
  commentMeta: { marginTop: 4, fontSize: 11, color: "#666", textAlign: "right" },

  composer: { borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10 },

  textArea: { borderWidth: 1, borderColor: "#bbb", borderRadius: 8, padding: 12, height: 140, textAlignVertical: "top" },

  submit: { marginTop: 12, borderWidth: 1, borderColor: "#bbb", borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  submitText: { fontWeight: "600" },

  backBtn: { marginTop: 10, alignItems: "center" },
  backBtnText: { color: "#666" },
});