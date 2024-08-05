// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjYRfKsGS_KEL2T8m4aMAkkA8siYNM2Xo",
  authDomain: "inventory-management-30bd4.firebaseapp.com",
  projectId: "inventory-management-30bd4",
  storageBucket: "inventory-management-30bd4.appspot.com",
  messagingSenderId: "878041097354",
  appId: "1:878041097354:web:bc2d2f4440ff20502a7973",
  measurementId: "G-6JENDWKSDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
