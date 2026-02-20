import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../../context/ThemeContext";

export function GroupedBarChart(props: {
  data: Array<{ label: string; a: number; b: number }>;
  height?: number;
  barWidth?: number;
  innerGap?: number;
  groupGap?: number;
  aLabel?: string;
  bLabel?: string;
}) {
  const { colors } = useTheme();
  const height = props.height ?? 220;
  const xLabelHeight = 22;
  const chartHeight = height + xLabelHeight;
  const barWidth = props.barWidth ?? 14;
  const innerGap = props.innerGap ?? 6;
  const groupGap = props.groupGap ?? 14;

  const maxY = useMemo(() => {
    let m = 0;
    for (const r of props.data) m = Math.max(m, r.a ?? 0, r.b ?? 0);
    return m <= 0 ? 1 : m;
  }, [props.data]);

  // Step logic (10kg up to 100, 25kg >100, 100kg >1000)
  const step = useMemo(() => {
    if (maxY > 1000) return 100;
    if (maxY > 100) return 25;
    return 10;
  }, [maxY]);

  const topTick = useMemo(() => Math.ceil(maxY / step) * step, [maxY, step]);
  const ticks = useMemo(() => {
    const arr: number[] = [];
    for (let v = 0; v <= topTick; v += step) arr.push(v);
    return arr;
  }, [topTick, step]);

  function barH(v: number) {
    const clamped = Math.max(0, v);
    return (clamped / topTick) * height;
  }

  const groupWidth = barWidth * 2 + innerGap;
  const contentWidth = props.data.length * (groupWidth + groupGap);

  const aSwatchColor = colors.primary;
  const bSwatchColor = colors.secondary;
  const barBorderColor = colors.border;

  return (
    <View>
      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: aSwatchColor, borderColor: barBorderColor }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>{props.aLabel ?? "A"}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: bSwatchColor, borderColor: barBorderColor }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>{props.bLabel ?? "B"}</Text>
        </View>
      </View>

      <View style={styles.chartRow}>
        {/* Y-axis labels */}
        <View style={[styles.yAxis, { height: chartHeight }]}>
          {ticks
            .slice()
            .reverse()
            .map((t) => (
              <View key={t} style={styles.yTick}>
                <Text style={[styles.yLabel, { color: colors.text }]}>{t}</Text>
              </View>
            ))}
        </View>

        {/* Chart area with grid + bars */}
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={{ width: Math.max(contentWidth, 1) }}>
            {/* Grid lines */}
            <View style={[styles.gridLayer, { height }]}>
              {ticks.map((t) => {
                const y = height - (t / topTick) * height;
                return <View key={t} style={[styles.gridLine, { top: y, borderColor: colors.border }]} />;
              })}
            </View>

            {/* Bars */}
            <View style={[styles.barsLayer, { height: chartHeight }]}>
              {props.data.map((r, idx) => {
                const left = idx * (groupWidth + groupGap);
                const aH = barH(r.a ?? 0);
                const bH = barH(r.b ?? 0);

                return (
                  <View
                    key={`${r.label}-${idx}`}
                    style={[styles.group, { left, width: groupWidth, bottom: xLabelHeight }]}
                  >
                    <View style={[styles.bar, { width: barWidth, height: aH, backgroundColor: aSwatchColor, borderColor: barBorderColor }]} />
                    <View style={{ width: innerGap }} />
                    <View style={[styles.bar, { width: barWidth, height: bH, backgroundColor: bSwatchColor, borderColor: barBorderColor }]} />

                    <Text style={[styles.xLabel, { bottom: -xLabelHeight + 2, color: colors.text }]} numberOfLines={1}>
                      {r.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginBottom: 8,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  swatch: { width: 14, height: 14, borderRadius: 3, borderWidth: 1 },
  // aSwatch: { backgroundColor: "#999" }, // Handled by component props
  // bSwatch: { backgroundColor: "#333" }, // Handled by component props
  legendText: { fontSize: 12, fontWeight: "700" },

  chartRow: { flexDirection: "row" },

  yAxis: {
    width: 34,
    justifyContent: "space-between",
    paddingRight: 6,
  },
  yTick: { alignItems: "flex-end" },
  yLabel: { fontSize: 10 }, // Handled by component props

  gridLayer: { position: "absolute", left: 0, right: 0 },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: "dashed",
  },

  barsLayer: { height: 220 }, // overwritten inline
  group: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bar: {
    borderRadius: 4,
    borderWidth: 1,
  },
  // aBar: { backgroundColor: "#999" }, // Handled by component props
  // bBar: { backgroundColor: "#333" }, // Handled by component props

  xLabel: {
    position: "absolute",
    left: 0,
    width: "100%",
    textAlign: "center",
    fontSize: 11,
    // color: "#444", // Handled by component props
  },
});
