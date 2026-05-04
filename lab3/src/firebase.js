import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEryOKPs5Mx3wW6ZPlU4Tff44IiF56LYk",
  authDomain: "citybuild-72acd.firebaseapp.com",
  projectId: "citybuild-72acd",
  storageBucket: "citybuild-72acd.firebasestorage.app",
  messagingSenderId: "522419348059",
  appId: "1:522419348059:web:a8ffbaf88e9933227bd57e",
  measurementId: "G-1644N6VGT3"
};

// Ініціалізація головного додатку
const app = initializeApp(firebaseConfig);

// Отримуємо і ЕКСПОРТУЄМО авторизацію та базу даних, щоб інші файли могли їх використовувати
export const auth = getAuth(app);
export const db = getFirestore(app);