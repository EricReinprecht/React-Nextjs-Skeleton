import { useRouter } from "next/navigation";

export const handleLogout = async (router: ReturnType<typeof useRouter>) => {
    try {
        const res = await fetch("/api/logout", { method: "POST" });

        if (!res.ok) {
            throw new Error("Logout failed");
        }

        console.log("User logged out successfully");

        router.push("/login");
    } catch (err: any) {
        console.error("Logout error:", err.message || err);
    }
};