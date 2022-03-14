import { initializeApp } from "firebase/app";
import {
    getAuth
} from "firebase/auth";
import {
    getFirestore
} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCQadISONL2SfSUFAS_1cXPZRMcAwiiLLk",
    authDomain: "letmeask-c4c4a.firebaseapp.com",
    databaseURL: "https://letmeask-c4c4a-default-rtdb.firebaseio.com",
    projectId: "letmeask-c4c4a",
    storageBucket: "letmeask-c4c4a.appspot.com",
    messagingSenderId: "636181704961",
    appId: "1:636181704961:web:d2fb788b734e0afe18eb00"

/*     apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATA_BASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID */
  };

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const database = getFirestore(app);

  export { auth, database};