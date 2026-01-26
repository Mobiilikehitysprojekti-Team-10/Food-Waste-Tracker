import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

function getStep(maxVal: number): number {
  if (maxVal <= 100) return 10;
  if (maxVal <= 1000) return 25;
  return 100;
}

function roundUpAxisMax(maxVal: number, step: number): number {
  if (maxVal <= 0) return step;
  return Math.ceil(maxVal / step) * step;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function DashedLine({ width }: { width: number }) {
  const dash = 6;
  const gap = 4;
  const count = Math.max(1, Math.floor(width / (dash + gap)));

  return (
    <View style={styles.dashRow}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.dashSeg} />
      ))}
    </View>
  );
}

export function SimpleBarChart(props: {
  data: Array<{ label: string; value: number }>;
  height?: number;
  barWidth?: number;
}) {
  const height = props.height ?? 200;

  const paddingTop = 10;
  const paddingBottom = 10;
  const paddingLeft = 44;
  const paddingRight = 10;

  const xLabelRowHeight = 22;

  const barAreaHeight = Math.max(
    40,
    height - paddingTop - paddingBottom - xLabelRowHeight
  );

  const { step, axisMax, ticks } = useMemo(() => {
    const maxVal = Math.max(0, ...props.data.map((d) => Number(d.value ?? 0)));
    const s = getStep(maxVal);
    const maxAxis = roundUpAxisMax(maxVal, s);

    const t: number[] = [];
    for (let v = 0; v <= maxAxis; v += s) t.push(v);

    return { step: s, axisMax: maxAxis, ticks: t };
  }, [props.data]);

  const barWidth = props.barWidth ?? 36;
  const spacing = 12;
  const contentWidth = Math.max(1, props.data.length) * (barWidth + spacing);

  const tickCount = ticks.length;
  const denom = tickCount > 1 ? tickCount - 1 : 1;

  const [plotInnerWidth, setPlotInnerWidth] = useState(0);

 
  const tickLabelHeight = 14;

  return (
    <View style={styles.wrap}>
      {/* PLOT */}
      <View
        style={[
          styles.plot,
          { height, paddingTop, paddingBottom, paddingLeft, paddingRight },
        ]}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          const inner = Math.max(0, w - paddingLeft - paddingRight);
          setPlotInnerWidth(inner);
        }}
      >
        {/* GRID + Y LABELS (taustalle) */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {ticks
            .slice()
            .reverse()
            .map((v, idx) => {
              const y = paddingTop + idx * (barAreaHeight / denom);
              const isZero = v === 0;

              const labelTopAbs = clamp(
                y - tickLabelHeight / 2,
                0,
                height - tickLabelHeight
              );

              return (
                <View
                  key={v}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: y,
                  }}
                >
                  {/* katkoviiva taustalle */}
                  {isZero ? (
                    <View
                      style={[
                        styles.zeroLine,
                        { left: paddingLeft, right: paddingRight },
                      ]}
                    />
                  ) : (
                    <View
                      style={[
                        styles.dashLineWrap,
                        { left: paddingLeft, right: paddingRight },
                      ]}
                    >
                      <DashedLine width={plotInnerWidth} />
                    </View>
                  )}

                  {}
                  <Text
                    style={[
                      styles.tickLabelInside,
                      { top: labelTopAbs - y },
                    ]}
                  >
                    {v}
                  </Text>
                </View>
              );
            })}
        </View>

        {}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.columnsRow, { width: contentWidth }]}>
            {props.data.map((d) => {
              const val = Number(d.value ?? 0);
              const barHeight =
                axisMax > 0 ? Math.round((val / axisMax) * barAreaHeight) : 0;

              return (
                <View
                  key={d.label}
                  style={[styles.column, { width: barWidth, marginRight: spacing }]}
                >
                  {}
                  <View style={[styles.barArea, { height: barAreaHeight }]}>
                    <View style={[styles.bar, { height: barHeight }]} />
                  </View>

                  {}
                  <View style={[styles.xLabelArea, { height: xLabelRowHeight }]}>
                    <Text numberOfLines={1} style={styles.xLabel}>
                      {d.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <Text style={styles.stepHint}>Scale in: {step} kg increments</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 10 },

  plot: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },

  dashLineWrap: {
    position: "absolute",
    height: 1,
  },
  dashRow: {
    flexDirection: "row",
  },
  dashSeg: {
    width: 6,
    height: 1,
    marginRight: 4,
    backgroundColor: "#d0d0d0",
  },

  zeroLine: {
    position: "absolute",
    height: 1.5,
    backgroundColor: "#a9a9a9",
  },

  tickLabelInside: {
    position: "absolute",
    left: 6,
    fontSize: 12,
    color: "#444",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 4,
    borderRadius: 4,
  },

  columnsRow: {
    flexDirection: "row",
  },
  column: {
    alignItems: "center",
  },

  barArea: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bar: {
    width: "70%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d2d2d",
  },

  xLabelArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  xLabel: {
    fontSize: 12,
    width: "100%",
    textAlign: "center",
  },

  stepHint: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
});


