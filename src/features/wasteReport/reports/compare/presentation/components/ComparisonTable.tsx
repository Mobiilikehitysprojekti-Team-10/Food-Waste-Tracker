import React from "react";
import { StyleSheet, Text, View } from "react-native";

function pctText(a: number, diff: number) {
  if (!Number.isFinite(a) || a === 0) return "—";
  const pct = (diff / a) * 100;
  return `${pct.toFixed(1)}%`;
}

export function ComparisonTable(props: {
  rows: Array<{ label: string; a: number; b: number; diff: number }>;
  aLabel: string;
  bLabel: string;
}) {
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.headerCell]}>Type</Text>
        <Text style={[styles.cell, styles.headerCell]}>A</Text>
        <Text style={[styles.cell, styles.headerCell]}>B</Text>
        <Text style={[styles.cell, styles.headerCell]}>kg</Text>
        <Text style={[styles.cell, styles.headerCell]}>%</Text>
      </View>

      {props.rows.map((r, i) => {
        const diffStyle = r.diff > 0 ? styles.pos : r.diff < 0 ? styles.neg : null;

        return (
          <View key={i} style={styles.row}>
            <Text style={styles.cell}>{r.label}</Text>
            <Text style={styles.cell}>{r.a.toFixed(1)}</Text>
            <Text style={styles.cell}>{r.b.toFixed(1)}</Text>
            <Text style={[styles.cell, diffStyle]}>{r.diff.toFixed(1)}</Text>
            <Text style={[styles.cell, diffStyle]}>{pctText(r.a, r.diff)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 12,
  },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#eee" },
  header: { backgroundColor: "#eee" },
  cell: { flex: 1, padding: 10 },
  headerCell: { fontWeight: "700" },
  pos: { color: "green", fontWeight: "700" },
  neg: { color: "red", fontWeight: "700" },
});
