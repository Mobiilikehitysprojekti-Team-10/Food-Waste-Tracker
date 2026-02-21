import React, { useMemo } from "react";
import { Platform, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../../../../../../context/ThemeContext";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { ThemedSelect } from "../../../../../../components/ThemedSelect";

type Preset = { id: string; title: string };

export function PresetPicker(props: {
  value: string;
  onChange: (id: string) => void;
  presets: Preset[];
}) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  const tr = (key: any, fallback: string) => {
    const v = t(key);
    return v && v !== key ? String(v) : fallback;
  };

  const placeholder = tr("time_period", "Time period");

  if (Platform.OS === "android") {
    const items = useMemo(
      () =>
        props.presets.map((p) => ({
          label:
            p.id === "prevWeek_vs_thisWeek"
              ? tr("preset_prevWeek_vs_thisWeek", p.title)
              : p.id === "prevMonth_vs_thisMonth"
              ? tr("preset_prevMonth_vs_thisMonth", p.title)

              : p.id === "custom"
                ? tr("preset_custom", p.title)
                : p.title,
          value: p.id,
        })),
      [props.presets, t]
    );

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
        {props.presets.map((p) => (
          <Picker.Item
            key={p.id}
            label={
              p.id === "prevWeek_vs_thisWeek"
                ? tr("preset_prevWeek_vs_thisWeek", p.title)
                : p.id === "prevMonth_vs_thisWeek"
                ? "Kuukausi: edellinen vs nykyinen"
                : p.id === "custom"
                  ? tr("preset_custom", p.title)
                  : p.title
            }
            value={p.id}
            color={isDark ? "#FFFFFF" : "#000000"}
          />
        ))}
      </Picker>
    </View>
  );
}