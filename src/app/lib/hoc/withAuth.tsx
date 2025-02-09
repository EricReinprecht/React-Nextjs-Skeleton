"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@context/authProvider";

const withAuth = <P extends object>(Component: React.FC<P>) => {
    return function ProtectedComponent(props: P) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push("/login");
            }
        }, [user, loading, router]);

        if (loading) {
            return <div>Loading...</div>;
        }

        return user ? <Component {...props} /> : null;
    };
};

export default withAuth;