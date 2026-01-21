import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Valedataa testausta varten, päivitellään kun firebase pystyssä
const MOCK_STAFF = [
  { id: '1', name: 'Timo Testaaja', info: 'Tesoman koulu, Takahuhdin i' },
  { id: '2', name: 'Kalle Korjaaja', info: 'Tesoman koulu, Takahuhdin i' },
  { id: '3', name: 'Kimmo Keittäjä', info: 'Tesoman koulu, Takahuhdin i' },
  { id: '4', name: 'Sakari Siivooja', info: 'Tesoman koulu, Takahuhdin i' },
];

const StaffScreen = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');

  const filteredStaff = MOCK_STAFF.filter(person => 
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Hakupalkki mockupin mukaan */}
      <TextInput 
        style={styles.searchBar} 
        placeholder="Search" 
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.sectionTitle}>Employee</Text>

      <FlatList
        data={filteredStaff}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.infoText}>{item.info}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => navigation.navigate('StaffEdit', { person: item })}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  searchBar: { 
    borderWidth: 1, borderColor: '#ccc', borderRadius: 20, 
    paddingHorizontal: 15, paddingVertical: 8, marginBottom: 20 
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textDecorationLine: 'underline' },
  card: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 15, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: '#eee'
  },
  infoContainer: { flex: 1 },
  nameText: { borderBottomWidth: 1, alignSelf: 'flex-start', marginBottom: 2 },
  infoText: { fontSize: 12, color: '#666' },
  editButton: { borderWidth: 1, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 5 }
});

export default StaffScreen;