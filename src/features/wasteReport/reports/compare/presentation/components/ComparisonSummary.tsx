import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

function sum(values: Record<string, number>, keys: string[]) {
  return keys.reduce((acc, k) => acc + Number(values[k] ?? 0), 0);
}

function pctText(aTotal: number, diffTotal: number) {
  if (!Number.isFinite(aTotal) || aTotal === 0) return "—";
  return `${((diffTotal / aTotal) * 100).toFixed(1)}%`;
}

export function ComparisonSummary(props: {
  wasteTypes: string[];
  aTotals: Record<string, number>;
  bTotals: Record<string, number>;
  aLabel: string;
  bLabel: string;
}) {
  const { aTotal, bTotal, diffTotal, diffPct } = useMemo(() => {
    const aTotal = sum(props.aTotals, props.wasteTypes);
    const bTotal = sum(props.bTotals, props.wasteTypes);
    const diffTotal = bTotal - aTotal;
    const diffPct = pctText(aTotal, diffTotal);
    return { aTotal, bTotal, diffTotal, diffPct };
  }, [props.aTotals, props.bTotals, props.wasteTypes]);

  const diffStyle = diffTotal > 0 ? styles.pos : diffTotal < 0 ? styles.neg : null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Totals</Text>

      <View style={styles.row}>
        <Text style={styles.label}>A</Text>
        <Text style={styles.value}>{aTotal.toFixed(1)} kg</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>B</Text>
        <Text style={styles.value}>{bTotal.toFixed(1)} kg</Text>
      </View>

      <View style={[styles.row, styles.divider]}>
        <Text style={styles.label}></Text>
        <Text style={[styles.value, diffStyle]}>
          {diffTotal.toFixed(1)} kg ({diffPct})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  title: { fontSize: 14, fontWeight: "800" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 14, fontWeight: "700" },
  value: { fontSize: 14, fontWeight: "700" },
  divider: { paddingTop: 8, marginTop: 4, borderTopWidth: 1, borderTopColor: "#eee" },
  pos: { color: "green" },
  neg: { color: "red" },
});
