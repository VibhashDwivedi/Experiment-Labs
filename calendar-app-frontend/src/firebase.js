// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBk08H-P57L3lKWNZqPNn1Yx7MbwL4mBPA",
  authDomain: "experiment-labs-task.firebaseapp.com",
  projectId: "experiment-labs-task",
  storageBucket: "experiment-labs-task.appspot.com",
  messagingSenderId: "303745342593",
  appId: "1:303745342593:web:031454bde27851df308180",
  measurementId: "G-8P0FZTZRQY"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);