import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function LoginScreen() {
  const { signIn, loading, authError } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const { colors } = useTheme();
  const { t } = useLanguage();

  const onLogin = async (email: string) => {
    try {
      console.log("[login] pressed", { email });

      if (!password.trim()) {
        Alert.alert('Missing password', 'Enter the test user password.');
        return;
      }
      console.log("[login] calling signIn...");

      await signIn(email, password);
    } catch (e: any) {
      console.log("[login] signIn failed", e);
      Alert.alert('Login failed', e?.message ?? 'Unknown error');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Food Waste Tracker</Text>

      <Text style={[styles.label, { color: colors.text }]}>{t('password') ?? 'Password'}</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={t('password') ?? 'Password'}
        secureTextEntry
        autoCapitalize="none"
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
      />

      <View style={{ height: 18 }} />

      {loading ? (
        <ActivityIndicator />
      ) : null}

      {authError ? (
        <Text style={{ marginTop: 10, color: "red", textAlign: "center" }}>
          {authError}
        </Text>
      ) : null}

      <View style={{ height: 18 }} />

      <TouchableOpacity
        style={[styles.loginBtn, { backgroundColor: colors.primary }]}
        onPress={() => onLogin('manager@test.fi')}
        disabled={loading}
      >
        <Text style={styles.loginBtnText}>{t('login_manager')}</Text>
      </TouchableOpacity>

      <View style={{ height: 15 }} />

      <TouchableOpacity
        style={[styles.loginBtn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}
        onPress={() => onLogin('employee@test.fi')}
        disabled={loading}
      >
        <Text style={[styles.loginBtnText, { color: colors.text }]}>{t('login_employee')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  loginBtn: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});