// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4NVwcEIgO3BmIec6q6yKJe8-67zrfkOo",
  authDomain: "finance-app-97f9a.firebaseapp.com",
  projectId: "finance-app-97f9a",
  storageBucket: "finance-app-97f9a.firebasestorage.app",
  messagingSenderId: "336787552936",
  appId: "1:336787552936:web:9b0b3909176ac1810b209d",
  measurementId: "G-VRZ6P19B1R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);