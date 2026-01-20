import React from "react";
import { View, Button } from "react-native";

type Props = {
  navigation: { navigate: (route: string, params?: any) => void };
};

export default function ComplaintsScreen({ navigation }: Props) {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      {/* Eka nappi väliaikainen */}
      <Button title="Complaints - Replay (Temporary)" onPress={() => navigation.navigate("ComplaintsReplay")}/>
      <Button title="Add New Complaint" onPress={() => navigation.navigate("AddComplaint")}/>
    </View>
  );
}