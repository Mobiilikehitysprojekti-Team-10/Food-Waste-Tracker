import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { supabase } from '../lib/supabase';

const StaffEdit = ({ route, navigation }: any) => {
  const { person } = route.params;
  const [name, setName] = useState(person.name);
  
  // Tilat kouluille (locations-taulukosta)
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Haetaan koulut Supabasen locations-taulukosta
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
        console.error("Virhe locations-haussa:", error.message);
        Alert.alert("Virhe", "Toimipisteitä ei voitu hakea.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [person.info]);

  // 2. Vaihdetaan checkboxin tilaa
  const toggleLocation = (id: string) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, selected: !loc.selected } : loc
    ));
  };

  // 3. Tallennus (Tässä vaiheessa loggaus, koska käyttäjät ovat Firebasessa)
  const handleSave = () => {
    const selectedNames = locations
      .filter(loc => loc.selected)
      .map(loc => loc.name);

    console.log("Tallennetaan käyttäjä:", name);
    console.log("Valitut toimipisteet:", selectedNames);

    // TODO: Päivitä uusi nimi ja toimipistekokonaisuus Firebaseen/profiiliin
    Alert.alert("Tallennettu", `Henkilön ${name} tiedot päivitetty.`);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4630EB" />
        <Text style={{marginTop: 10}}>Ladataan toimipisteitä...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Staff - Edit</Text>
      
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName}
        placeholder="Employee Name"
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionText}>Sectors</Text>
        <Text>▼</Text>
      </View>

      <View style={styles.checkboxList}>
        {locations.map((loc) => (
          <View key={loc.id} style={styles.checkboxContainer}>
            <Checkbox
              value={loc.selected}
              onValueChange={() => toggleLocation(loc.id)}
              color={loc.selected ? '#4630EB' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.label}>{loc.name}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { 
    borderWidth: 1, 
    borderColor: '#000', 
    padding: 12, 
    marginBottom: 20, 
    fontSize: 16 
  },
  sectionHeader: { 
    borderWidth: 1, 
    borderColor: '#000', 
    padding: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginBottom: 15
  },
  sectionText: { fontSize: 16 },
  checkboxList: { marginLeft: 5 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkbox: { marginRight: 10 },
  label: { fontSize: 16 },
  saveButton: { 
    backgroundColor: '#E0E0E0', 
    borderWidth: 1, 
    borderColor: '#000',
    padding: 12, 
    alignItems: 'center', 
    marginTop: 40,
    width: '60%',
    alignSelf: 'center',
    borderRadius: 5
  },
  saveButtonText: { fontSize: 16, fontWeight: '500' }
});

export default StaffEdit;