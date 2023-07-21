// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, push, onValue, orderByChild, query, equalTo} from "firebase/database"; // Include the onValue function here

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDx9CcXq-0sTWj9QAV62q2FapdWDYSuvug",
  authDomain: "backgammon-b4c52.firebaseapp.com",
  projectId: "backgammon-b4c52",
  storageBucket: "backgammon-b4c52.appspot.com",
  messagingSenderId: "309444246510",
  appId: "1:309444246510:web:4df952b6f8f693ba80acff",
  measurementId: "G-RY4P3QM9B4",
  databaseURL: "https://backgammon-b4c52-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const addShortcutToDatabase = (shortcut, userId, userEmail) => {
  const newShortcutRef = ref(database, `users/${userId}/shortcuts`);
  const newShortcutData = {
    ...shortcut,
    userId,
    userEmail,
    deleted: false,
  };

  const newShortcutKey = push(newShortcutRef).key;
  const newShortcutWithKey = { ...newShortcutData, key: newShortcutKey };

  return set(newShortcutRef.child(newShortcutKey), newShortcutWithKey).then(
    () => newShortcutWithKey
  );
};

const updateShortcutInDatabase = (shortcutKey, updates) => {
  const databaseRef = ref(
    database,
    `users/${updates.userId}/shortcuts/${shortcutKey}`
  );
  return set(databaseRef, updates, { merge: true });
};

export {
  auth,
  database,
  ref,
  set,
  addShortcutToDatabase,
  updateShortcutInDatabase,
  onValue,
  push,
  orderByChild,
  query,
  equalTo,
};
