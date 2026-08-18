"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { matchesAnyPath } from "../../navigation/routes";

type HeaderNavLinkProps = {
    href: string;
    className?: string;
    exact?: boolean;
    activePaths?: string[];
    children: ReactNode;
};

const HeaderNavLink = ({ href, className = "", exact = false, activePaths, children }: HeaderNavLinkProps) => {
    const pathname = usePathname();
    const active = matchesAnyPath(pathname, activePaths ?? [href], exact);

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
