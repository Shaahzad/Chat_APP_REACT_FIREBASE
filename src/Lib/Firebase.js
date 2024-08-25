import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_Api_Key,
  authDomain: "reactchat-4e2e2.firebaseapp.com",
  projectId: "reactchat-4e2e2",
  storageBucket: "reactchat-4e2e2.appspot.com",
  messagingSenderId: "119308601378",
  appId: "1:119308601378:web:fd184d14173bcfbcc6a27b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()