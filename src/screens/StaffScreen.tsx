import React from "react";
import { View, Text, Button } from "react-native";


type Props = {
  navigation: { navigate: (route: string, params?: any) => void };
};

export default function StaffScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Staff</Text>
      <Button title="Edit Staff" onPress={() => navigation.navigate("StaffEdit")} />
    </View>
  );
}