import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../../../../../context/ThemeContext";
import { useLanguage } from "../../../../../context/LanguageContext";

export function SelectionPicker(props: {
  value: string;
  onChange: (v: string) => void;
  locations: Array<{ id: string; name: string }>;
  favorites: Array<{ id: string; name: string }>;
  placeholder?: string;
}) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  const textColor = colors.text;
  const pickerBg = colors.card;

  return (
    <View style={[
      styles.wrap, 
      { 
        borderColor: colors.border, 
        backgroundColor: pickerBg 
      }
    ]}>
      <Picker
        selectedValue={props.value}
        onValueChange={(v) => props.onChange(String(v))}
        style={{ color: textColor, backgroundColor: pickerBg }}
        dropdownIconColor={textColor}
        mode="dropdown"
      >
        <Picker.Item
          label={props.placeholder ?? t('select_location' as any) ?? "Select location"}
          value=""
          color={isDark ? "#FFFFFF" : "#000000"} 
        />

        {props.locations.map((l) => (
          <Picker.Item
            key={`loc:${l.id}`}
            label={`📍 ${l.name}`}
            value={`loc:${l.id}`}
            color={isDark ? "#FFFFFF" : "#000000"}
          />
        ))}

        {props.favorites.map((f) => (
          <Picker.Item
            key={`fav:${f.id}`}
            label={`⭐ ${f.name}`}
            value={`fav:${f.id}`}
            color={isDark ? "#FFFFFF" : "#000000"}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center", 
    ...Platform.select({
      ios: {
        paddingVertical: 4, 
      },
      android: {
        height: 55, 
      }
    })
  },
});