import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../../context/ThemeContext";

export function CompareLegend(props: { aLabel: string; bLabel: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>A: {props.aLabel}</Text>
      <Text style={[styles.text, { color: colors.textSecondary }]}>B: {props.bLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
  },
});
