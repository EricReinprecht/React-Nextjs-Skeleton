"use client"; // ✅ Ensure it's a client component

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("Auth State Changed:", firebaseUser); // ✅ Debugging
            setUser(firebaseUser);
            setLoading(false); // ✅ Stop loading when Firebase responds
        });

        return () => unsubscribe(); // ✅ Cleanup function
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
