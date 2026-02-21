import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "../../../presentation/components/Card";
import { SimpleBarChart } from "../../../presentation/components/SimpleBarChart";

export function CompareChartCard(props: {
  title: string;
  subtitle?: string;
  data: Array<{ label: string; value: number }>;
  onPressChart: () => void;
}) {
  return (
    <Card title={props.title} subtitle={props.subtitle}>
      <Pressable onPress={props.onPressChart} style={styles.press}>
        <SimpleBarChart data={props.data} height={190} barWidth={32} />
      </Pressable>
      <View style={{ height: 6 }} />
      <Text style={styles.hint}>Tap to enlarge</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  press: { width: "100%" },
  hint: { fontSize: 12, color: "#666", textAlign: "center" },
});
