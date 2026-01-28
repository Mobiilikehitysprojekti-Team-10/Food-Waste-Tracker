import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Routes } from '../navigation/routes';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext'; 
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.Settings>;

const SettingsScreen = ({ navigation }: Props) => {
  const { user, logout } = React.useContext(AuthContext);
  const { isDark, toggleTheme, colors } = useTheme();
  const { t, language, setLanguage } = useLanguage(); 

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadStoredImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profile-image');
        if (savedImage) setProfileImage(savedImage);
      } catch (e) {
        console.error("Failed to load profile image", e);
      }
    };
    loadStoredImage();
  }, []);

  const handleImageResult = async (uri: string) => {
    setProfileImage(uri);
    try {
      await AsyncStorage.setItem('profile-image', uri);
    } catch (e) {
      Alert.alert(t('error'), 'Kuvan tallennus epäonnistui.');
    }
  };

  const takePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(t('error'), 'Sovellus tarvitsee oikeudet kameraan.');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    // Käytetään uusinta enum-tapaa
    mediaTypes: ImagePicker.MediaTypeOptions.Images, 
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    handleImageResult(result.assets[0].uri);
  }
};

const pickFromGallery = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(t('error'), 'Sovellus tarvitsee oikeudet galleriaan.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    // Varmistetaan että käytetään oikeaa tyyppiä tässäkin
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    handleImageResult(result.assets[0].uri);
  }
};

  const removeImage = async () => {
  Alert.alert(
    t('delete'),
    t('confirm_remove_photo'),
    [
      { text: t('cancel'), style: 'cancel' },
      { 
        text: t('delete'), 
        style: 'destructive', 
        onPress: async () => {
          setProfileImage(null);
          await AsyncStorage.removeItem('profile-image');
        } 
      }
    ]
  );
};

const showImageOptions = () => {
  Alert.alert(
    t('change_pic'),
    '',
    [
      { text: t('take_photo'), onPress: takePhoto }, // Käännetty
      { text: t('choose_from_gallery'), onPress: pickFromGallery }, // Käännetty
      profileImage ? { 
        text: language === 'fi' ? 'Poista kuva' : language === 'sv' ? 'Ta bort bild' : 'Remove photo', 
        onPress: removeImage, 
        style: 'destructive' 
      } : null,
      { text: t('cancel'), style: 'cancel' },
    ].filter(Boolean) as any // Siistimpi tapa suodattaa tyhjät pois
  );
};

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('settings')}</Text>

      <View style={styles.section}>
        <TouchableOpacity 
          onPress={showImageOptions} 
          style={[styles.avatarCircle, { borderColor: colors.border, overflow: 'hidden' }]}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profilePic} />
          ) : (
            <Ionicons name="person" size={50} color={colors.text} />
          )}
          <View style={styles.editIconBadge}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.imageButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={showImageOptions}
        >
          <Text style={[styles.imageButtonText, { color: colors.text }]}>{t('change_pic')}</Text>
        </TouchableOpacity>
        
        {user?.email && <Text style={[styles.emailText, { color: colors.secondary }]}>{user.email}</Text>}
      </View>

      <View style={styles.row}>
        <Ionicons name="moon-sharp" size={32} color={colors.text} />
        <View style={[styles.rowLabel, { borderColor: colors.border }]}>
          <Text style={[styles.labelText, { color: colors.text }]}>{t('dark_mode')}</Text>
        </View>
        <View style={[styles.switchWrapper, { borderColor: colors.border }]}>
            <Switch
                trackColor={{ false: "#ccc", true: colors.primary }}
                thumbColor={isDark ? "#fff" : "#f4f3f4"}
                onValueChange={toggleTheme}
                value={isDark}
            />
        </View>
      </View>

      <View style={[styles.row, { flexDirection: 'column', alignItems: 'flex-start', gap: 10 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="language" size={24} color={colors.text} />
          <Text style={{ color: colors.text, fontWeight: 'bold' }}>{t('language')}</Text>
        </View>
        
        <View style={{ flexDirection: 'row', gap: 10, paddingLeft: 34 }}>
          {['fi', 'en', 'sv'].map((lang) => (
            <TouchableOpacity
              key={lang}
              onPress={() => setLanguage(lang as any)}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: language === lang ? colors.primary : colors.border,
                backgroundColor: language === lang ? colors.primary + '20' : 'transparent'
              }}
            >
              <Text style={{ color: colors.text, fontWeight: language === lang ? 'bold' : 'normal' }}>
                {lang === 'fi' ? 'FI' : lang === 'en' ? 'EN' : 'SV'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
        <Text style={[styles.version, { color: colors.secondary }]}>{t('version')} 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 30 },
  section: { alignItems: 'center', marginBottom: 40 },
  avatarCircle: { 
    width: 90, height: 90, borderRadius: 45, borderWidth: 2, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    position: 'relative'
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4630EB',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  imageButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 4, borderWidth: 1 },
  imageButtonText: { fontSize: 14, fontWeight: '500' },
  emailText: { marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  rowLabel: { 
    flex: 1, height: 45, borderWidth: 1, 
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 15 
  },
  labelText: { fontSize: 16 },
  switchWrapper: { 
    width: 60, height: 45, borderWidth: 1, borderRadius: 22, 
    justifyContent: 'center', alignItems: 'center' 
  },
  dropdownBox: { 
    flex: 1, height: 45, borderWidth: 1, 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', paddingHorizontal: 15, marginLeft: 15 
  },
  dropdownText: { fontSize: 14 },
  footer: { marginTop: 40, alignItems: 'center', paddingBottom: 50 },
  logoutText: { color: 'red', fontWeight: 'bold', fontSize: 16 },
  version: { fontSize: 12, marginTop: 10 }
});

export default SettingsScreen;