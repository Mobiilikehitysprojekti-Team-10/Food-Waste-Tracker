import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext"; 
import { useLanguage } from "../../../../../context/LanguageContext"; 

export function EmptyBox(props: { text?: string }) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[
      styles.box, 
      { backgroundColor: colors.card, borderColor: colors.border }
    ]}>
      <Text style={[styles.text, { color: colors.secondary || "#888" }]}>
        {props.text ?? t('no_comparison_data' as any) ?? "No data found."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20, 
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed", 
  },
  text: { 
    fontSize: 14, 
    textAlign: "center" 
  },
});