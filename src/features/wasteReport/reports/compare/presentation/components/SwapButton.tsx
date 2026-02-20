import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../../../context/ThemeContext";
import { useLanguage } from "../../../../../../context/LanguageContext";

export function SwapButton(props: { onPress: () => void }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  return (
    <TouchableOpacity style={[styles.btn, { borderColor: colors.border }]} onPress={props.onPress}>
      <Text style={[styles.text, { color: colors.text }]}>{t("swap_a_b") ?? "Swap A ↔ B"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  text: { fontSize: 14, fontWeight: "700" },
});
