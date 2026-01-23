import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function ScreenLayout(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.body}>{props.children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  body: {
    gap: 12,
  },
});
