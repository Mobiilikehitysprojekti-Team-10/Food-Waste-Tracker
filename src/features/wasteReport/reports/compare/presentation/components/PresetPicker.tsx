import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ComparePreset } from "../../domain/presets";
import { useTheme } from "../../../../../../context/ThemeContext";

export function PresetPicker(props: {
  value: string;
  onChange: (id: string) => void;
  presets: ComparePreset[];
}) {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.block}>
      <Text style={[styles.label, { color: colors.text }]}>Time period</Text>
      <View style={[styles.wrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Picker
          selectedValue={props.value}
          onValueChange={(v) => props.onChange(String(v))}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
        >
          {props.presets.map((p) => (
            <Picker.Item key={p.id} label={p.title} value={p.id} color={colors.text} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 8, marginTop: 8 },
  label: { fontSize: 14, fontWeight: "700" },
  wrap: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
});
