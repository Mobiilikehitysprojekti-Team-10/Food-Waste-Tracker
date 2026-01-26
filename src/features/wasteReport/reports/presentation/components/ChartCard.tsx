import React from "react";
import { Pressable } from "react-native";
import { Card } from "./Card";
import { SimpleBarChart } from "./SimpleBarChart";

export function ChartCard(props: {
  title: string;
  subtitle?: string;
  data: Array<{ label: string; value: number }>;
  onPressChart: () => void;
}) {
  return (
    <Card title={props.title} subtitle={props.subtitle}>
      <Pressable onPress={props.onPressChart}>
        <SimpleBarChart data={props.data} height={190} barWidth={32} />
      </Pressable>
    </Card>
  );
}
