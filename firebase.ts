// firebase.ts

import firebase, { initializeApp } from 'firebase/app';
import 'firebase/database';
import { getDatabase, } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyC5CkPJba3FqwakXuL1sxav5rQ1Fi4BM5A",
  authDomain: "chatting-a7185.firebaseapp.com",
  projectId: "chatting-a7185",
  storageBucket: "chatting-a7185.appspot.com",
  messagingSenderId: "544931120493",
  appId: "1:544931120493:web:772803c433026039d90664",
  measurementId: "G-R05MNRVCQY"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export { app, database };
