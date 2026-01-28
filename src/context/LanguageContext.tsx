import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sanakirja staattisille sanoille. Lisäillään tänne uudet sanat siten, että ne löytyvät kaikista.
const translations = {
  fi: {
    // Asetukset
    reports: 'Raportit',
    settings: 'Asetukset',
    change_pic: 'Vaihda profiilikuva',
    dark_mode: 'Tumma / Vaaleat',
    language: 'Kieli',
    logout: 'Kirjaudu ulos',
    version: 'Versio',
    take_photo: 'Ota uusi kuva',
    choose_from_gallery: 'Valitse galleriasta',
    confirm_remove_photo: 'Haluatko varmasti poistaa profiilikuvan?',
    // Vertaa
    compare: 'Vertaa',
    filters: 'Suodattimet',
    choose_location_period: 'Valitse toimipiste ja ajanjakso',
    overall_comparison: 'Yleinen vertailu',
    chart: 'Kaavio',
    two_bars_per_type: 'Kaksi pylvästä per hävikkityyppi',
    no_comparison_data: 'Ei vertailudataa valinnalle',
    close: 'Sulje',
    select_day: 'Valitse päivä',
    // Yleiset
    home: 'Koti',
    save: 'Tallenna',
    cancel: 'Peruuta',
    back: 'Takaisin',
    employee: 'Työntekijä',
    edit: 'Muokkaa',
    login_manager: 'Kirjaudu esihenkilönä',
    login_employee: 'Kirjaudu työntekijänä',
    staff_edit: 'Henkilöstö - Muokkaa',
    employee_name_placeholder: 'Työntekijän nimi',
    loading_locations: 'Ladataan toimipisteitä...',
    info_updated: 'Henkilön tiedot päivitetty',
    menu: 'Valikko',
    menu_content: 'Ruokalista ja vaihtoehdot tulevat näkymään tässä myöhemmin.',
    // Valitukset & Kommentit
    status: 'Tila',
    comments: 'Kommentit',
    no_comments: 'Ei kommentteja vielä.',
    type_here: 'Kirjoita tähän...',
    submit: 'Lähetä',
    select_location: 'Valitse toimipiste',
    header: 'Otsikko',
    description: 'Kuvaus',
    search: 'Hae...',
    add_new_complaint: 'Lisää uusi valitus',
    loading: 'Ladataan...',
    delete: 'Poista',
    // Raportit
    waste_report: 'Hävikkiraportti',
    staff: 'Henkilökunta',
    complaints: 'Valitukset',
    create_favorite: 'Luo suosikki',
    name: 'Nimi',
    name_your_favorite: 'Anna suosikille nimi',
    select_locations: 'Valitse toimipisteet',
    select_waste_types: 'Valitse hävikkityypit',
    save_favorite: 'Tallenna suosikki',
    saved: 'Tallennettu',
    favorite_created: 'Suosikki luotu onnistuneesti.',
    error: 'Virhe',
    name_required: 'Nimi on pakollinen.',
    select_location_or_favorite: 'Valitse toimipiste tai suosikki',
    showing: 'Näytetään',
    weekly_totals: 'Viikon yhteensä',
    tap_to_enlarge: 'Napauta suurentaaksesi',
    details: 'Tiedot',
    totals_by_type: 'Yhteensä tyypeittäin',
    no_data_week: 'Ei tietoja tälle viikolle',
    confirm_delete_favorite: 'Haluatko varmasti poistaa tämän suosikkilistan?',
    favorite_deleted: 'Suosikki poistettu',
    fetch_failed: 'Toimipisteiden haku epäonnistui',
    missing_info: 'Puuttuva tieto',
    report_saved: 'Raportti tallennettu',
    select_location_dots: 'Valitse toimipiste...',
  },
  en: {
    // Settings
    reports: 'Reports',
    settings: 'Settings',
    change_pic: 'Change profile picture',
    dark_mode: 'Dark / Light',
    language: 'Language',
    logout: 'Log Out',
    version: 'Version',
    take_photo: 'Take a new photo',
    choose_from_gallery: 'Choose from gallery',
    confirm_remove_photo: 'Are you sure you want to remove the profile picture?',
    // Compare
    compare: 'Compare',
    filters: 'Filters',
    choose_location_period: 'Choose location and period',
    overall_comparison: 'Overall Comparison',
    chart: 'Chart',
    two_bars_per_type: 'Two bars per waste type',
    no_comparison_data: 'No comparison data for selection',
    close: 'Close',
    select_day: 'Select day',
    // Common
    home: 'Home',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    employee: 'Employee',
    edit: 'Edit',
    login_manager: 'Login as Manager',
    login_employee: 'Login as Employee',
    staff_edit: 'Staff - Edit',
    employee_name_placeholder: 'Employee Name',
    loading_locations: 'Loading locations...',
    info_updated: 'Employee info updated',
    menu: 'Menu',
    menu_content: 'The menu and options will appear here later.',
    // Complaints & Comments
    status: 'Status',
    comments: 'Comments',
    no_comments: 'No comments yet.',
    type_here: 'Type here...',
    submit: 'Submit',
    select_location: 'Select location',
    header: 'Header',
    description: 'Description',
    search: 'Search...',
    add_new_complaint: 'Add new complaint',
    loading: 'Loading...',
    delete: 'Delete',
    // Reports
    waste_report: 'Waste Report',
    staff: 'Staff',
    complaints: 'Complaints',
    create_favorite: 'Create Favorite',
    name: 'Name',
    name_your_favorite: 'Name your favorite',
    select_locations: 'Select Locations',
    select_waste_types: 'Select Waste Types',
    save_favorite: 'Save Favorite',
    saved: 'Saved',
    favorite_created: 'Favorite created successfully.',
    error: 'Error',
    name_required: 'Name is required.',
    select_location_or_favorite: 'Select location or favorite',
    showing: 'Showing',
    weekly_totals: 'Weekly totals',
    tap_to_enlarge: 'Tap to enlarge',
    details: 'Details',
    totals_by_type: 'Totals by type',
    no_data_week: 'No data for this week',
    confirm_delete_favorite: 'Are you sure you want to delete this favorite list?',
    favorite_deleted: 'Favorite deleted',
    fetch_failed: 'Failed to fetch locations',
    missing_info: 'Missing information',
    report_saved: 'Report saved',
    select_location_dots: 'Select location...',
  },
  sv: {
    // Inställningar
    reports: 'Rapporter',
    settings: 'Inställningar',
    change_pic: 'Byt profilbild',
    dark_mode: 'Mörkt / Ljust läge',
    language: 'Språk',
    logout: 'Logga ut',
    version: 'Version',
    take_photo: 'Ta ett nytt foto',
    choose_from_gallery: 'Välj från galleriet',
    confirm_remove_photo: 'Är du säker på att du vill ta bort profilbilden?',
    // Jämför
    compare: 'Jämför',
    filters: 'Filter',
    choose_location_period: 'Välj enhet och period',
    overall_comparison: 'Övergripande jämförelse',
    chart: 'Diagram',
    two_bars_per_type: 'Två staplar per svinnstyp',
    no_comparison_data: 'Ingen jämförelsedata för valet',
    close: 'Stäng',
    select_day: 'Välj dag',
    // Allmänt
    home: 'Hem',
    save: 'Spara',
    cancel: 'Avbryt',
    back: 'Tillbaka',
    employee: 'Anställd',
    edit: 'Redigera',
    login_manager: 'Logga in som chef',
    login_employee: 'Logga in som anställd',
    staff_edit: 'Personal - Redigera',
    employee_name_placeholder: 'Anställds namn',
    loading_locations: 'Laddar enheter...',
    info_updated: 'Personuppgifter uppdaterade',
    menu: 'Meny',
    menu_content: 'Menyn och alternativen kommer att visas här senare.',
    // Klagomål & Kommentarer
    status: 'Status',
    comments: 'Kommentarer',
    no_comments: 'Inga kommentarer ännu.',
    type_here: 'Skriv här...',
    submit: 'Skicka',
    select_location: 'Välj enhet',
    header: 'Rubrik',
    description: 'Beskrivning',
    search: 'Sök...',
    add_new_complaint: 'Lägg till nytt klagomål',
    loading: 'Laddar...',
    delete: 'Radera',
    // Rapporter
    waste_report: 'Svinnsrapport',
    staff: 'Personal',
    complaints: 'Klagomål',
    create_favorite: 'Skapa favorit',
    name: 'Namn',
    name_your_favorite: 'Namnge din favorit',
    select_locations: 'Välj enheter',
    select_waste_types: 'Välj svinnstyper',
    save_favorite: 'Spara favorit',
    saved: 'Sparad',
    favorite_created: 'Favorit skapad framgångsrikt.',
    error: 'Fel',
    name_required: 'Namn är obligatoriskt.',
    select_location_or_favorite: 'Välj enhet eller favorit',
    showing: 'Visar',
    weekly_totals: 'Veckototal',
    tap_to_enlarge: 'Tryck för att förstora',
    details: 'Detaljer',
    totals_by_type: 'Totalt per typ',
    no_data_week: 'Ingen data för denna vecka',
    confirm_delete_favorite: 'Är du säker på att du vill radera denna favoritlista?',
    favorite_deleted: 'Favorit raderad',
    fetch_failed: 'Hämtning av enheter misslyckades',
    missing_info: 'Information saknas',
    report_saved: 'Rapporten sparad',
    select_location_dots: 'Välj enhet...',
  },
};

type Language = 'fi' | 'en' | 'sv';

type LanguageContextType = {
  language: Language;
  t: (key: keyof typeof translations['fi']) => string;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLang] = useState<Language>('fi');

  useEffect(() => {
    const loadLang = async () => {
      const saved = await AsyncStorage.getItem('user-language');
      if (saved === 'fi' || saved === 'en' || saved === 'sv') setLang(saved as Language);
    };
    loadLang();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLang(lang);
    //await AsyncStorage.setItem('user-language', lang);
  };

  const t = (key: keyof typeof translations['fi']) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};