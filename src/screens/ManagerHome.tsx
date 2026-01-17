import { View, Text, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

type Props = {
  navigation: { navigate: (route: string, params?: any) => void };
};

export default function ManagerHome({ navigation }: Props) {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ padding: 20 }}>

      <Button title="Reports" onPress={() => navigation.navigate("Reports")} />
      <Button title="Complaints" onPress={() => navigation.navigate("Complaints")} />
      <Button title="Staff" onPress={() => navigation.navigate("Staff")} />
      <Button title="Menu" onPress={() => navigation.navigate("Menu")} />
      <Button title="Settings" onPress={() => navigation.navigate("Settings")} />

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={logout} />
      </View>
    </View>
  );
}