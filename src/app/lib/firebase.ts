// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBW_puorIgVolquZs3ZHRtFROARv9okkw8",
  authDomain: "hci-testbe.firebaseapp.com",
  projectId: "hci-testbe",
  storageBucket: "hci-testbe.firebasestorage.app",
  messagingSenderId: "1012812271449",
  appId: "1:1012812271449:web:9621620d81915fe1684648",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
