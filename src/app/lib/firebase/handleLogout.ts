import { getAuth, signOut } from "firebase/auth";

export const handleLogout = () => {
    const auth = getAuth();
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    signOut(auth)
        .then(() => {
            console.log("User signed out");
        })
        .catch((error) => {
            console.error("Logout error:", error);
        });
};