import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAB-A4FBCbYASFOw512EyXTxUHg_KSIKTo",
  authDomain: "ecovision-13fc2.firebaseapp.com",
  projectId: "ecovision-13fc2",
  storageBucket: "ecovision-13fc2.firebasestorage.app",
  messagingSenderId: "1010357561094",
  appId: "1:1010357561094:web:1ced46d771278ce098a087"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };