import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function WeekHeader(props: { label: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{props.label}</Text>
      {!!props.subtitle && <Text style={styles.sub}>{props.subtitle}</Text>}
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
    color: "#666",
    fontWeight: "600",
  },
});
