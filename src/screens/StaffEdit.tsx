import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const StaffEdit = ({ route, navigation }: any) => {
  const { person } = route.params;
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  const [name, setName] = useState(person.name);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('locations')
          .select('id, name')
          .eq('is_active', true) 
          .order('name', { ascending: true });

        if (error) throw error;

        if (data) {
          const formatted = data.map((loc: any) => ({
            id: loc.id,
            name: loc.name,
            selected: person.info ? person.info.includes(loc.name) : false
          }));
          setLocations(formatted);
        }
      } catch (error: any) {
        Alert.alert(t('error'), t('fetch_failed'));
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [person.info, t]);

  const toggleLocation = (id: string) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, selected: !loc.selected } : loc
    ));
  };

  const handleSave = () => {
    const selectedNames = locations
      .filter(loc => loc.selected)
      .map(loc => loc.name);

    // TODO: Firebase-päivitys
    Alert.alert(t('saved'), `${t('info_updated')}: ${name}`);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>{t('loading_locations')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.headerText, { color: colors.text }]}>{t('staff_edit')}</Text>
      
      <TextInput 
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} 
        value={name} 
        onChangeText={setName}
        placeholder={t('employee_name_placeholder')}
        placeholderTextColor={colors.secondary}
      />
      
      <View style={[styles.sectionHeader, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={[styles.sectionText, { color: colors.text }]}>{t('select_location')}</Text>
        <Text style={{ color: colors.text }}>▼</Text>
      </View>

      <View style={styles.checkboxList}>
        {locations.map((loc) => (
          <View key={loc.id} style={styles.checkboxContainer}>
            <Checkbox
              value={loc.selected}
              onValueChange={() => toggleLocation(loc.id)}
              color={loc.selected ? colors.primary : undefined}
              style={styles.checkbox}
            />
            <Text style={[styles.label, { color: colors.text }]}>{loc.name}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: colors.primary, borderColor: colors.primary }]} 
        onPress={handleSave}
      >
        <Text style={[styles.saveButtonText, { color: '#fff' }]}>{t('save')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { 
    borderWidth: 1, 
    padding: 12, 
    marginBottom: 20, 
    fontSize: 16,
    borderRadius: 8
  },
  sectionHeader: { 
    borderWidth: 1, 
    padding: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 15,
    borderRadius: 8
  },
  sectionText: { fontSize: 16 },
  checkboxList: { marginLeft: 5 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkbox: { marginRight: 10 },
  label: { fontSize: 16 },
  saveButton: { 
    padding: 14, 
    alignItems: 'center', 
    marginTop: 40,
    width: '70%',
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 2
  },
  saveButtonText: { fontSize: 16, fontWeight: 'bold' }
});

export default StaffEdit;