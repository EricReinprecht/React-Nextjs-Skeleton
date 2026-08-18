export const PROFILE_ROUTES = {
    parties: ["/profile/my-parties", "/profile/show-parties"],
    tickets: ["/profile/my-tickets", "/profile/show-tickets"],
} as const;

export const normalizePath = (path: string | null) =>
    (path ?? "/").replace(/^\/(?:de|en)(?=\/|$)/, "") || "/";

export const matchesPath = (pathname: string, route: string, exact = false) =>
    exact
        ? pathname === route
        : pathname === route || pathname.startsWith(`${route}/`);

export const matchesAnyPath = (pathname: string | null, routes: readonly string[], exact = false) => {
    const currentPath = normalizePath(pathname);
    return routes.some((route) => matchesPath(currentPath, normalizePath(route), exact));
};

