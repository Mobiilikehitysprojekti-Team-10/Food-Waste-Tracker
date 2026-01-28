import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { useLanguage } from '../context/LanguageContext'; 
import { Routes } from '../navigation/routes';

type Props = {
  navigation: { navigate: (route: string, params?: any) => void };
};

export default function ManagerHome({ navigation }: Props) {
  const { logout } = useContext(AuthContext);
  const { colors } = useTheme(); 
  const { t } = useLanguage(); 


  const NavButton = ({ title, route }: { title: string, route: string }) => (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]} 
      onPress={() => navigation.navigate(route)}
    >
      <Text style={[styles.buttonText, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.header, { color: colors.text }]}>Manager Dashboard</Text>

        <NavButton title={t('reports')} route={Routes.Reports} />
        <NavButton title={t('complaints')} route={Routes.Complaints} />
        <NavButton title={t('staff')} route={Routes.Staff} />
        <NavButton title="Menu" route={Routes.Menu} />
        <NavButton title={t('settings')} route={Routes.Settings} />

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={logout}
        >
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 40 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  button: { 
    padding: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    marginBottom: 15, 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
  logoutButton: { 
    marginTop: 20, 
    padding: 15, 
    alignItems: 'center' 
  },
  logoutText: { color: 'red', fontWeight: 'bold', fontSize: 16 }
});