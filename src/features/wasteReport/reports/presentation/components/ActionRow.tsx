import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";
import { useLanguage } from "../../../../../context/LanguageContext";

export function ActionRow(props: {
  onCreateFavorite: () => void;
  onCompare: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={styles.row}>
      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: colors.primary }]} 
        onPress={props.onCreateFavorite}
      >
        <Text style={styles.btnText}>
          {t('create_favorite') ?? "Create favorite"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]} 
        onPress={props.onCompare}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>
          {t('compare_data') ?? "Compare data"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  btn: { 
    flex: 1, 
    borderRadius: 10, 
    paddingVertical: 12, 
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: "#fff" 
  },
});