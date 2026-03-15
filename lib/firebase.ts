import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "pocket-heist-website-001",
  appId: "1:198320385637:web:94c80d179a83f7cbfc608c",
  storageBucket: "pocket-heist-website-001.firebasestorage.app",
  apiKey: "AIzaSyAyVshbYT3LQeqA-x07kctYp6BjysH-QzY",
  authDomain: "pocket-heist-website-001.firebaseapp.com",
  messagingSenderId: "198320385637",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
