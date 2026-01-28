import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext'; 
import { useLanguage } from '../context/LanguageContext'; 

const MOCK_STAFF = [
  { id: '1', name: 'Timo Testaaja', info: 'Tesoman koulu, Takahuhdin i' },
  { id: '2', name: 'Kalle Korjaaja', info: 'Tesoman koulu, Takahuhdin i' },
  { id: '3', name: 'Kimmo Keittäjä', info: 'Tesoman koulu, Takahuhdin i' },
  { id: '4', name: 'Sakari Siivooja', info: 'Tesoman koulu, Takahuhdin i' },
];

const StaffScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const filteredStaff = MOCK_STAFF.filter(person => 
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput 
        style={[styles.searchBar, { 
          borderColor: colors.border, 
          color: colors.text,
          backgroundColor: colors.card 
        }]} 
        placeholder={t('search')} 
        placeholderTextColor={colors.secondary}
        value={search}
        onChangeText={setSearch}
      />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('employee')}</Text>

      <FlatList
        data={filteredStaff}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: colors.border }]}>
            <View style={styles.infoContainer}>
              <Text style={[styles.nameText, { color: colors.text, borderBottomColor: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.infoText, { color: colors.secondary }]}>{item.info}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.editButton, { borderColor: colors.border, backgroundColor: colors.card }]} 
              onPress={() => navigation.navigate('StaffEdit', { person: item })}
            >
              <Text style={{ color: colors.text }}>{t('edit')}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  searchBar: { 
    borderWidth: 1, borderRadius: 20, 
    paddingHorizontal: 15, paddingVertical: 8, marginBottom: 20 
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textDecorationLine: 'underline' },
  card: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 15, paddingBottom: 10, borderBottomWidth: 0.5
  },
  infoContainer: { flex: 1 },
  nameText: { borderBottomWidth: 1, alignSelf: 'flex-start', marginBottom: 2 },
  infoText: { fontSize: 12 },
  editButton: { borderWidth: 1, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 5 }
});

export default StaffScreen;