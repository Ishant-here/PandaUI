// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "pandaui.firebaseapp.com",
  projectId: "pandaui",
  storageBucket: "pandaui.firebasestorage.app",
  messagingSenderId: "253645779084",
  appId: "1:253645779084:web:c4c073bab45ab3acf78ba9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);



const provider = new GoogleAuthProvider();  



export { auth, provider }; 