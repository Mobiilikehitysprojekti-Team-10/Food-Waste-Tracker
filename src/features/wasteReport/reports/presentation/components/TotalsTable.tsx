import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function TotalsTable(props: {
  rows: Array<{ label: string; value: number }>;
  emptyText?: string;
  showEmpty?: boolean;
}) {
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.headerCell]}>Waste Type</Text>
        <Text style={[styles.cell, styles.headerCell]}>Total (kg)</Text>
      </View>

      {props.rows.map((r, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.cell}>{r.label}</Text>
          <Text style={styles.cell}>{r.value.toFixed(2)} kg</Text>
        </View>
      ))}

      {props.showEmpty && props.rows.length === 0 && (
        <Text style={styles.emptyText}>{props.emptyText ?? "No data"}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#eee" },
  header: { backgroundColor: "#eee" },
  cell: { flex: 1, padding: 10 },
  headerCell: { fontWeight: "700" },
  emptyText: { textAlign: "center", padding: 16, color: "#999" },
});