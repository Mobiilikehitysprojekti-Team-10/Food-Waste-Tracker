import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ComparePreset } from "../../domain/presets";

export function PresetPicker(props: {
  value: string;
  onChange: (id: string) => void;
  presets: ComparePreset[];
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>Time period</Text>
      <View style={styles.wrap}>
        <Picker selectedValue={props.value} onValueChange={(v) => props.onChange(String(v))}>
          {props.presets.map((p) => (
            <Picker.Item key={p.id} label={p.title} value={p.id} />
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
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
});
