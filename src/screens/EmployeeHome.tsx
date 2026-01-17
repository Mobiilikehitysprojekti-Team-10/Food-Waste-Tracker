import { View, Text, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

type Props = {
  navigation: { navigate: (route: string, params?: any) => void };
};

export default function EmployeeHome({ navigation }: Props) {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ padding: 20 }}>

      <Button title="Waste Report" onPress={() => navigation.navigate("WasteReport")} />
      <Button title="Complaints" onPress={() => navigation.navigate("Complaints")} />
      <Button title="Menu" onPress={() => navigation.navigate("Menu")} />
      <Button title="Settings" onPress={() => navigation.navigate("Settings")} />

      <Text style={{ marginVertical: 20 }}>
        Quick stats: Reported waste during the week: 900kg
        Quick notes: Muista pakastimen tyhjennys
      </Text>

      <Button title="Logout" color="red" onPress={logout} />
    </View>
  );
}
