// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBkFQKfbVlAkuZgFHUOhZEshR-08wkJm8U",
    authDomain: "pokeapi-74364.firebaseapp.com",
    projectId: "pokeapi-74364",
    storageBucket: "pokeapi-74364.firebasestorage.app",
    messagingSenderId: "546186583505",
    appId: "1:546186583505:web:4e70a341d91f7cf66514f0",
    measurementId: "G-VXHJDN959X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);