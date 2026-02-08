import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Routes } from '../navigation/routes';
import { supabase } from '../lib/supabase';
import { useIsFocused } from '@react-navigation/native';

type Props = {
  navigation: { navigate: (route: string, params?: any) => void };
};

export default function ManagerHome({ navigation }: Props) {
  const { logout, user } = useContext(AuthContext);
  const { colors } = useTheme();
  const { t } = useLanguage();

  const isFocused = useIsFocused();
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadUnreadCount() {
    if (!user?.id) return;

    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null);

    if (!error) setUnreadCount(count ?? 0);
  }

  useEffect(() => {
    if (isFocused) loadUnreadCount();
  }, [isFocused, user?.id]);

  const NavButton = ({
    title,
    route,
    badge,
  }: {
    title: string;
    route: string;
    badge?: number;
  }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => navigation.navigate(route)}
    >
      <View style={styles.navContainer}>
        <Text style={[styles.buttonText, { color: colors.text }]}>{title}</Text>
        {typeof badge === 'number' && badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : String(badge)}</Text>
          </View>
        ) : null}
      </View>
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
        <NavButton title="Ilmoitukset" route={Routes.Notifications} badge={unreadCount} />
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
  navContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -13 }],
    minWidth: 26,
    height: 26,
    paddingHorizontal: 8,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3b30',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center'
  },
  logoutText: { color: 'red', fontWeight: 'bold', fontSize: 16 }
});