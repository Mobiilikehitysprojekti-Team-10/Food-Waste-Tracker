import React, { useMemo } from "react";
import { Platform, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../../../../../context/ThemeContext";
import { useLanguage } from "../../../../../context/LanguageContext";
import { ThemedSelect } from "../../../../../components/ThemedSelect";

type Location = { id: string; name: string };
type Favorite = { id: string; name: string };

export function SelectionPicker(props: {
  value: string;
  onChange: (v: string) => void;
  locations: Location[];
  favorites: Favorite[];
  placeholder?: string;
}) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  const placeholder =
    props.placeholder ??
    (t("select_location_or_favorite" as any) ?? "Valitse toimipiste tai suosikki");

  // Android: modal-select (teeman mukainen)
  if (Platform.OS === "android") {
    const items = useMemo(() => {
      const locs = props.locations.map((l) => ({
        label: `📍 ${l.name}`,
        value: `loc:${l.id}`,
      }));
      const favs = props.favorites.map((f) => ({
        label: `⭐ ${f.name}`,
        value: `fav:${f.id}`,
      }));
      return [...locs, ...favs];
    }, [props.locations, props.favorites]);

    return (
      <ThemedSelect
        value={props.value}
        onChange={(v) => props.onChange(String(v))}
        items={items}
        placeholder={placeholder}
        title={placeholder}
      />
    );
  }

  // iOS: natiivi Picker (käyttäytyy “oikein” iOS:llä)
  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.border,
        backgroundColor: colors.card,
        overflow: "hidden",
      }}
    >
      <Picker
        selectedValue={props.value}
        onValueChange={(v) => props.onChange(String(v))}
        style={{ color: colors.text }}
      >
        <Picker.Item
          label={placeholder}
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
