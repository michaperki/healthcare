// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set, push } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBYjePPKSC0w1HG5Aph-kKesWHlo81H--E",
  authDomain: "healthcare-2d074.firebaseapp.com",
  databaseURL: "https://healthcare-2d074-default-rtdb.firebaseio.com/",
  projectId: "healthcare-2d074",
  storageBucket: "healthcare-2d074.appspot.com",
  messagingSenderId: "251032268165",
  appId: "1:251032268165:web:f32565952f84ec58fca8ec",
  measurementId: "G-2RWQP5TW8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { auth, database, firestore, ref, set };
