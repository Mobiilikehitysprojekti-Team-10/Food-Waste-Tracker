import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { useLanguage } from '../context/LanguageContext'; 

export default function LoginScreen() {
  const { loginAsManager, loginAsEmployee } = useContext(AuthContext);
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Food Waste Tracker</Text>

      <TouchableOpacity 
        style={[styles.loginBtn, { backgroundColor: colors.primary }]} 
        onPress={loginAsManager}
      >
        <Text style={styles.loginBtnText}>{t('login_manager')}</Text>
      </TouchableOpacity>

      <View style={{ height: 15 }} />

      <TouchableOpacity 
        style={[styles.loginBtn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]} 
        onPress={loginAsEmployee}
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