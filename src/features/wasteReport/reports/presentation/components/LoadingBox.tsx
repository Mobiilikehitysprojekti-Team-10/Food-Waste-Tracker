import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";
import { useLanguage } from "../../../../../context/LanguageContext"; 

export function LoadingBox(props: { text?: string }) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[
      styles.box, 
      { backgroundColor: colors.card, borderColor: colors.border }
    ]}>
      <Text style={[styles.text, { color: colors.text }]}>
        {props.text ?? t('loading' as any) ?? "Loading..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60, 
  },
  text: { 
    fontSize: 14, 
    fontWeight: "600" 
  },
});