import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBRT4lJY8NWK3gREx1FO9yN5vQOYTVdVhE",
    authDomain: "petbook-312ee.firebaseapp.com",
    projectId: "petbook-312ee",
    storageBucket: "petbook-312ee.appspot.com",
    messagingSenderId: "131856805857",
    appId: "1:131856805857:web:10d1dcc02cc21db63d2ca0"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);