import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function CompareLegend(props: { aLabel: string; bLabel: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>A: {props.aLabel}</Text>
      <Text style={styles.text}>B: {props.bLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  text: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
});
