type Router = { push: (href: string) => void };

export const logout = async (router: Router) => {
    const response = await fetch("/api/logout", { method: "POST" });
    if (!response.ok) throw new Error("Logout failed");
    router.push("/login");
};
