import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  firebaseConfig,
  setNotification,
  notificationReceived,
} from "@/Utils/apiUtils";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export async function initAppToken() {
  let token = "";
  const messaging = getMessaging(app);
  await getToken(messaging, {
    vapidKey:
      "BN2ZUmhKg4AXYU6jhtzc6M4uTLKm9JJOftrq9CJrJPzKnKQkI-hAgPBBZqX2naoVlWLO6iDprWdaW_6Oaqy3UWQ",
  })
    .then((currentToken) => {
      if (currentToken) {
        const FCM_TOKEN = localStorage.getItem("FCM");
        if (currentToken === FCM_TOKEN) {
          return (token = currentToken);
        }
        token = currentToken;
        return;
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        // ...
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
  return token;
}
