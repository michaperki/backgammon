// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAl5dD48oaQPeXO4gXt20wg1vLuWwhQe2k",
  authDomain: "keyboardshortcuts-b88ba.firebaseapp.com",
  projectId: "keyboardshortcuts-b88ba",
  storageBucket: "keyboardshortcuts-b88ba.appspot.com",
  messagingSenderId: "541413759303",
  appId: "1:541413759303:web:878fc28f84b4bb66d01462",
  measurementId: "G-73ERLM4RQ8",
  databaseURL: "https://keyboardshortcuts-b88ba-default-rtdb.firebaseio.com/"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const database = getDatabase(app);

export { auth, database, ref, set };

export default app;