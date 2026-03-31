import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const MANUAL_CONFIG = {
  apiKey: "AIzaSyAkw05GIcmGnHouaxyOmjhLeL2xgjSDbvU",
  authDomain: "apastron-fitness.firebaseapp.com",
  projectId: "apastron-fitness",
  storageBucket: "apastron-fitness.firebasestorage.app",
  messagingSenderId: "313710411617",
  appId: "1:313710411617:web:1edcfae32631dd42ba8f20",
  measurementId: "G-4WHCLJY9W2"
};

const getFirebaseConfig = () => {
  if (typeof __firebase_config !== "undefined" && __firebase_config) {
    try {
      return JSON.parse(__firebase_config);
    } catch {
      return MANUAL_CONFIG;
    }
  }
  return MANUAL_CONFIG;
};

const firebaseConfig = getFirebaseConfig();
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);