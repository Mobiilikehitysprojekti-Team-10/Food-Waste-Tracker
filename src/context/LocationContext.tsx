import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Linking, Modal, Platform, Pressable, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { LOCATION_TASK_NAME } from "../location/backgroundTask";

type LastLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
};

type LocationContextValue = {
  consent: boolean | null;
  location: LastLocation | null;
  isTracking: boolean;
  setConsent: (v: boolean) => Promise<void>;
  requestConsentAndPermissions: () => Promise<void>;
  disableLocation: () => Promise<void>;
  openSystemSettings: () => Promise<void>;
};

const LocationContext = createContext<LocationContextValue | null>(null);

const STORAGE_CONSENT = "location.consent";
const STORAGE_LAST_LOCATION = "location.last";

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationContext must be used within LocationProvider");
  return ctx;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<boolean | null>(null);
  const [location, setLocation] = useState<LastLocation | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const fgSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const consentRef = useRef<boolean | null>(null);
  const isTrackingRef = useRef<boolean>(false);

  useEffect(() => {
    consentRef.current = consent;
  }, [consent]);

  useEffect(() => {
    isTrackingRef.current = isTracking;
  }, [isTracking]);

  function stopForegroundWatch() {
    fgSubscriptionRef.current?.remove();
    fgSubscriptionRef.current = null;
  }

  async function stopBackgroundUpdates() {
    try {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
    } catch {
    }
  }

  async function clearCachedLocation() {
    setLocation(null);
    await AsyncStorage.removeItem(STORAGE_LAST_LOCATION);
  }

  async function hydrateLastLocationIfPermitted() {
    const fg = await Location.getForegroundPermissionsAsync();
    if (fg.status === "granted") {
      const last = await AsyncStorage.getItem(STORAGE_LAST_LOCATION);
      if (last) {
        try {
          setLocation(JSON.parse(last));
        } catch {
          await clearCachedLocation();
        }
      }
    } else {
      setLocation(null);
      await AsyncStorage.removeItem(STORAGE_LAST_LOCATION);
    }
  }

  async function startForegroundWatch() {
    stopForegroundWatch();

    fgSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 50,
        timeInterval: 60_000,
      },
      async (loc) => {
        const payload: LastLocation = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracy: loc.coords.accuracy ?? null,
          timestamp: loc.timestamp,
        };

        setLocation(payload);
        await AsyncStorage.setItem(STORAGE_LAST_LOCATION, JSON.stringify(payload));
      }
    );
  }

  async function startBackgroundUpdatesIfAllowed() {
    const bg = await Location.getBackgroundPermissionsAsync();
    if (bg.status !== "granted") return;

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (hasStarted) return;

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: 50,
      timeInterval: 300_000,
      showsBackgroundLocationIndicator: true,
      pausesUpdatesAutomatically: true,
    });
  }

  async function startTrackingBestEffort() {
    if (consentRef.current !== true) return;

    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) return;

    const fg = await Location.getForegroundPermissionsAsync();
    if (fg.status !== "granted") return;

    await startForegroundWatch();

    await startBackgroundUpdatesIfAllowed();

    setIsTracking(true);
  }
  async function syncWithSystemPermissions() {
    let fg = await Location.getForegroundPermissionsAsync();

    if (consentRef.current === true && fg.status === "undetermined") {
      const req = await Location.requestForegroundPermissionsAsync();
      fg = req;

      if (fg.status !== "granted") {
        stopForegroundWatch();
        await stopBackgroundUpdates();
        setIsTracking(false);
        await clearCachedLocation();
        return;
      }
    }

    if (fg.status !== "granted") {
      stopForegroundWatch();
      await stopBackgroundUpdates();
      setIsTracking(false);

      await clearCachedLocation();

      await AsyncStorage.removeItem("menu.selectedLocationId");
      console.log("After remove, saved:", await AsyncStorage.getItem("menu.selectedLocationId"));

      consentRef.current = false;
      setConsentState(false);
      await AsyncStorage.setItem("location.consent", "false");

      return;
    }

    await hydrateLastLocationIfPermitted();

    if (consentRef.current === true) {
      if (!isTrackingRef.current) {
        await startTrackingBestEffort();
      }
    } else {
      stopForegroundWatch();
      await stopBackgroundUpdates();
      setIsTracking(false);

      if (consentRef.current === false) {
        await clearCachedLocation();
      }
    }
  }

  async function persistConsent(v: boolean) {
    consentRef.current = v;
  
    await AsyncStorage.setItem(STORAGE_CONSENT, String(v));
    setConsentState(v);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const storedConsent = await AsyncStorage.getItem(STORAGE_CONSENT);
      if (cancelled) return;

      if (storedConsent === null) {
        consentRef.current = null;
        setConsentState(null);
        setShowConsentModal(true);
      } else {
        const parsed = storedConsent === "true";
        consentRef.current = parsed;
        setConsentState(parsed);
        setShowConsentModal(false);
      }

      await syncWithSystemPermissions();
    })();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void syncWithSystemPermissions();
      }
    });

    return () => {
      cancelled = true;
      sub.remove();
      stopForegroundWatch();
      void stopBackgroundUpdates();
    };
  }, []);

  async function requestConsentAndPermissions() {
    await persistConsent(true);
    setShowConsentModal(false);

    const fg = await Location.requestForegroundPermissionsAsync();
    if (fg.status !== "granted") {
      await persistConsent(false);
      setShowConsentModal(false);
      setIsTracking(false);
      await clearCachedLocation();
      return;
    }

    try {
      await Location.requestBackgroundPermissionsAsync();
    } catch {
    }

    await syncWithSystemPermissions();
  }

  async function disableLocation() {
    consentRef.current = false;
    await persistConsent(false);
    setShowConsentModal(false);

    stopForegroundWatch();
    await stopBackgroundUpdates();
    setIsTracking(false);

    setLocation(null);
    await AsyncStorage.removeItem(STORAGE_LAST_LOCATION);
    await AsyncStorage.removeItem("menu.selectedLocationId");
  }

  async function setConsent(v: boolean) {
    if (v) {
      await requestConsentAndPermissions();
    } else {
      await disableLocation();
    }
  }

  async function openSystemSettings() {
    await Linking.openSettings();
  }

  const value = useMemo<LocationContextValue>(
    () => ({
      consent,
      location,
      isTracking,
      setConsent,
      requestConsentAndPermissions,
      disableLocation,
      openSystemSettings,
    }),
    [consent, location, isTracking]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}

      {/* GDPR-tyylinen esisuostumus */}
      <Modal visible={showConsentModal} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View style={{ backgroundColor: "white", borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              Use of location data
            </Text>

            <Text style={{ marginBottom: 12, lineHeight: 20 }}>
              We use your location to suggest the nearest office in Waste Report and Menu. You can change
              the office manually and disable location tracking in the settings at any time.
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
              <Pressable
                onPress={async () => {
                  await persistConsent(false);
                  setShowConsentModal(false);
                  await syncWithSystemPermissions();
                }}
              >
                <Text style={{ padding: 10 }}>Ei nyt</Text>
              </Pressable>

              <Pressable onPress={requestConsentAndPermissions}>
                <Text style={{ padding: 10, fontWeight: "700" }}>Salli</Text>
              </Pressable>
            </View>

            {Platform.OS === "ios" && (
              <Text style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                iOS may request background location separately in the system settings.
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </LocationContext.Provider>
  );
}
