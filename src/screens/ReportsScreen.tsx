import React from "react";
import { View, Button } from "react-native";

type Props = {
  navigation: { navigate: (route: string, params?: any) => void };
};

export default function ReportsScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
      <View style={{ width: 250 }}>
        <Button
          title="Create Favorite"
          onPress={() => navigation.navigate("ReportsFavorite")}
        />
      </View>
    </View>
  );
}