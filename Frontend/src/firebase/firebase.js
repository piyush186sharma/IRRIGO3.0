import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPVdUBsVwAIJEfhubSx3e1_H4LRt--Ft8",
  authDomain: "irrigo-e2e9c.firebaseapp.com",
  databaseURL: "https://irrigo-e2e9c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "irrigo-e2e9c",
  storageBucket: "irrigo-e2e9c.firebasestorage.app",
  messagingSenderId: "800473074685",
  appId: "1:800473074685:web:ff448779491deb50c9e794"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize DB
const database = getDatabase(app);

// ✅ Export everything needed
export { database, ref, onValue };
export default app;