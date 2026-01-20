import React from "react";
import { View, Button, StyleSheet } from "react-native";

export default function ReportsFavoriteScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button title="Submit" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  button: {
    width: 250,
  },
});