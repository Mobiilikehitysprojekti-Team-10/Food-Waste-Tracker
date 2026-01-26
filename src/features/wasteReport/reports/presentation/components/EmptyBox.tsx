import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function EmptyBox(props: { text?: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{props.text ?? "No data for selection."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  text: { fontSize: 14, color: "#666" },
});
