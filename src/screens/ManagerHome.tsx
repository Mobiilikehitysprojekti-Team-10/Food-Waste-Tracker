import { View, Text, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ManagerHome() {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Esihenkilö</Text>

      <Button title="Reports" onPress={() => {}} />
      <Button title="Complaints" onPress={() => {}} />
      <Button title="Staff" onPress={() => {}} />
      <Button title="Menu" onPress={() => {}} />
      <Button title="Settings" onPress={() => {}} />

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={logout} />
      </View>
    </View>
  );
}
