import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDAVl2HqYgLtgwrJ4V9cL68LDxg5OnoVTU",
    authDomain: "smit-mini-hackathon-c17b7.firebaseapp.com",
    projectId: "smit-mini-hackathon-c17b7",
    storageBucket: "smit-mini-hackathon-c17b7.appspot.com",
    messagingSenderId: "356873644328",
    appId: "1:356873644328:web:ad438002b10a985a2f481d",
    measurementId: "G-JSSSZ1GSHX"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);