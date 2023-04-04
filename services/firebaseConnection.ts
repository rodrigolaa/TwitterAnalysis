// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlRYoHURdhs-3Je9FCKRQxbrCz9JYCdz8",
  authDomain: "twitteranalysis-e8f65.firebaseapp.com",
  projectId: "twitteranalysis-e8f65",
  storageBucket: "twitteranalysis-e8f65.appspot.com",
  messagingSenderId: "611730583938",
  appId: "1:611730583938:web:074200caa325e4fef99f9b",
  measurementId: "G-T89F2X9Q2R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

// const analytics = getAnalytics(firebaseApp);

export default db ;