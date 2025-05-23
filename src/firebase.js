import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQxtMUY80qFZr5ygWzY6D99TWIZ3ilc2o",
  authDomain: "chef-claude-2ab7a.firebaseapp.com",
  projectId: "chef-claude-2ab7a",
  storageBucket: "chef-claude-2ab7a.firebasestorage.app",
  messagingSenderId: "814091330647",
  appId: "1:814091330647:web:3b2291f18d9efe2e392f12"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);