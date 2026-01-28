import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { useLanguage } from '../context/LanguageContext';
import { Routes } from '../navigation/routes';

type Props = {
  navigation: { navigate: (route: string, params?: any) => void };
};

export default function EmployeeHome({ navigation }: Props) {
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
        
        {/* Navigaationapit */}
        <NavButton title={t('waste_report')} route={Routes.WasteReport} />
        <NavButton title={t('complaints')} route={Routes.Complaints} />
        <NavButton title="Menu" route={Routes.Menu} />
        <NavButton title={t('settings')} route={Routes.Settings} />

        {/* Tilastot ja muistiinpanot */}
        <View style={[styles.statsBox, { borderColor: colors.border }]}>
          <Text style={[styles.statsText, { color: colors.text }]}>
            Quick stats: Reported waste during the week: 900kg
          </Text>
          <Text style={[styles.statsText, { color: colors.secondary, marginTop: 10 }]}>
            Quick notes: Muista pakastimen tyhjennys
          </Text>
        </View>

        {/* Logout-nappi */}
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
  statsBox: { 
    marginVertical: 30, 
    padding: 15, 
    borderWidth: 1, 
    borderRadius: 8,
    borderStyle: 'dashed'
  },
  statsText: { fontSize: 14, lineHeight: 20 },
  logoutButton: { 
    marginTop: 20, 
    padding: 15, 
    alignItems: 'center' 
  },
  logoutText: { color: 'red', fontWeight: 'bold', fontSize: 16 }
});