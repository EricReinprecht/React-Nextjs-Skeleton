import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { locales } from "../locale_config";

export function middleware(req: NextRequest) {
    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const requestedLocale = locales.find((locale) => locale === segments[0]);
    const pathname = requestedLocale
        ? `/${segments.slice(1).join("/")}`
        : req.nextUrl.pathname;
    const normalizedPathname = pathname === "/" ? pathname : pathname.replace(/\/$/, "");
    const localePrefix = requestedLocale ? `/${requestedLocale}` : "";
    const token = req.cookies.get("authToken");

    const isAuthPage = normalizedPathname === "/login" || normalizedPathname === "/register";
    const isProtectedPage =
        normalizedPathname === "/profile" ||
        normalizedPathname.startsWith("/profile/") ||
        normalizedPathname === "/dashboard" ||
        normalizedPathname.startsWith("/dashboard/");

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
        requestHeaders.set("x-app-locale", requestedLocale);

        return NextResponse.rewrite(url, {
            request: { headers: requestHeaders },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};

