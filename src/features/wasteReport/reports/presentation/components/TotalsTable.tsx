import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";

export function TotalsTable(props: {
  rows: Array<{ label: string; value: number }>;
  emptyText?: string;
  showEmpty?: boolean;
}) {
  const { colors, isDark } = useTheme();

  // Määritellään värit teeman mukaan
  const headerBg = isDark ? "rgba(255,255,255,0.1)" : "#eee";
  const rowBorder = isDark ? "rgba(255,255,255,0.1)" : "#eee";
  const tableBorder = colors.border || "#ddd";

return (
    <View style={[styles.table, { borderColor: tableBorder }]}>
      {/* Otsikkorivi */}
      <View style={[styles.row, styles.header, { backgroundColor: headerBg, borderColor: rowBorder }]}>
        <Text style={[styles.cell, styles.headerCell, { color: colors.text }]}>Waste Type</Text>
        <Text style={[styles.cell, styles.headerCell, { color: colors.text }]}>Total (kg)</Text>
      </View>

      {/* Tieto-rivit */}
      {props.rows.map((r, i) => (
        <View key={i} style={[styles.row, { borderColor: rowBorder }]}>
          <Text style={[styles.cell, { color: colors.text }]}>{r.label}</Text>
          <Text style={[styles.cell, { color: colors.text }]}>{r.value.toFixed(2)} kg</Text>
        </View>
      ))}

      {/* Tyhjä tila -ilmoitus */}
      {props.showEmpty && props.rows.length === 0 && (
        <Text style={[styles.emptyText, { color: isDark ? "#aaa" : "#999" }]}>
          {props.emptyText ?? "No data"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  row: { flexDirection: "row", borderBottomWidth: 1 },
  header: { /* backgroundColor poistettu tästä */ },
  cell: { flex: 1, padding: 10 },
  headerCell: { fontWeight: "700" },
  emptyText: { textAlign: "center", padding: 16 },
});