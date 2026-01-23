import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function MultiSelectList(props: {
  title: string;
  items: Array<{ id: string; label: string }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const selectedSet = new Set(props.selectedIds);

  return (
    <View style={styles.block}>
      <Text style={styles.title}>{props.title}</Text>

      {props.items.map((it) => {
        const selected = selectedSet.has(it.id);
        return (
          <TouchableOpacity
            key={it.id}
            onPress={() => props.onToggle(it.id)}
            style={styles.row}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
          >
            <View style={[styles.checkbox, selected && styles.checkboxChecked]} />
            <Text style={styles.label}>{it.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: 10, gap: 10 },
  title: { fontSize: 14, fontWeight: "700" },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxChecked: { backgroundColor: "#333" },
  label: { fontSize: 16, flex: 1 },
});