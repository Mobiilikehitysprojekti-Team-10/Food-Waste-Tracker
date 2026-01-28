import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";
import { shortText } from "../features/complaints/helpers";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext"; 

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
  const { colors } = useTheme();
  const { t } = useLanguage();

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
      })
      .eq("id", complaint.id);

    setStatusSaving(false);
    if (!res.error) setStatus(next);
  }

  async function onSubmit() {
    if (!complaint?.id) return;
    const text = reply.trim();
    setSaving(true);

    const cRes = await supabase
      .from("complaint_comments")
      .insert({ complaint_id: complaint.id, user_id: null, comment_text: text })
      .select("id,complaint_id,user_id,comment_text,created_at")
      .single();

    setSaving(false);
    if (cRes.data) {
      setComments((prev) => [...prev, cRes.data as ComplaintCommentRow]);
      setReply("");
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {/* Pääkortti */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{t('complaints')} - {locationName}</Text>

          <View style={styles.row}>
            <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.pillText, { color: colors.text }]}>
                {shortText(complaint?.description ?? "No description", 40)}
              </Text>
            </View>
            <Text style={[styles.rightText, { color: colors.secondary }]}>
              {complaint?.created_by_user_id ? `User #${complaint.created_by_user_id.slice(0, 6)}` : "User #-"}
            </Text>
          </View>

          <View style={styles.row}>
            {isManager ? (
              <Pressable
                onPress={toggleStatus}
                disabled={statusSaving || !complaint?.id}
                style={[
                  styles.pill, 
                  isClosed ? styles.pillClosed : styles.pillOpen, 
                  statusSaving && { opacity: 0.6 }
                ]}
              >
                <Text style={[styles.pillText, isClosed ? styles.textClosed : styles.textOpen]}>
                  {t('status')}: {status}
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.pill, isClosed ? styles.pillClosed : styles.pillOpen, { opacity: 0.9 }]}>
                <Text style={[styles.pillText, isClosed ? styles.textClosed : styles.textOpen]}>
                  {t('status')}: {status}
                </Text>
              </View>
            )}
            <Text style={[styles.rightText, { color: colors.secondary }]}>
              #{complaint?.id ? complaint.id.slice(0, 6) : "-"}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('comments')}</Text>

        {commentsLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 10 }} />
        ) : comments.length === 0 ? (
          <Text style={[styles.mutedCenter, { color: colors.secondary }]}>No comments yet.</Text>
        ) : (
          comments.map((c) => (
            <View key={c.id} style={[styles.comment, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.commentText, { color: colors.text }]}>{c.comment_text}</Text>
              <Text style={[styles.commentMeta, { color: colors.secondary }]}>
                {new Date(c.created_at).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Vastausosio */}
      <View style={[styles.composer, { borderTopColor: colors.border }]}>
        <TextInput 
          placeholder="Type here..." 
          placeholderTextColor={colors.secondary}
          value={reply} 
          onChangeText={setReply} 
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

        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtnText, { color: colors.secondary }]}>{t('back')}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  title: { fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "space-between" },
  pill: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, flex: 1, marginRight: 10 },
  pillText: { fontSize: 12 },
  rightText: { width: 110, textAlign: "right", fontSize: 12 },
  pillOpen: { borderColor: "#ff4444", backgroundColor: "rgba(255, 68, 68, 0.1)" },
  pillClosed: { borderColor: "#00c851", backgroundColor: "rgba(0, 200, 81, 0.1)" },
  textOpen: { color: "#ff4444", fontWeight: "700" },
  textClosed: { color: "#00c851", fontWeight: "700" },
  sectionTitle: { fontWeight: "700", marginBottom: 8, marginTop: 4 },
  mutedCenter: { textAlign: "center", marginBottom: 12 },
  comment: { borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 8 },
  commentText: { fontSize: 13 },
  commentMeta: { marginTop: 4, fontSize: 11, textAlign: "right" },
  composer: { borderTopWidth: 1, paddingTop: 10 },
  textArea: { borderWidth: 1, borderRadius: 8, padding: 12, height: 100, textAlignVertical: "top" },
  submit: { marginTop: 12, borderWidth: 1, borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  submitText: { fontWeight: "600" },
  backBtn: { marginTop: 10, alignItems: "center" },
  backBtnText: { fontWeight: "500" },
});