import React, { useContext, useEffect, useMemo, useState } from "react";
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, Pressable, ScrollView,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useLocationContext } from "../context/LocationContext";
import { supabase } from "../lib/supabase";
import { findNearestWithin } from "../lib/geo";

const STORAGE_SELECTED = "menu.selectedLocationId";

type LocationRow = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
};


const TEST_ACCOUNTS_BY_LOCATION: Record<string, { managerEmail: string; employeeEmail: string }> = {
  "0867c5bd-a40f-4201-909f-372e3dc7cb09": { managerEmail: "manager@test.fi", employeeEmail: "employee@test.fi" },
  "d23668a9-2521-4774-88e0-28c880d67de0": { managerEmail: "m@test.fi", employeeEmail: "e@test.fi" },
  "eb1f62e4-76c1-4a0f-b4ea-6034d86afaa5": { managerEmail: "aleksi@manager.fi", employeeEmail: "aleksi@employee.fi" },


};

export default function LoginScreen() {
  const { signIn, loading, authError } = useContext(AuthContext);
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { consent, location, requestConsentAndPermissions, openSystemSettings } = useLocationContext();
  const [password, setPassword] = useState("");

  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [locLoading, setLocLoading] = useState(true);

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string | null>(null);

  const [manualPickerOpen, setManualPickerOpen] = useState(false);

  // hae aktiiviset toimipisteet aina (ennen kirjautumista)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLocLoading(true);
      try {
        const res = await supabase
          .from("locations")
          .select("id,name,latitude,longitude,is_active")
          .eq("is_active", true)
          .order("name");

        if (!cancelled) {
          setLocations((res.data ?? []) as LocationRow[]);
        }
      } finally {
        if (!cancelled) setLocLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // yritä ladata aiempi valinta (jos käyttäjä on jo joskus valinnut toimipisteen)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_SELECTED);
      if (cancelled) return;

      if (stored) {
        setSelectedLocationId(stored);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  //jos käyttäjä on antanut sijaintiluvan ja on last location,
  //löydä lähin toimipiste ja aseta se automaattisesti.
  useEffect(() => {
    if (locLoading) return;
    if (!locations.length) return;

    // jos käyttäjä on jo valinnut toimipisteen (AsyncStorage tai manuaali), älä yliaja
    if (selectedLocationId) {
      const found = locations.find((l) => String(l.id) === String(selectedLocationId));
      if (found) setSelectedLocationName(found.name);
      return;
    }

    if (consent !== true) return;
    if (!location) return;

    const nearest = findNearestWithin(
      { latitude: location.latitude, longitude: location.longitude },
      locations as any,
      100
    );

    const nearestRow = (nearest?.row ?? null) as LocationRow | null;
    if (!nearestRow?.id) return;

    const id = String(nearestRow.id);
    setSelectedLocationId(id);
    setSelectedLocationName(nearestRow.name);
    void AsyncStorage.setItem(STORAGE_SELECTED, id);
  }, [consent, location, locations, locLoading, selectedLocationId]);

  const accounts = useMemo(() => {
    if (!selectedLocationId) return null;
    return TEST_ACCOUNTS_BY_LOCATION[String(selectedLocationId)] ?? null;
  }, [selectedLocationId]);

  const onPickLocation = async (loc: LocationRow) => {
    const id = String(loc.id);
    setSelectedLocationId(id);
    setSelectedLocationName(loc.name);
    setManualPickerOpen(false);
    await AsyncStorage.setItem(STORAGE_SELECTED, id);
  };

  const onLogin = async (email: string) => {
    try {
      if (!selectedLocationId) {
        Alert.alert(
          t("select_office_title") ?? "Select office",
          t("select_office_hint") ?? "Select an office first (auto by GPS or manually)."
        );
        return;
      }

      if (!password.trim()) {
        Alert.alert("Missing password", "Enter the password.");
        return;
      }

      await signIn(email, password);
    } catch (e: any) {
      console.log("[login] signIn failed", e);
      Alert.alert("Login failed", e?.message ?? "Unknown error");
    }
  };

  const canLogin = !!accounts && !!selectedLocationId && !loading;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Food Waste Tracker</Text>

      {/* Sijainti/toimipiste ennen kirjautumista */}
      <Text style={[styles.label, { color: colors.text }]}>
        {t("location") ?? "Office"}
      </Text>

      {locLoading ? (
        <View style={{ paddingVertical: 8 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={[styles.officeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text, fontWeight: "700" }}>
            {selectedLocationName
              ? selectedLocationName
              : consent === true
                ? (t("no_nearby_office_pick_manual") ?? "No nearby office found — pick manually")
                : (t("location_not_enabled_pick_manual") ?? "Location not enabled — pick manually")}
          </Text>

          {consent !== true ? (
            <Pressable
              onPress={async () => {
                await requestConsentAndPermissions();
              }}
              style={[styles.pickBtn, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.text, fontWeight: "700" }}>
                {t("enable_location") ?? "Enable location"}
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={() => setManualPickerOpen((v) => !v)}
            style={[styles.pickBtn, { borderColor: colors.border }]}
          >
            <Text style={{ color: colors.text, fontWeight: "700" }}>
              {selectedLocationName
                ? (t("change_office") ?? "Change office")
                : (t("select_office") ?? "Select office")}
            </Text>
          </Pressable>

          {manualPickerOpen ? (
            <View style={{ marginTop: 10 }}>
              <ScrollView style={{ maxHeight: 220 }}>
                {locations.map((l) => {
                  const active = String(l.id) === String(selectedLocationId);
                  return (
                    <Pressable
                      key={String(l.id)}
                      onPress={() => void onPickLocation(l)}
                      style={[
                        styles.locationRow,
                        {
                          borderColor: colors.border,
                          backgroundColor: active ? colors.background : "transparent",
                        },
                      ]}
                    >
                      <Text style={{ color: colors.text, fontWeight: active ? "800" : "600" }}>
                        {l.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          {!accounts && selectedLocationId ? (
            <Text style={{ marginTop: 10, color: "#ff4444", fontSize: 12 }}>
              No test accounts configured for this office. Add it to TEST_ACCOUNTS_BY_LOCATION.
            </Text>
          ) : null}
        </View>
      )}

      <View style={{ height: 16 }} />

      <Text style={[styles.label, { color: colors.text }]}>
        {t("password") ?? "Password"}
      </Text>

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={t("password") ?? "Password"}
        secureTextEntry
        autoCapitalize="none"
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text, backgroundColor: colors.card },
        ]}
      />

      <View style={{ height: 18 }} />

      {loading ? <ActivityIndicator /> : null}

      {authError ? (
        <Text style={{ marginTop: 10, color: "red", textAlign: "center" }}>
          {authError}
        </Text>
      ) : null}

      <View style={{ height: 18 }} />

      <TouchableOpacity
        style={[styles.loginBtn, { backgroundColor: colors.primary, opacity: canLogin ? 1 : 0.5 }]}
        onPress={() => accounts && onLogin(accounts.managerEmail)}
        disabled={!canLogin}
      >
        <Text style={styles.loginBtnText}>
          {t("login_manager") ?? "Login manager"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 15 }} />

      <TouchableOpacity
        style={[
          styles.loginBtn,
          {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            opacity: canLogin ? 1 : 0.5,
          },
        ]}
        onPress={() => accounts && onLogin(accounts.employeeEmail)}
        disabled={!canLogin}
      >
        <Text style={[styles.loginBtnText, { color: colors.text }]}>
          {t("login_employee") ?? "Login employee"}
        </Text>
      </TouchableOpacity>

      {/* debug-teksti */}
      <Text
        style={{
          marginTop: 16,
          fontSize: 12,
          color: colors.secondary,
          textAlign: "center",
        }}
      >
        {selectedLocationId
          ? `Selected locationId: ${String(selectedLocationId).slice(0, 8)}…`
          : "No office selected"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 24, 
  },
  label: { 
    fontSize: 14,
    fontWeight: '600', 
    marginBottom: 8,
  },
  input: { 
    borderWidth: 1,
    borderRadius: 12, 
    paddingVertical: 12, 
    paddingHorizontal: 14,
  },
  loginBtn: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginBtnText: { 
    fontSize: 16,
    fontWeight: '600', 
    color: '#fff',
  },

  officeCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  pickBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  locationRow: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
});