import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";

export function WeekHeader(props: { label: string; subtitle?: string }) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {/* Pääteksti teeman värisenä */}
      <Text style={[styles.label, { color: colors.text }]}>
        {props.label}
      </Text>
      
      {/* Alateksti käyttäen secondary-väriä tai vaalennettua tekstiä */}
      {!!props.subtitle && (
        <Text style={[styles.sub, { color: colors.secondary || "#888" }]}>
          {props.subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    // Poistettu kiinteä color: "#666"
  },
});