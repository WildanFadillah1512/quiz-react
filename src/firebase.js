import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDRKaEOezwQSQqwO8ddM9tsa5JYuVkuc70",
    authDomain: "todo-list-2274d.firebaseapp.com",
    projectId: "todo-list-2274d",
    storageBucket: "todo-list-2274d.firebasestorage.app",
    messagingSenderId: "880308315487",
    appId: "1:880308315487:web:1caf2ae4d418c72df282ea",
    measurementId: "G-HZFZ8N8NTE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
