"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type HeaderNavLinkProps = {
    href: string;
    className?: string;
    exact?: boolean;
    activePaths?: string[];
    children: ReactNode;
};

const withoutLocale = (path: string) => path.replace(/^\/(?:de|en)(?=\/|$)/, "") || "/";

const HeaderNavLink = ({ href, className = "", exact = false, activePaths, children }: HeaderNavLinkProps) => {
    const pathname = usePathname();
    const currentPath = withoutLocale(pathname ?? "/");
    const paths = (activePaths ?? [href]).map(withoutLocale);
    const active = paths.some((path) => exact
        ? currentPath === path
        : currentPath === path || currentPath.startsWith(`${path}/`)
    );

    return (
        <Link
            href={href}
            className={`${className}${active ? " active" : ""}`}
            aria-current={active ? "page" : undefined}
        >
            {children}
        </Link>
    );
};

export default HeaderNavLink;
