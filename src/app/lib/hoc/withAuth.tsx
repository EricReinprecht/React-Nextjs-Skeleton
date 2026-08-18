"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function withAuth<P extends object>(
    Component: ComponentType<P>,
) {
    function ProtectedComponent(props: P) {
        const [authenticated, setAuthenticated] = useState<boolean | null>(null);
        const router = useRouter();
        const locale = useLocale();

        useEffect(() => {
            let active = true;

            fetch("/api/auth/me", { credentials: "include" })
                .then((response) => {
                    if (!active) return;
                    setAuthenticated(response.ok);
                    if (!response.ok) router.replace(`/${locale}/login`);
                })
                .catch(() => {
                    if (!active) return;
                    setAuthenticated(false);
                    router.replace(`/${locale}/login`);
                });

            return () => {
                active = false;
            };
        }, [locale, router]);

        if (authenticated === null) {
            return <div>Loading...</div>;
        }

        if (!authenticated) {
            return null;
        }

        return <Component {...props} />;
    }

    ProtectedComponent.displayName =
        `withAuth(${Component.displayName ?? Component.name ?? "Component"})`;

    return ProtectedComponent;
}
