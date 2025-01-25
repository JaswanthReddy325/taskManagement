import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDehdZUhwp9Df-jRv_o_9kGktMoACvNkZU",
    authDomain: "e-commerce-f3e15.firebaseapp.com",
    projectId: "e-commerce-f3e15",
    storageBucket: "e-commerce-f3e15.firebasestorage.app",
    messagingSenderId: "1033262836899",
    appId: "1:1033262836899:web:2ca59aa53249bd5df8e316",
    measurementId: "G-FXVN3TJCET"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
