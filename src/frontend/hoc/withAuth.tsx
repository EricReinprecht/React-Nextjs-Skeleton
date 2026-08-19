'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';

export default function withAuth<P extends object>(Component: ComponentType<P>) {
    function ProtectedComponent(props: P) {
        const [authenticated, setAuthenticated] = useState<boolean | null>(null);
        const router = useRouter();
        const locale = useLocale();

        useEffect(() => {
            let active = true;

            async function checkAuth() {
                try {
                    const response = await fetch('/api/auth/me', { credentials: 'include' });

                    if (!active) return;

                    if (response.ok) {
                        setAuthenticated(true);
                    } else {
                        // 401 / 403: Token is invalid or expired
                        setAuthenticated(false);
                        router.replace(`/${locale}/login`);
                    }
                } catch {
                    if (!active) return;
                    setAuthenticated(false);
                    router.replace(`/${locale}/login`);
                }
            }

            checkAuth();

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

    ProtectedComponent.displayName = `withAuth(${Component.displayName ?? Component.name ?? 'Component'})`;

    return ProtectedComponent;
}
