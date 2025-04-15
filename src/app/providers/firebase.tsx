// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBW_puorIgVolquZs3ZHRtFROARv9okkw8",
  authDomain: "hci-testbe.firebaseapp.com",
  projectId: "hci-testbe",
  storageBucket: "hci-testbe.firebasestorage.app",
  messagingSenderId: "1012812271449",
  appId: "1:1012812271449:web:6d11cdb099a31ade684648",
  measurementId: "G-Y7BBD56VPL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
