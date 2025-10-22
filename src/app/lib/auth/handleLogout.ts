import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

/**
 * Logs out the user by removing auth cookies and redirecting to login page.
 * @param router Next.js router instance from useRouter()
 */
export const handleLogout = (router: ReturnType<typeof useRouter>) => {
    console.log("Logging out...");

    Cookies.remove("authToken");

    router.push("/login");

    console.log("User logged out successfully");
};