import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDF4hKpkS8GjsXLPHmFN7UPxzaj8BpxoxM",
  authDomain: "erp-management-c5653.firebaseapp.com",
  projectId: "erp-management-c5653",
  storageBucket: "erp-management-c5653.appspot.com",
  messagingSenderId: "867484409411",
  appId: "1:867484409411:web:59d8a9f8c7f4c556a8bef6",
  measurementId: "G-PHCFJZJP50",
};

const app = initializeApp(firebaseConfig);
export const store = getFirestore(app);
export const database = getDatabase(app);
