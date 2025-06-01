
// src/firebase/config.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCQhNuJ4alw6pjOYld32UYUQd16B8rrgk4",
  authDomain: "barangayinfomation.firebaseapp.com",
  projectId: "barangayinfomation",
  storageBucket: "barangayinfomation.firebasestorage.app",
  messagingSenderId: "1000726748836",
  appId: "1:1000726748836:web:fea7353fdeb7ebedcc5031",
  measurementId: "G-C8EFQXWWT6"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }