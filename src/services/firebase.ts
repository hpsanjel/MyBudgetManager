import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";

// Replace with your Firebase config
const firebaseConfig = {
	apiKey: "AIzaSyDQJbC9hV_URYrINNwsXT0alZ2erOco6N0",
	authDomain: "hariswebapp.firebaseapp.com",
	projectId: "hariswebapp",
	storageBucket: "hariswebapp.firebasestorage.app",
	messagingSenderId: "720184336255",
	appId: "1:720184336255:web:16d2d0f5b86abc6806c44a",
	measurementId: "G-EVW6JCT0T7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth functions
export const registerUser = (email: string, password: string) => {
	return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email: string, password: string) => {
	return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
	return signOut(auth);
};

export const resetPassword = (email: string) => {
	return sendPasswordResetEmail(auth, email);
};

export { auth };
