import React from "react";
import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

export function SelectionPicker(props: {
  value: string;
  onChange: (v: string) => void;
  locations: Array<{ id: string; name: string }>;
  favorites: Array<{ id: string; name: string }>;
  placeholder?: string;
}) {
  return (
  <View style={styles.wrap}>
    <Picker
      selectedValue={props.value}
      onValueChange={(v) => props.onChange(String(v))}
    >
      <Picker.Item
        label={props.placeholder ?? "Select location"}
        value=""
      />

      {props.locations.map((l) => (
        <Picker.Item
          key={`loc:${l.id}`}
          label={`📍 ${l.name}`}
          value={`loc:${l.id}`}
        />
      ))}

      {props.favorites.map((f) => (
        <Picker.Item
          key={`fav:${f.id}`}
          label={`⭐ ${f.name}`}
          value={`fav:${f.id}`}
        />
      ))}
    </Picker>
  </View>
);

}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
});