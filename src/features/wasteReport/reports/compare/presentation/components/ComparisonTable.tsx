import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../../context/ThemeContext";

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
  const { colors } = useTheme();
  return (
    <View style={[styles.table, { borderColor: colors.border }]}>
      <View style={[styles.row, styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cell, styles.headerCell, { color: colors.text }]}>Type</Text>
        <Text style={[styles.cell, styles.headerCell, { color: colors.text }]}>A</Text>
        <Text style={[styles.cell, styles.headerCell, { color: colors.text }]}>B</Text>
        <Text style={[styles.cell, styles.headerCell, { color: colors.text }]}>kg</Text>
        <Text style={[styles.cell, styles.headerCell, { color: colors.text }]}>%</Text>
      </View>

      {props.rows.map((r, i) => {
        const diffStyle = r.diff > 0 ? { color: colors.success, fontWeight: "700" } : r.diff < 0 ? { color: colors.error, fontWeight: "700" } : null;

        return (
          <View key={i} style={[styles.row, { borderColor: colors.border }]}>
            <Text style={[styles.cell, { color: colors.text }]}>{r.label}</Text>
            <Text style={[styles.cell, { color: colors.text }]}>{r.a.toFixed(1)}</Text>
            <Text style={[styles.cell, { color: colors.text }]}>{r.b.toFixed(1)}</Text>
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
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 12,
  },
  row: { flexDirection: "row", borderBottomWidth: 1 },
  header: { },
  cell: { flex: 1, padding: 10 },
  headerCell: { fontWeight: "700" },
});
