import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function FavoriteDeleteButton(props: {
  visible: boolean;
  onConfirmDelete: () => Promise<void> | void;
}) {
  if (!props.visible) return null;

  const onPress = () => {
    Alert.alert(
      "Remove from favorites list",
      "Are you sure you want to delete this favorite list? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => props.onConfirmDelete(),
        },
      ]
    );
  };

  return (
    <View style={styles.wrap}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.text}>Remove from favorites list</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 10, alignItems: "center" },
  text: { color: "red", fontWeight: "600" },
});
