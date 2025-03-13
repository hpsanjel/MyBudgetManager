import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

interface AuthContextProps {
	currentUser: User | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({ currentUser: null, loading: true });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		loading,
	};

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
