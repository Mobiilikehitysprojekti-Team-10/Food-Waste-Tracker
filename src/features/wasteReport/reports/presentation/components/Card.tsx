import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";

export function Card(props: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
return (
    <View style={[
      styles.card, 
      { backgroundColor: colors.card, borderColor: colors.border }
    ]}>
      {(props.title || props.subtitle) && (
        <View style={styles.header}>
          {!!props.title && (
            <Text style={[styles.title, { color: colors.text }]}>
              {props.title}
            </Text>
          )}
          {!!props.subtitle && (
            <Text style={[styles.subtitle, { color: colors.secondary || "#666" }]}>
              {props.subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={styles.body}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  header: { marginBottom: 10, gap: 2 },
  title: { fontSize: 16, fontWeight: "800" },
  subtitle: { fontSize: 13, color: "#666", fontWeight: "600" },
  body: { gap: 10 },
});
