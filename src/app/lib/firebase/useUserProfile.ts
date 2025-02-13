import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { User, UserEntity } from "@entities/user";

export function useUserProfile() {
    const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();

        // Listen for authentication changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setAuthUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user data from Firestore (users collection)
                const userRef = doc(db, "users", firebaseUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data() as User;
                    setUserProfile(new UserEntity(userData));
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { authUser, userProfile, loading };
}