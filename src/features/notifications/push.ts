import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { supabase } from "../../lib/supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

type NotifyPayload = {
  title: string;
  body: string;
  data?: Record<string, any>;
};

function shouldSkipSelf(recipientUserId: string, actorUserId?: string | null) {
  return !!actorUserId && recipientUserId === actorUserId;
}

export async function registerAndSavePushToken(userId: string) {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  if (!Device.isDevice) {
    console.log("[push] Not a physical device, skipping push token");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("[push] Permission not granted");
    return null;
  }

  const tokenRes = await Notifications.getExpoPushTokenAsync();
  const expoPushToken = tokenRes.data;

  const { error } = await supabase.from("push_tokens").upsert(
    {
      user_id: userId,
      expo_push_token: expoPushToken,
      platform: Platform.OS,
      device_name: Device.deviceName ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,expo_push_token" }
  );

  if (error) console.log("[push] upsert error", error);

  return expoPushToken;
}

async function sendExpoPush(expoPushToken: string, payload: NotifyPayload) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      sound: "default",
      channelId: "default",
    }),
  });
}

export async function notifyUser(userId: string, type: string, payload: NotifyPayload) {
  // apin sisäinen notifikaatio
  const { error: insErr } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title: payload.title,
    body: payload.body,
    data: payload.data ?? {},
  });

  if (insErr) console.log("[notifyUser] insert notification error", insErr);

  // push tokenit
  const { data: tokens, error: tokErr } = await supabase
    .from("push_tokens")
    .select("expo_push_token")
    .eq("user_id", userId);

  if (tokErr) {
    console.log("[notifyUser] token fetch error", tokErr);
    return;
  }

  const uniqueTokens = Array.from(
    new Set((tokens ?? []).map((t) => t.expo_push_token).filter(Boolean))
  );

  await Promise.all(uniqueTokens.map((t) => sendExpoPush(t, payload)));
}


export async function notifyUserIfNotSelf(
  recipientUserId: string,
  actorUserId: string | null | undefined,
  type: string,
  payload: NotifyPayload
) {
  if (shouldSkipSelf(recipientUserId, actorUserId)) return;
  return notifyUser(recipientUserId, type, payload);
}

export async function notifyManagers(type: string, payload: NotifyPayload, actorUserId?: string | null) {
  const { data: managers, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "manager");

  if (error) {
    console.log("[notifyManagers] profiles fetch error", error);
    return;
  }

  const ids = (managers ?? [])
    .map((m) => m.id)
    .filter(Boolean)
    .filter((id) => !shouldSkipSelf(id, actorUserId)); 

  await Promise.all(ids.map((id) => notifyUser(id, type, payload)));
}