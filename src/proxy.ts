import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { locales } from '../locale_config';

export default function proxy(req: NextRequest) {
    const segments = req.nextUrl.pathname.split('/').filter(Boolean);
    const requestedLocale = locales.find((locale) => locale === segments[0]);

    const pathname = requestedLocale ? `/${segments.slice(1).join('/')}` : req.nextUrl.pathname;

    const normalizedPathname = pathname === '/' ? pathname : pathname.replace(/\/$/, '');

    // Ensure redirects always include a valid locale prefix (e.g. /de)
    const activeLocale = requestedLocale || 'de';
    const localePrefix = `/${activeLocale}`;

    const token = req.cookies.get('authToken')?.value;

    const isAuthPage = normalizedPathname === '/login' || normalizedPathname === '/register';
    const isProtectedPage =
        normalizedPathname === '/profile' ||
        normalizedPathname.startsWith('/profile/') ||
        normalizedPathname === '/dashboard' ||
        normalizedPathname.startsWith('/dashboard/');

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL(`${localePrefix}/profile`, req.url));
    }

    if (isProtectedPage && !token) {
        return NextResponse.redirect(new URL(`${localePrefix}/login`, req.url));
    }

    if (requestedLocale) {
        const url = req.nextUrl.clone();
        url.pathname = normalizedPathname;

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-app-locale', requestedLocale);

        return NextResponse.rewrite(url, {
            request: { headers: requestHeaders },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
