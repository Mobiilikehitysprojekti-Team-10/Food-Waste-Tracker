import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function ActionRow(props: {
  onCreateFavorite: () => void;
  onCompare: () => void;
}) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={[styles.btn, styles.primary]} onPress={props.onCreateFavorite}>
        <Text style={styles.primaryText}>Create favorite</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={props.onCompare}>
        <Text style={styles.secondaryText}>Compare data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  btn: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: "center" },

  primary: { backgroundColor: "#333" },
  primaryText: { fontSize: 16, fontWeight: "600", color: "#fff" },

  secondary: { backgroundColor: "#333" },
  secondaryText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});