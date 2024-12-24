import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5p_07F1WC2yUPH47plZK9i5IGwyi11Ps",
  authDomain: "social-media-auth-d2684.firebaseapp.com",
  projectId: "social-media-auth-d2684",
  storageBucket: "social-media-auth-d2684.firebasestorage.app",
  messagingSenderId: "892820781364",
  appId: "1:892820781364:web:08b6fefd3889aba30f8d61",
  measurementId: "G-XFVJE0LMCG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
