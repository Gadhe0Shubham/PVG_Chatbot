import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project config
// Go to Firebase Console > Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: "AIzaSyBuxfPJtq9RI7jw3gc-79XJdHvKUoqeC7Q",
  authDomain: "pvgcoe-54a68.firebaseapp.com",
  projectId: "pvgcoe-54a68",
  storageBucket: "pvgcoe-54a68.firebasestorage.app",
  messagingSenderId: "389192538850",
  appId: "1:389192538850:web:f5f48b175faa72bf95dcbb",
  measurementId: "G-WFFTSTFHJ7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
