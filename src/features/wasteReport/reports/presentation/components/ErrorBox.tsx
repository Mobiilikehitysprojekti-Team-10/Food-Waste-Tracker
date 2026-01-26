import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function ErrorBox(props: { title?: string; message: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{props.title ?? "Virhe"}</Text>
      <Text style={styles.message}>{props.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: "#f0b4b4",
    backgroundColor: "#fff5f5",
    borderRadius: 10,
    padding: 12,
  },
  title: { fontSize: 14, fontWeight: "800", marginBottom: 4, color: "#7a1f1f" },
  message: { fontSize: 14, color: "#7a1f1f" },
});
