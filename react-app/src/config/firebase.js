// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZf5Y4Ud8dKRo-k971P75wOc0kNlW-otI",
  authDomain: "smart-one-8a5f1.firebaseapp.com",
  projectId: "smart-one-8a5f1",
  storageBucket: "smart-one-8a5f1.firebasestorage.app",
  messagingSenderId: "197126537161",
  appId: "1:197126537161:web:033742049ebbf550ba3218",
  measurementId: "G-PC9P0S27TH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
