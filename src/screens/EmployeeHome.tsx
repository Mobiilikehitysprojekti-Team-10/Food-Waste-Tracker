import { View, Text, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function EmployeeHome() {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Työntekijä</Text>

      <Button title="Waste Report" onPress={() => {}} />
      <Button title="Complaints" onPress={() => {}} />
      <Button title="Menu" onPress={() => {}} />
      <Button title="Settings" onPress={() => {}} />

      <Text style={{ marginVertical: 20 }}>
        Quick stats: Reported waste during the week: 900kg
        Quick notes: Muista pakastimen tyhjennys
      </Text>

      <Button title="Logout" color="red" onPress={logout} />
    </View>
  );
}
