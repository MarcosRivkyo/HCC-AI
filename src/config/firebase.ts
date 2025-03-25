import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDOJoSj4BPVEORJDgIN5H-TJN9JvXQdEnA",
    authDomain: "hcc-ai.firebaseapp.com",
    projectId: "hcc-ai",
    storageBucket: "hcc-ai.firebasestorage.app",
    messagingSenderId: "822292218390",
    appId: "1:822292218390:web:5dffe0efc7b45a382a6b37"
  };
  
  
const app = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };


