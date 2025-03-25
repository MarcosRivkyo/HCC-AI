import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOJoSj4BPVEORJDgIN5H-TJN9JvXQdEnA",
  authDomain: "hcc-ai.firebaseapp.com",
  projectId: "hcc-ai",
  storageBucket: "hcc-ai.firebasestorage.app",
  messagingSenderId: "822292218390",
  appId: "1:822292218390:web:5dffe0efc7b45a382a6b37"
};



// Inicializa Firebase
const app = initializeApp(firebaseConfig);


// Inicializa Firestore y Storage
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage };

