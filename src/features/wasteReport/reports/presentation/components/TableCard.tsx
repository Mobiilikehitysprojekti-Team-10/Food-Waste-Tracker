import React from "react";
import { Card } from "./Card";
import { TotalsTable } from "./TotalsTable";

export function TableCard(props: {
  title: string;
  subtitle?: string;
  rows: Array<{ label: string; value: number }>;
  showEmpty?: boolean;
  emptyText?: string;
  footer?: React.ReactNode;
}) {
  return (
    <Card title={props.title} subtitle={props.subtitle}>
      <TotalsTable rows={props.rows} showEmpty={props.showEmpty} emptyText={props.emptyText} />
      {props.footer}
    </Card>
  );
}
