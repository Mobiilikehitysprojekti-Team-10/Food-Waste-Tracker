import React from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { WasteType } from "../../domain/types";

export function WasteRow(props: {
  label: string;
  type: WasteType;
  selected: boolean;
  kgText: string;
  onToggle: () => void;
  onKgChange: (t: string) => void;
}) {
  const { label, selected, kgText, onToggle, onKgChange } = props;

  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.leftPressArea} onPress={onToggle} hitSlop={10}>
        <View style={[styles.checkbox, selected && styles.checkboxChecked]} />
        <Text style={styles.rowLabel}>{label}</Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.kgInput, !selected && styles.kgInputDisabled]}
        value={kgText}
        onChangeText={onKgChange}
        placeholder="0.00"
        keyboardType="decimal-pad"
        editable={selected}
      />
      <Text style={styles.unit}>Kg</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  leftPressArea: { flex: 1, flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  checkbox: { width: 30, height: 30, borderWidth: 1, borderColor: "#333", borderRadius: 3, marginRight: 10 },
  checkboxChecked: { backgroundColor: "#333" },
  rowLabel: { flex: 1, fontSize: 20 },
  kgInput: { width: 80, borderWidth: 1, borderColor: "#333", borderRadius: 6, paddingVertical: 6, paddingHorizontal: 8, textAlign: "right", marginLeft: 8, fontSize: 18 },
  kgInputDisabled: { opacity: 0.4 },
  unit: { width: 28, marginLeft: 8, fontSize: 18 },
});
