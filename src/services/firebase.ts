import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";

// Replace with your Firebase config
const firebaseConfig = {
nothing
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
