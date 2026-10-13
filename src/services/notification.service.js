import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";

// ==========================================
// REGISTER FCM TOKEN
// ==========================================

export const registerFcmToken = async (saveToken) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      ("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!token) {
      ("No FCM token received");
      return null;
    }

    ("FCM Token:", token);

    await saveToken(token);

    ("FCM token saved to backend");

    return token;
  } catch (error) {
    console.error("Failed to register FCM token:", error);
    return null;
  }
};

// ==========================================
// FOREGROUND MESSAGE LISTENER
// ==========================================

export const listenForForegroundMessages = (callback) => {
  return onMessage(messaging, (payload) => {
    ("[FCM] Foreground message received:", payload);

    callback(payload);
  });
};
