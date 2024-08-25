import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_Api_Key,
  authDomain: import.meta.env.VITE_Auth_Domain,
  projectId: import.meta.env.VITE_Project_Id,
  storageBucket: import.meta.env.VITE_Storage_Bucket,
  messagingSenderId: import.meta.env.VITE_Messaging_Sender_Id,
  appId: import.meta.env.VITE_App_Id
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()