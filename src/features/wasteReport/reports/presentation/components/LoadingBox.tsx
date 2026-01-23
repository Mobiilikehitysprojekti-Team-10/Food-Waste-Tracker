import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function LoadingBox(props: { text?: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{props.text ?? "Loading..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  text: { fontSize: 14, fontWeight: "600", color: "#333" },
});
