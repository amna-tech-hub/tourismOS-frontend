import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";

// ==========================================
// REGISTER FCM TOKEN
// ==========================================

export const registerFcmToken = async (saveToken) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!token) {
      console.log("No FCM token received");
      return null;
    }

    console.log("FCM Token:", token);

    await saveToken(token);

    console.log("FCM token saved to backend");

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
    console.log("[FCM] Foreground message received:", payload);

    callback(payload);
  });
};