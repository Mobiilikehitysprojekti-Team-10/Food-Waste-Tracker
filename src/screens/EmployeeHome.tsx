import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Routes } from '../navigation/routes';
import { supabase } from '../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useQuickNotes } from '../features/quickNotes/application/useQuickNotes';

type Props = {
  navigation: { navigate: (route: string, params?: any) => void };
};

export default function EmployeeHome({ navigation }: Props) {
  const { logout, user } = useContext(AuthContext);
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { notes, loadNotes } = useQuickNotes(); // Destructure loadNotes

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
    if (isFocused) {
      loadUnreadCount();
      loadNotes(); // Call loadNotes when the screen is focused
    }
  }, [isFocused, user?.id, loadNotes]); // Add loadNotes to dependencies

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

        <NavButton title={t('waste_report')} route={Routes.WasteReport} />
        <NavButton title={t('complaints')} route={Routes.Complaints} />
        <NavButton title="Menu" route={Routes.Menu} />
        <NavButton title={t('settings')} route={Routes.Settings} />
        <NavButton title="Ilmoitukset" route={Routes.Notifications} badge={unreadCount} />

        <TouchableOpacity
          style={[styles.statsBox, { borderColor: colors.border }]}
          onPress={() => navigation.navigate(Routes.QuickNotes)}
        >
          {notes.length > 0 ? (
            <Text style={[styles.statsText, { color: colors.secondary }]}>
              Quick notes: {notes[0].content}
            </Text>
          ) : (
            <Text style={[styles.statsText, { color: colors.secondary }]}>
              No quick notes yet. Tap to add one!
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
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
    justifyContent: 'center',

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