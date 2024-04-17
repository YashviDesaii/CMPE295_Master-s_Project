// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaqwHYOpwD902yBrykkkEJ-IdvlUlAcmc",
  authDomain: "masters-project-2024.firebaseapp.com",
  projectId: "masters-project-2024",
  storageBucket: "masters-project-2024.appspot.com",
  messagingSenderId: "404882900373",
  appId: "1:404882900373:web:ad8cb106e6bad27eea629c",
  measurementId: "G-DF9C6DH9WD"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, storage };