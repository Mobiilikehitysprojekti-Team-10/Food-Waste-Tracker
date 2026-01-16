import { View, Text, Button, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const { loginAsManager, loginAsEmployee } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Waste Tracker</Text>

      <Button title="Kirjaudu esihenkilönä" onPress={loginAsManager} />
      <View style={{ height: 10 }} />
      <Button title="Kirjaudu työntekijänä" onPress={loginAsEmployee} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
});
