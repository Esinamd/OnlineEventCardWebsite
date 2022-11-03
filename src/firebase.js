// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZTNvR64NnL6I0EI6P_Olo3at5k-6ymAc",
  authDomain: "adapt-inter-web.firebaseapp.com",
  projectId: "adapt-inter-web",
  storageBucket: "adapt-inter-web.appspot.com",
  messagingSenderId: "973157391479",
  appId: "1:973157391479:web:da8190ad3bab2cb123ba72",
  measurementId: "G-HH7BSLEY9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;