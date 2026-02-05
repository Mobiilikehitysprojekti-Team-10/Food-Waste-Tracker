import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext"; 

export function MultiSelectList(props: {
  title: string;
  items: Array<{ id: string; label: string }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const { colors, isDark } = useTheme(); 
  const selectedSet = new Set(props.selectedIds);

  return (
    <View style={styles.block}>
      <Text style={[styles.title, { color: colors.text }]}>{props.title}</Text>

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
            <View style={[
              styles.checkbox, 
              { 
                borderColor: colors.border ?? colors.text,
                backgroundColor: selected ? (colors.primary ?? "#333") : "transparent"
              }
            ]} />
          
            <Text style={[styles.label, { color: colors.text }]}>{it.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: 10, gap: 10 },
  title: { fontSize: 14, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2, 
    borderRadius: 6,
    marginRight: 10,
  },
  label: { fontSize: 16, flex: 1 },
});