import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";

export function ScreenLayout(props: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <ScrollView 
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {props.title}
      </Text>
      <View style={styles.body}>
        {props.children}
      </View>
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