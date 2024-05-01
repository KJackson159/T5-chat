// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB22MrbFxOErHtQ0NoYIBxAg7Sb6JC7eVY",
    authDomain: "team5semesterproject.firebaseapp.com",
    projectId: "team5semesterproject",
    storageBucket: "team5semesterproject.appspot.com",
    messagingSenderId: "75177646655",
    appId: "1:75177646655:web:63626d40ee844e7972768a",
    measurementId: "G-YJWPY6VGNT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;

