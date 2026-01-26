import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function SwapButton(props: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={props.onPress}>
      <Text style={styles.text}>Swap A ↔ B</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  text: { fontSize: 14, fontWeight: "700" },
});
